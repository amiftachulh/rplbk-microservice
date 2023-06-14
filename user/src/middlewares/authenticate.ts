import { Request, Response, NextFunction } from 'express';
import AuthenticationError from '../errors/AuthenticationError';
import { verifyAccessToken } from '../services/token.service';
import { prisma } from '../db/client';
import { User } from '@prisma/client';

export function authenticate() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const header = req.header('Authorization');
      if (!header) {
        throw new AuthenticationError('No authorization header');
      }

      const bearer = header.startsWith('Bearer ');
      if (!bearer) {
        throw new AuthenticationError('Invalid authorization header');
      }

      const token = header.split(' ')[1];
      const decoded = verifyAccessToken(token);

      if (!decoded) {
        throw new AuthenticationError('Invalid token');
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          displayName: true,
          username: true,
          bio: true,
          role: true,
        },
      });

      if (!user) {
        throw new AuthenticationError('User not found');
      }

      (req as AuthRequest).user = user;

      next();
    } catch (error) {
      next(error);
    }
  };
}

export type AuthRequest = Request & {
  user: Omit<User, 'password' | 'createdAt' | 'updatedAt'>;
};
