import express from 'express';
import { getUserByUUID } from '../controllers/user.controller';

const router = express.Router();

router.get('/:uuid', getUserByUUID);

export default router;
