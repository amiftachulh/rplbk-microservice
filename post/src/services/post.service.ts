import config from '../config';
import { prisma } from '../db/client';
import NotFoundError from '../errors/NotFoundError';
import { PostCreateSchema, PostUpdateSchema } from '../schemas/post.schema';
import axios from 'axios';
import { sendMessage } from './producer.service';

export async function createPost(userId: number, { body }: PostCreateSchema) {
  await prisma.post.create({ data: { userId, body } });
}

export async function getPostsByUserId(userId: number) {
  try {
    await axios.get(`${config.service.user}/api/user/${userId}`);
  } catch (error) {
    throw new NotFoundError('User not found');
  }
  const posts = await prisma.post.findMany({
    where: { userId },
    select: {
      id: true,
      body: true,
      userId: true,
    },
    take: 10,
  });

  const data = posts.map(async (post) => {
    const likes = await prisma.like.count({ where: { postId: post.id } });

    return {
      ...post,
      likes,
    };
  });

  return await Promise.all(data);
}

export async function getPostById(id: number) {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new NotFoundError('Post not found');
  return post;
}

export async function updatePostById(
  id: number,
  userId: number,
  { body }: PostUpdateSchema
) {
  const post = await prisma.post.findFirst({ where: { id, userId } });
  if (!post) {
    throw new NotFoundError('Post not found');
  }
  await prisma.post.update({
    where: { id },
    data: { body },
  });
}

export async function deletePostById(id: number, userId: number) {
  const post = await prisma.post.findFirst({ where: { id, userId } });
  if (!post) {
    throw new NotFoundError('Post not found');
  }
  await sendMessage('postDeleted', JSON.stringify({ postId: post.id }));
  await prisma.post.delete({ where: { id } });
}
