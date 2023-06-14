import { Request, Response, NextFunction } from 'express';
import { login, logout, refresh } from '../services/auth.service';
import { successResponse } from '../utils/response';
import AuthenticationError from '../errors/AuthenticationError';
import { getUserById } from '../services/user.service';
import { AuthRequest } from '../middlewares/authenticate';

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { accessToken, refreshToken, ...user } = await login(req.body);

    res.cookie('auth_token', refreshToken, {
      httpOnly: true,
      maxAge: 604800000,
      // sameSite: 'none',
      // secure: true,
    });

    res.json(successResponse('Login success', { ...user, token: accessToken }));
  } catch (error) {
    next(error);
  }
}

export async function verifyController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await getUserById((req as AuthRequest).user.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function refreshController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const refreshToken = req.cookies.auth_token;
    if (!refreshToken) {
      throw new AuthenticationError('Invalid refresh token');
    }
    const result = await refresh(refreshToken);
    res.json(successResponse('New token received', result));
  } catch (error) {
    next(error);
  }
}

export async function logoutController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const refreshToken = req.cookies.auth_token;
    if (!refreshToken) {
      throw new AuthenticationError('Invalid refresh token');
    }
    await logout(refreshToken);
    res.json(successResponse('Logout success'));
  } catch (error) {
    next(error);
  }
}
