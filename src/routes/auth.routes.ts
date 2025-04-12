import { Router } from 'express';
import { registerUser } from '../controllers/register.controller';
import { loginUser } from '../controllers/login-reset.controller';

const router = Router();

router.post('/register', registerUser);
router.post('/login',loginUser);

export default router;
