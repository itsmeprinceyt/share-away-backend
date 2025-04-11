import { Router } from 'express';
import tableRoutes from './tables.routes';
import authRoutes from './auth.routes';

const router = Router();

router.use('/tables', tableRoutes);
router.use('/auth', authRoutes);

export default router;
