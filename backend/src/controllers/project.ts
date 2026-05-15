import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middlewares/auth';

export const createProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, description, deadline } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        deadline: deadline ? new Date(deadline) : null,
        ownerId: userId,
      },
    });

    // Also add the owner as a team member
    await prisma.teamMember.create({
      data: {
        userId,
        projectId: project.id,
      },
    });

    res.status(201).json({ project });
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { teamMembers: { some: { userId } } }
        ]
      },
      include: {
        _count: {
          select: { tasks: true, teamMembers: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ projects });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const userId = req.user?.id;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        tasks: {
          include: { assignee: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: 'desc' }
        },
        teamMembers: {
          include: { user: { select: { id: true, name: true, avatar: true, email: true } } }
        },
        owner: { select: { id: true, name: true, email: true, avatar: true } }
      }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is authorized to view
    if (project.ownerId !== userId && !project.teamMembers.some(m => m.userId === userId) && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.status(200).json({ project });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { title, description, status, deadline } = req.body;
    const userId = req.user?.id;

    const existingProject = await prisma.project.findUnique({ where: { id } });
    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (existingProject.ownerId !== userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: Only owner can update' });
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        status,
        deadline: deadline ? new Date(deadline) : undefined,
      }
    });

    res.status(200).json({ project });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const userId = req.user?.id;

    const existingProject = await prisma.project.findUnique({ where: { id } });
    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (existingProject.ownerId !== userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: Only owner can delete' });
    }

    await prisma.project.delete({ where: { id } });

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};
