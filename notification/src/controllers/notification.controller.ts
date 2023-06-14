import { Request, Response, NextFunction } from 'express';
import { getNotifications } from '../services/notification.service';
import { AuthRequest } from '../middlewares/authenticate';
import { successResponse } from '../utils/response';

export async function getNotificationController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = (req as AuthRequest).user.id;
    const result = await getNotifications(userId);
    res.json(successResponse('Notifications retrieved', result));
  } catch (error) {
    next(error);
  }
}
