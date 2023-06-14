import { Request, Response, NextFunction } from 'express';
import {
  createComment,
  deleteCommentById,
  getCommentsByPostId,
  updateCommentById,
} from '../services/comment.service';
import { AuthRequest } from '../middlewares/authenticate';
import BadRequestError from '../errors/BadRequestError';
import { successResponse } from '../utils/response';

export async function createCommentController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = (req as AuthRequest).user.id;
    const postId = parseInt(req.params.postId);
    if (isNaN(postId)) throw new BadRequestError('Invalid post id');
    await createComment(userId, postId, req.body);
    res.status(201).json(successResponse('Comment created'));
  } catch (error) {
    next(error);
  }
}

export async function getCommentsByPostIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const postId = parseInt(req.params.postId);
    if (isNaN(postId)) throw new BadRequestError('Invalid post id');
    const result = await getCommentsByPostId(postId);
    res.json(successResponse('Comments retrieved', result));
  } catch (error) {
    next(error);
  }
}

export async function updateCommentByIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw new BadRequestError('Invalid id');
    const userId = (req as AuthRequest).user.id;
    await updateCommentById(id, userId, req.body);
    res.json(successResponse('Comment updated'));
  } catch (error) {
    next(error);
  }
}

export async function deleteCommentByIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw new BadRequestError('Invalid id');
    const userId = (req as AuthRequest).user.id;
    await deleteCommentById(id, userId);
    res.json(successResponse('Comment deleted'));
  } catch (error) {
    next(error);
  }
}
