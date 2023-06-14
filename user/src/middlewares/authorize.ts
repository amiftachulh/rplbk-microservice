import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { AuthRequest } from './authenticate';
import AuthorizationError from '../errors/AuthorizationError';

export function authorize(roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!roles.includes((req as AuthRequest).user.role)) {
        throw new AuthorizationError("You can't access this resource");
      }
      return next();
    } catch (error) {
      next(error);
    }
  };
}
