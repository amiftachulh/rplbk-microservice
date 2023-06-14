import z, { TypeOf } from 'zod';

export const postCreateSchema = z
  .object({
    body: z.string().min(1).max(15000),
  })
  .strict();

export const postUpdateSchema = postCreateSchema;

export type PostCreateSchema = z.infer<typeof postCreateSchema>;
export type PostUpdateSchema = z.infer<typeof postUpdateSchema>;
