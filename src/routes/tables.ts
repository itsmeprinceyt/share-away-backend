import { Router } from 'express';
import { getTables } from '../controllers/tables.controller';

const router = Router();

router.get('/', getTables);

export default router;
