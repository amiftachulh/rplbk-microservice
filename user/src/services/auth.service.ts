import { prisma } from '../db/client';
import bcrypt from 'bcrypt';
import AuthenticationError from '../errors/AuthenticationError';
import { LoginSchema } from '../schemas/user.schema';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from './token.service';

export async function login({ username, password }: LoginSchema) {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new AuthenticationError('Username not found');
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new AuthenticationError("Password doesn't matched");
  }

  const { password: pwd, ...userData } = user;

  const accessToken = generateAccessToken({ id: user.id });
  const refreshToken = generateRefreshToken({ id: user.id });

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
    },
  });

  return {
    ...userData,
    accessToken,
    refreshToken,
  };
}

export async function refresh(refreshToken: string) {
  const token = await prisma.refreshToken.findUnique({
    where: {
      token: refreshToken,
    },
    include: {
      user: {
        select: {
          id: true,
          displayName: true,
          username: true,
          bio: true,
        },
      },
    },
  });

  if (!token) {
    throw new AuthenticationError('Invalid refresh token');
  }

  if (!verifyRefreshToken(refreshToken)) {
    throw new AuthenticationError('Refresh token expired');
  }

  const accessToken = generateAccessToken({ id: token.userId });

  return {
    ...token.user,
    token: accessToken,
  };
}

export async function logout(refreshToken: string) {
  const token = await prisma.refreshToken.findUnique({
    where: {
      token: refreshToken,
    },
  });

  if (!token) {
    throw new AuthenticationError('Logout failed');
  }

  await prisma.refreshToken.delete({
    where: {
      token: refreshToken,
    },
  });
}
