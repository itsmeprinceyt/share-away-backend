import { Router } from 'express';
import { getHeartNotifications } from '../controllers/notifications.controller';
import userCheckJWT from '../middleware/userCheckJWT';

const router = Router();

router.get('/heart',userCheckJWT, getHeartNotifications);

export default router;
