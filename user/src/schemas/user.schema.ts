import z from 'zod';

export const userCreateSchema = z
  .object({
    displayName: z.string().min(1).max(60),
    username: z
      .string()
      .min(4)
      .max(30)
      .regex(/^[a-zA-Z0-9._]+$/),
    password: z.string().min(8).max(32),
    bio: z.string().max(1000).nullable(),
  })
  .strict();

export const loginSchema = z
  .object({
    username: z
      .string()
      .min(4)
      .max(30)
      .regex(/^[a-zA-Z0-9._]+$/),
    password: z.string().min(8).max(32),
  })
  .strict();

export const profileUpdateSchema = z
  .object({
    displayName: z.string().min(1).max(60),
    username: z
      .string()
      .min(4)
      .max(30)
      .regex(/^[a-zA-Z0-9._]+$/),
    bio: z.string().max(1000).nullable(),
  })
  .strict();

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8).max(32),
    newPassword: z.string().min(8).max(32),
    confirmPassword: z.string().min(8).max(32),
  })
  .strict();

export const userUpdateSchema = z
  .object({
    displayName: z.string().min(1).max(60),
    username: z
      .string()
      .min(4)
      .max(30)
      .regex(/^[a-zA-Z0-9._]+$/),
    bio: z.string().max(1000).nullable(),
    password: z.string().min(8).max(32),
  })
  .strict();

export type UserCreateSchema = z.infer<typeof userCreateSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type ProfileUpdateSchema = z.infer<typeof profileUpdateSchema>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
export type UserUpdateSchema = z.infer<typeof userUpdateSchema>;
