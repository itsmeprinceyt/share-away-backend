import { Router } from 'express';
import tableRoutes from './tables.routes';
import authRoutes from './auth.routes';
import userRoutes from './user.route';
import editRoutes from './edit.routes';

const router = Router();

router.use('/tables', tableRoutes);
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/edit', editRoutes);

export default router;
