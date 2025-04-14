import { Router } from 'express';
import bodyParser from 'body-parser';
import { createPost, editPost, viewPost, deletePost } from '../controllers/post.controller';

const router = Router();

router.post('/create', bodyParser.json({ limit: '500kb' }), createPost);
router.post('/edit', bodyParser.json({ limit: '500kb' }), editPost);
router.post('/delete', deletePost);
router.get('/:post_uuid', viewPost);

export default router;