import { Router } from 'express';
import {
  changePasswordSchema,
  userCreateSchema,
  userUpdateSchema,
} from '../schemas/user.schema';
import { validate } from '../middlewares/validate';
import {
  changePasswordController,
  deleteProfileController,
  deleteUserByIdController,
  getAllUsersController,
  getUserByIdController,
  registerController,
  updateProfileController,
  updateUserByIdController,
} from '../controllers/user.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

export const userRoute = Router();

userRoute
  .route('/')
  .post(validate(userCreateSchema), registerController)
  .get(authenticate(), getAllUsersController)
  .patch(validate(userUpdateSchema), authenticate(), updateProfileController)
  .delete(authenticate(), deleteProfileController);

userRoute.patch(
  '/change-password',
  validate(changePasswordSchema),
  authenticate(),
  changePasswordController
);

userRoute
  .route('/:id')
  .get(getUserByIdController)
  .patch(
    validate(userUpdateSchema),
    authenticate(),
    authorize(['ADMIN']),
    updateUserByIdController
  )
  .delete(authenticate(), authorize(['ADMIN']), deleteUserByIdController);
