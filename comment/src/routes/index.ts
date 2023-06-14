import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { commentRouter } from './comment.router';

export const router = Router();

router.use('/comment', authenticate(), commentRouter);
