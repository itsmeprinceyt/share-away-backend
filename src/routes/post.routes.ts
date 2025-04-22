import { Router } from 'express';
import bodyParser from 'body-parser';
import { createPost, editPost, viewPost, deletePost, getAllPosts } from '../controllers/post.controller';
import userCheckJWT from '../middleware/userCheckJWT';

const router = Router();

router.post('/create', userCheckJWT, bodyParser.json({ limit: '500kb' }), createPost);
router.post('/edit', userCheckJWT, bodyParser.json({ limit: '500kb' }), editPost);
router.delete('/delete/:post_uuid', userCheckJWT, deletePost);
router.get('/get-posts', userCheckJWT, getAllPosts);
router.get('/:post_uuid', viewPost);

export default router;