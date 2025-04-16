import { Router } from 'express';
import { getHeartNotifications } from '../controllers/notifications.controller';

const router = Router();

router.get('/heart', getHeartNotifications);

export default router;
