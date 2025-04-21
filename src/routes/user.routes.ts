import express from 'express';
import { getUserByUUID, deleteUserByUUID, checkUserByUUID, banUser, revokeBan, banUserEmail } from '../controllers/user.controller';

const router = express.Router();

router.get('/check/:uuid', checkUserByUUID);
router.delete('/delete/:uuid', deleteUserByUUID);
router.delete('/ban/:uuid', banUser);
router.post('/revoke/:email', revokeBan)
router.delete('/ban-email/:email', banUserEmail)
router.get('/:uuid', getUserByUUID);

export default router;
