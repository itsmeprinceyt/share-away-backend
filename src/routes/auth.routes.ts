import { Router } from 'express';
import { registerUser, verifyUser } from '../controllers/register.controller';

const router = Router();

router.post('/register', registerUser);
router.post('/verify', verifyUser);

export default router;
