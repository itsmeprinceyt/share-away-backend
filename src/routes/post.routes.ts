import { Router } from 'express';
import bodyParser from 'body-parser';
import { createPost, editPost, viewPost, deletePost, toggleHeart } from '../controllers/post.controller';

const router = Router();

router.post('/create', bodyParser.json({ limit: '500kb' }), createPost);
router.post('/edit', bodyParser.json({ limit: '500kb' }), editPost);
router.delete('/delete/:post_uuid', deletePost);
router.post('/heart/:post_uuid', toggleHeart);
router.get('/:post_uuid', viewPost);

export default router;