import { Request, Response, NextFunction } from 'express';
import ClientError from '../errors/ClientError';
import { errorResponse } from '../utils/response';

export function errorHandler() {
  return (error: any, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      return next(error);
    }

    if (error instanceof ClientError) {
      return res
        .status(error.statusCode)
        .json(errorResponse(error.message, error.details));
    }

    res.status(500).json(errorResponse('Internal server error'));
  };
}
