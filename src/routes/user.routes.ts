import express from 'express';
import { getUserByUUID, deleteUserByUUID, checkUserByUUID, banUser, revokeBan, banUserEmail, searchUsers, resetPassword } from '../controllers/user.controller';
import userCheckJWT from '../middleware/userCheckJWT';
import adminCheckJWT from '../middleware/adminCheckJWT';

const router = express.Router();

router.get('/search-users',userCheckJWT, searchUsers);
router.get('/check/:uuid',userCheckJWT, checkUserByUUID);
router.delete('/delete/:uuid',userCheckJWT, deleteUserByUUID);
router.delete('/ban/:uuid',userCheckJWT, adminCheckJWT, banUser);
router.post('/revoke/:email',userCheckJWT, adminCheckJWT, revokeBan)
router.delete('/ban-email/:email',userCheckJWT, adminCheckJWT, banUserEmail)
router.post('/reset-password', userCheckJWT, adminCheckJWT, resetPassword);
router.get('/:uuid', getUserByUUID);

export default router;
