import { Router } from 'express';
import { addHeart, removeHeart } from '../controllers/hearts.controller';

const router = Router();

router.post('/', addHeart);
router.delete('/', removeHeart);

export default router;