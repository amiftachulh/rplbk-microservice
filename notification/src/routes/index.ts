import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { getNotificationController } from '../controllers/notification.controller';

export const router = Router();

router.get('/notification', authenticate(), getNotificationController);
