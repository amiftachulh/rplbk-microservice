import { Request, Response, NextFunction } from 'express';
import BadRequestError from '../errors/BadRequestError';
import { likePostById, unlikePostById } from '../services/like.service';
import { AuthRequest } from '../middlewares/authenticate';
import { successResponse } from '../utils/response';

export async function likePostByIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const postId = parseInt(req.params.postId);
    if (isNaN(postId)) {
      throw new BadRequestError('Invalid id');
    }
    await likePostById(postId, (req as AuthRequest).user.id);
    res.json(successResponse('You liked this post'));
  } catch (error) {
    next(error);
  }
}

export async function unlikePostByIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const postId = parseInt(req.params.postId);
    if (isNaN(postId)) {
      throw new BadRequestError('Invalid id');
    }
    await unlikePostById(postId, (req as AuthRequest).user.id);
    res.json(successResponse('You unliked this post'));
  } catch (error) {
    next(error);
  }
}
