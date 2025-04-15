import express from 'express';
import { getUserByUUID, deleteUserByUUID, checkUserByUUID, banUser, revokeBan } from '../controllers/user.controller';

const router = express.Router();

router.get('/check/:uuid', checkUserByUUID);
router.delete('/delete/:uuid', deleteUserByUUID);
router.delete('/ban/:uuid', banUser);
router.post('/revoke/:email', revokeBan)
router.get('/:uuid', getUserByUUID);

export default router;
