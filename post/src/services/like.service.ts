import { prisma } from '../db/client';
import BadRequestError from '../errors/BadRequestError';
import ConflictError from '../errors/ConflictError';
import { sendMessage } from './producer.service';

export async function likePostById(postId: number, userId: number) {
  const like = await prisma.like.findFirst({ where: { postId, userId } });
  if (like) {
    throw new ConflictError('You already liked this post');
  }
  const result = await prisma.like.create({
    data: { postId, userId },
    include: { Post: true },
  });
  await sendMessage(
    'postLike',
    JSON.stringify({ userId: result.Post.userId, sourceUserId: userId, postId })
  );
}

export async function unlikePostById(postId: number, userId: number) {
  const like = await prisma.like.findFirst({ where: { postId, userId } });
  if (!like) {
    throw new BadRequestError('You are not liked this post');
  }
  await prisma.like.delete({ where: { id: like.id } });
}
