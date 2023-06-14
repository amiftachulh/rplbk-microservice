import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import { loginSchema } from '../schemas/user.schema';
import {
  loginController,
  logoutController,
  refreshController,
  verifyController,
} from '../controllers/auth.controller';

export const authRoute = Router();

authRoute.get('/verify', authenticate(), verifyController);

authRoute
  .route('/')
  .post(validate(loginSchema), loginController)
  .get(refreshController)
  .delete(authenticate(), logoutController);
