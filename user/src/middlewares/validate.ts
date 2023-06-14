import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import BadRequestError from '../errors/BadRequestError';

export function validate(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}
