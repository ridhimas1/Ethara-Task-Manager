import { Router } from 'express';
import authRoutes from './auth';
import projectRoutes from './project';
import taskRoutes from './task';

const router = Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);

export default router;
