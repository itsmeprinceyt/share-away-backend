import { Router } from 'express';
import { getTables, getTableData } from '../controllers/tables.controller';
import userCheckJWT from '../middleware/userCheckJWT';
import adminCheckJWT from '../middleware/adminCheckJWT';

const router = Router();

router.get('/',userCheckJWT, adminCheckJWT, getTables);
router.get('/:name',userCheckJWT, adminCheckJWT,getTableData);

export default router;
