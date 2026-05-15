import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middlewares/auth';

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, description, priority, status, dueDate, assigneeId, projectId } = req.body;
    
    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || 'MEDIUM',
        status: status || 'TODO',
        dueDate: dueDate ? new Date(dueDate) : null,
        assigneeId,
        projectId,
      },
      include: {
        assignee: { select: { id: true, name: true, avatar: true } },
        project: { select: { id: true, title: true } }
      }
    });

    res.status(201).json({ task });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId, status } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Build query
    const whereClause: any = {};
    if (projectId) whereClause.projectId = String(projectId);
    if (status) whereClause.status = String(status);
    
    // If not admin, only see tasks where user is assignee or part of the project
    if (req.user?.role !== 'ADMIN') {
      whereClause.project = {
        OR: [
          { ownerId: userId },
          { teamMembers: { some: { userId } } }
        ]
      };
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        assignee: { select: { id: true, name: true, avatar: true } },
        project: { select: { id: true, title: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ tasks });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { title, description, priority, status, dueDate, assigneeId } = req.body;

    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assigneeId,
      },
      include: {
        assignee: { select: { id: true, name: true, avatar: true } },
        project: { select: { id: true, title: true } }
      }
    });

    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;

    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await prisma.task.delete({ where: { id } });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};
