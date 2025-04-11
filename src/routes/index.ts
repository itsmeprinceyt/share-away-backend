import { Router } from 'express';
import tableRoutes from './tables.routes';

const router = Router();

router.use('/tables', tableRoutes);

export default router;
