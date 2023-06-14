import { prisma } from '../db/client';
import axios from 'axios';
import {
  CreateCommentSchema,
  UpdateCommentSchema,
} from '../schema/comment.schema';
import NotFoundError from '../errors/NotFoundError';
import { sendMessage } from './producer.service';

export async function createComment(
  userId: number,
  postId: number,
  { body }: CreateCommentSchema
) {
  let postUserId;
  try {
    const response = await axios.get(
      `http://localhost:5002/api/get-post/${postId}`
    );
    postUserId = response.data.userId;
  } catch (error) {
    throw new NotFoundError('Post not found');
  }

  const result = await prisma.comment.create({
    data: { userId, postId, body },
  });
  await sendMessage(
    'comment',
    JSON.stringify({ userId: postUserId, sourceUserId: userId, postId })
  );
}

export async function getCommentsByPostId(postId: number) {
  try {
    const response = await axios.get(
      `http://localhost:5002/api/get-post/${postId}`
    );
  } catch (error) {
    throw new NotFoundError('Post not found');
  }
  return await prisma.comment.findMany({ where: { postId } });
}

export async function updateCommentById(
  id: number,
  userId: number,
  { body }: UpdateCommentSchema
) {
  const comment = await prisma.comment.findFirst({ where: { id, userId } });
  if (!comment) {
    throw new NotFoundError('Comment not found');
  }
  await prisma.comment.update({ where: { id }, data: { body } });
}

export async function deleteCommentById(id: number, userId: number) {
  const comment = await prisma.comment.findFirst({ where: { id, userId } });
  if (!comment) {
    throw new NotFoundError('Comment not found');
  }
  await prisma.comment.delete({ where: { id } });
}

export async function deleteCommentsByPostId(postId: number) {
  await prisma.comment.deleteMany({ where: { postId } });
}

export async function deleteCommentsByUserId(userId: number) {
  await prisma.comment.deleteMany({ where: { userId } });
}
