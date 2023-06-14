import { prisma } from '../db/client';
import bcrypt from 'bcrypt';
import {
  ChangePasswordSchema,
  UserCreateSchema,
  UserUpdateSchema,
} from '../schemas/user.schema';
import ConflictError from '../errors/ConflictError';
import NotFoundError from '../errors/NotFoundError';
import { getFollowedCount, getFollowersCount } from './follow.service';
import AuthenticationError from '../errors/AuthenticationError';
import BadRequestError from '../errors/BadRequestError';
import { publishMessage } from './producer.service';

export async function createUser({
  displayName,
  username,
  password,
  bio,
}: UserCreateSchema) {
  const duplicate = await prisma.user.findUnique({
    where: { username },
  });

  if (duplicate) {
    throw new ConflictError('Username already taken');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      displayName,
      username,
      password: hashedPassword,
      bio,
    },
  });
}

export async function getAllUsers(page: number = 1, search?: string) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      displayName: true,
      username: true,
    },
    where: search
      ? {
          OR: [
            {
              displayName: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              username: {
                contains: search,
              },
            },
          ],
        }
      : undefined,
    skip: (page - 1) * 10,
    take: 10,
  });

  return users;
}

export async function getUserById(id: number) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      displayName: true,
      username: true,
      bio: true,
      role: true,
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  const [followers, followed] = await Promise.all([
    getFollowersCount(id),
    getFollowedCount(id),
  ]);

  return {
    ...user,
    followers,
    followed,
  };
}

export async function updateProfileById(
  id: number,
  { displayName, username, bio }: UserUpdateSchema
) {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  const duplicate = await prisma.user.findFirst({
    where: {
      id: { not: id },
      username,
    },
  });

  if (duplicate) {
    throw new ConflictError('Username already taken');
  }

  await prisma.user.update({
    where: { id },
    data: {
      displayName,
      username,
      bio,
      updatedAt: new Date().toISOString(),
    },
  });
}

export async function updateUserById(
  id: number,
  { displayName, username, password, bio }: UserUpdateSchema
) {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  const duplicate = await prisma.user.findFirst({
    where: {
      id: { not: id },
      username,
    },
  });

  if (duplicate) {
    throw new ConflictError('Username already taken');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id },
    data: {
      displayName,
      username,
      password: hashedPassword,
      bio,
      updatedAt: new Date().toISOString(),
    },
  });
}

export async function changePassword(
  id: number,
  { currentPassword, newPassword, confirmPassword }: ChangePasswordSchema
) {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) {
    throw new AuthenticationError("Password doesn't match");
  }

  if (newPassword !== confirmPassword) {
    throw new BadRequestError(
      "Confirm password does't match with the new password"
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id },
    data: {
      password: hashedPassword,
      updatedAt: new Date().toISOString(),
    },
  });
}

export async function deleteUserById(id: number) {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }
  await publishMessage('userDeleted', JSON.stringify({ userId: id }));
  await prisma.user.delete({
    where: { id },
  });
}
