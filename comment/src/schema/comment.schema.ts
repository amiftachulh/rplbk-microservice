import z from 'zod';

export const createCommentSchema = z
  .object({
    body: z.string().min(1).max(500),
  })
  .strict();

export const updateCommentSchema = createCommentSchema;

export type CreateCommentSchema = z.infer<typeof createCommentSchema>;
export type UpdateCommentSchema = z.infer<typeof updateCommentSchema>;
