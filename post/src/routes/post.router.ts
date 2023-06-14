import { Router } from 'express';
import {
  createPostController,
  getPostsByUserIdController,
  updatePostByIdController,
  deletePostByIdController,
} from '../controllers/post.controller';
import {
  likePostByIdController,
  unlikePostByIdController,
} from '../controllers/like.controller';
import { validate } from '../middlewares/validate';
import { postCreateSchema, postUpdateSchema } from '../schemas/post.schema';

export const postRouter = Router();

postRouter.post('/like/:postId', likePostByIdController);
postRouter.delete('/like/:postId', unlikePostByIdController);

postRouter.post('/', validate(postCreateSchema), createPostController);
postRouter.get('/:userId', getPostsByUserIdController);
postRouter.patch('/:id', validate(postUpdateSchema), updatePostByIdController);
postRouter.delete('/:id', deletePostByIdController);
