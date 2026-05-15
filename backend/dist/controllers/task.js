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
exports.deleteTask = exports.updateTask = exports.getTasks = exports.createTask = void 0;
const prisma_1 = require("../utils/prisma");
const createTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, priority, status, dueDate, assigneeId, projectId } = req.body;
        if (!projectId) {
            return res.status(400).json({ message: 'Project ID is required' });
        }
        const task = yield prisma_1.prisma.task.create({
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
    }
    catch (error) {
        next(error);
    }
});
exports.createTask = createTask;
const getTasks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { projectId, status } = req.query;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Build query
        const whereClause = {};
        if (projectId)
            whereClause.projectId = String(projectId);
        if (status)
            whereClause.status = String(status);
        // If not admin, only see tasks where user is assignee or part of the project
        if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'ADMIN') {
            whereClause.project = {
                OR: [
                    { ownerId: userId },
                    { teamMembers: { some: { userId } } }
                ]
            };
        }
        const tasks = yield prisma_1.prisma.task.findMany({
            where: whereClause,
            include: {
                assignee: { select: { id: true, name: true, avatar: true } },
                project: { select: { id: true, title: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ tasks });
    }
    catch (error) {
        next(error);
    }
});
exports.getTasks = getTasks;
const updateTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const { title, description, priority, status, dueDate, assigneeId } = req.body;
        const existingTask = yield prisma_1.prisma.task.findUnique({ where: { id } });
        if (!existingTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        const task = yield prisma_1.prisma.task.update({
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
    }
    catch (error) {
        next(error);
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const existingTask = yield prisma_1.prisma.task.findUnique({ where: { id } });
        if (!existingTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        yield prisma_1.prisma.task.delete({ where: { id } });
        res.status(200).json({ message: 'Task deleted successfully' });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteTask = deleteTask;
