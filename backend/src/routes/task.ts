import { Router } from 'express';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/task';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
