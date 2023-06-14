import { Request, Response, NextFunction } from 'express';
import {
  changePassword,
  createUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  updateProfileById,
  updateUserById,
} from '../services/user.service';
import { successResponse } from '../utils/response';
import { AuthRequest } from '../middlewares/authenticate';
import BadRequestError from '../errors/BadRequestError';

export async function registerController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await createUser(req.body);
    res.status(201).json(successResponse('Register success'));
  } catch (error) {
    next(error);
  }
}

export async function getAllUsersController(
  req: Request<unknown, unknown, unknown, { page: string; search: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const page = parseInt(req.query.page);
    const users = await getAllUsers(isNaN(page) ? 1 : page, req.query.search);
    res.json(successResponse('Users retrieved', users));
  } catch (error) {
    next(error);
  }
}

export async function getUserByIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new BadRequestError('Invalid ID');
    }
    const user = await getUserById(id);
    res.json(successResponse('User retrieved', user));
  } catch (error) {
    next(error);
  }
}

export async function updateProfileController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await updateProfileById((req as AuthRequest).user.id, req.body);
    res.json(successResponse('Update profile success'));
  } catch (error) {
    next(error);
  }
}

export async function updateUserByIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new BadRequestError('Invalid ID');
    }
    await updateUserById(id, req.body);
    res.json(successResponse('User updated'));
  } catch (error) {
    next(error);
  }
}

export async function changePasswordController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await changePassword((req as AuthRequest).user.id, req.body);
    res.json(successResponse('Password changed'));
  } catch (error) {
    next(error);
  }
}

export async function deleteProfileController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await deleteUserById((req as AuthRequest).user.id);
    res.json(successResponse('Your profile is deleted'));
  } catch (error) {
    next(error);
  }
}

export async function deleteUserByIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new BadRequestError('Invalid ID');
    }
    await deleteUserById(id);
    res.json(successResponse('User deleted'));
  } catch (error) {
    next(error);
  }
}
