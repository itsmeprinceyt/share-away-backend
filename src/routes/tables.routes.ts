import { Router } from 'express';
import { getTables, getTableData } from '../controllers/tables.controller';

const router = Router();

router.get('/', getTables);
router.get('/:name',getTableData);

export default router;
