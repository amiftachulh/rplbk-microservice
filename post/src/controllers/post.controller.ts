import { Request, Response, NextFunction } from 'express';
import {
  createPost,
  deletePostById,
  getPostById,
  getPostsByUserId,
  updatePostById,
} from '../services/post.service';
import { AuthRequest } from '../middlewares/authenticate';
import { successResponse } from '../utils/response';
import BadRequestError from '../errors/BadRequestError';

export async function createPostController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await createPost((req as AuthRequest).user.id, req.body);
    res.status(201).json(successResponse('Post created'));
  } catch (error) {
    next(error);
  }
}

export async function getPostsByUserIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      throw new BadRequestError('Invalid id');
    }
    const result = await getPostsByUserId(userId);
    res.json(successResponse('Posts retrieved', result));
  } catch (error) {
    next(error);
  }
}

export async function getPostByIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new BadRequestError('Invalid id');
    }
    const result = await getPostById(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function updatePostByIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new BadRequestError('Invalid id');
    }
    await updatePostById(id, (req as AuthRequest).user.id, req.body);
    res.json(successResponse('Post updated'));
  } catch (error) {
    next(error);
  }
}

export async function deletePostByIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new BadRequestError('Invalid id');
    }
    await deletePostById(id, (req as AuthRequest).user.id);
    res.json(successResponse('Post deleted'));
  } catch (error) {
    next(error);
  }
}
