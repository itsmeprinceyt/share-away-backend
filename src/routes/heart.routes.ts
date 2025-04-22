import { Router } from 'express';
import { addHeart, removeHeart } from '../controllers/hearts.controller';
import userCheckJWT from '../middleware/userCheckJWT';

const router = Router();

router.post('/',userCheckJWT, addHeart);
router.delete('/',userCheckJWT, removeHeart);

export default router;