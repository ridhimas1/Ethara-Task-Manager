"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.getProjectById = exports.getProjects = exports.createProject = void 0;
const prisma_1 = require("../utils/prisma");
const createProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, description, deadline } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const project = yield prisma_1.prisma.project.create({
            data: {
                title,
                description,
                deadline: deadline ? new Date(deadline) : null,
                ownerId: userId,
            },
        });
        // Also add the owner as a team member
        yield prisma_1.prisma.teamMember.create({
            data: {
                userId,
                projectId: project.id,
            },
        });
        res.status(201).json({ project });
    }
    catch (error) {
        next(error);
    }
});
exports.createProject = createProject;
const getProjects = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const projects = yield prisma_1.prisma.project.findMany({
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
    }
    catch (error) {
        next(error);
    }
});
exports.getProjects = getProjects;
const getProjectById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const id = req.params.id;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const project = yield prisma_1.prisma.project.findUnique({
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
        if (project.ownerId !== userId && !project.teamMembers.some(m => m.userId === userId) && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'ADMIN') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        res.status(200).json({ project });
    }
    catch (error) {
        next(error);
    }
});
exports.getProjectById = getProjectById;
const updateProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const id = req.params.id;
        const { title, description, status, deadline } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const existingProject = yield prisma_1.prisma.project.findUnique({ where: { id } });
        if (!existingProject) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (existingProject.ownerId !== userId && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'ADMIN') {
            return res.status(403).json({ message: 'Forbidden: Only owner can update' });
        }
        const project = yield prisma_1.prisma.project.update({
            where: { id },
            data: {
                title,
                description,
                status,
                deadline: deadline ? new Date(deadline) : undefined,
            }
        });
        res.status(200).json({ project });
    }
    catch (error) {
        next(error);
    }
});
exports.updateProject = updateProject;
const deleteProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const id = req.params.id;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const existingProject = yield prisma_1.prisma.project.findUnique({ where: { id } });
        if (!existingProject) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (existingProject.ownerId !== userId && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'ADMIN') {
            return res.status(403).json({ message: 'Forbidden: Only owner can delete' });
        }
        yield prisma_1.prisma.project.delete({ where: { id } });
        res.status(200).json({ message: 'Project deleted successfully' });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteProject = deleteProject;
