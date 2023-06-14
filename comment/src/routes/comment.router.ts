import { Router } from 'express';
import {
  createCommentController,
  deleteCommentByIdController,
  getCommentsByPostIdController,
  updateCommentByIdController,
} from '../controllers/comment.controller';

export const commentRouter = Router();

commentRouter.post('/:postId', createCommentController);
commentRouter.get('/:postId', getCommentsByPostIdController);
commentRouter.patch('/:id', updateCommentByIdController);
commentRouter.delete('/:id', deleteCommentByIdController);
