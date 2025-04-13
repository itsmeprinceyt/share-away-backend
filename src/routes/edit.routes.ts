import { Router } from 'express';
import bodyParser from 'body-parser';
import { editPassword, editPfp } from '../controllers/edit.controller';

const router = Router();

router.post('/edit-password', editPassword);
router.post('/edit-pfp', bodyParser.json({ limit: '500kb' }),editPfp);

export default router;
