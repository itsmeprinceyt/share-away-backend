import express from 'express';
import { getUserByUUID, deleteUserByUUID, checkUserByUUID } from '../controllers/user.controller';

const router = express.Router();

router.get('/check/:uuid',checkUserByUUID);
router.delete('/delete/:uuid', deleteUserByUUID);
router.get('/:uuid', getUserByUUID);

export default router;
