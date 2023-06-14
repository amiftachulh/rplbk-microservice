import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import AuthenticationError from '../errors/AuthenticationError';
import { errorResponse } from '../utils/response';

type User = {
  id: number;
  displayName: string;
  username: string;
  bio: string | null;
  role: string;
};

export type AuthRequest = Request & { user: User };

export function authenticate() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await axios.get(
        'http://localhost:5001/api/auth/verify',
        {
          headers: { Authorization: req.header('Authorization') },
        }
      );
      if (response.status === 401) {
        throw new AuthenticationError('Authentication error');
      }
      (req as AuthRequest).user = response.data;
      next();
    } catch (error) {
      res.status(401).json(errorResponse('Invalid token'));
    }
  };
}
