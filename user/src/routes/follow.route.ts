import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import {
  followController,
  getFollowedUsersController,
  getFollowersController,
  unfollowController,
} from '../controllers/follow.controller';

export const followRoute = Router();

followRoute
  .route('/:id')
  .post(authenticate(), followController)
  .delete(authenticate(), unfollowController);

followRoute.get('/followers', authenticate(), getFollowersController);
followRoute.get('/followed', authenticate(), getFollowedUsersController);
