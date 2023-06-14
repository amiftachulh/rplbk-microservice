import { Router } from 'express';
import { authRoute } from './auth.route';
import { userRoute } from './user.route';
import { followRoute } from './follow.route';

export const routes = Router();

routes.use('/auth', authRoute);
routes.use('/follow', followRoute);
routes.use('/user', userRoute);
