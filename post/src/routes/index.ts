import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { postRouter } from './post.router';
import { getPostByIdController } from '../controllers/post.controller';

export const router = Router();

router.use('/post', authenticate(), postRouter);
router.get('/get-post/:id', getPostByIdController);
