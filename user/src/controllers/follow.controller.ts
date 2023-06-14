import { Request, Response, NextFunction } from 'express';
import {
  follow,
  getFollowedUsers,
  getFollowers,
  unfollow,
} from '../services/follow.service';
import BadRequestError from '../errors/BadRequestError';
import { AuthRequest } from '../middlewares/authenticate';
import { successResponse } from '../utils/response';

export async function followController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const followedUserId = parseInt(req.params.id);
    if (isNaN(followedUserId)) {
      throw new BadRequestError('Invalid ID');
    }
    await follow((req as AuthRequest).user.id, followedUserId);
    res.json(successResponse('User followed'));
  } catch (error) {
    next(error);
  }
}

export async function getFollowersController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const followers = await getFollowers((req as AuthRequest).user.id);
    res.json(successResponse('Followers retrieved', followers));
  } catch (error) {
    next(error);
  }
}

export async function getFollowedUsersController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const followedUsers = await getFollowedUsers((req as AuthRequest).user.id);
    res.json(successResponse('Followers retrieved', followedUsers));
  } catch (error) {
    next(error);
  }
}

export async function unfollowController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const followedUserId = parseInt(req.params.id);
    if (isNaN(followedUserId)) {
      throw new BadRequestError('Invalid ID');
    }
    await unfollow((req as AuthRequest).user.id, followedUserId);
    res.json(successResponse('User unfollowed'));
  } catch (error) {
    next(error);
  }
}
