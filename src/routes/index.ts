import { Router } from 'express';
import tableRoutes from './tables.routes';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import editRoutes from './edit.routes';
import postRoutes from './post.routes';
import heartRoutes from './heart.routes';
import notificaionRoutes from './notifications.routes';

const router = Router();

router.use('/tables', tableRoutes);
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/edit', editRoutes);
router.use('/post', postRoutes);
router.use('/heart', heartRoutes);
router.use('/notifications', notificaionRoutes);

export default router;
