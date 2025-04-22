import { Router } from 'express';
import bodyParser from 'body-parser';
import { editPassword, editPfp } from '../controllers/edit.controller';
import userCheckJWT from '../middleware/userCheckJWT';

const router = Router();

router.post('/edit-password', userCheckJWT, editPassword);
router.post('/edit-pfp', userCheckJWT, bodyParser.json({ limit: '500kb' }), editPfp);

export default router;
