import { prisma } from '../db/client';
import ConflictError from '../errors/ConflictError';
import NotFoundError from '../errors/NotFoundError';
import { sendMessage } from './producer.service';

export async function follow(followingUserId: number, followedUserId: number) {
  const follow = await prisma.follow.findFirst({
    where: {
      followingUserId,
      followedUserId,
    },
  });

  if (follow) {
    throw new ConflictError("You've already followed this user");
  }

  await prisma.follow.create({
    data: {
      followingUserId,
      followedUserId,
    },
  });

  await sendMessage(
    'follow',
    JSON.stringify({
      userId: followedUserId,
      sourceUserId: followingUserId,
    })
  );
}

export async function getFollowers(id: number) {
  const followers = await prisma.follow.findMany({
    where: {
      followedUserId: id,
    },
    select: {
      followingUser: {
        select: {
          id: true,
          displayName: true,
          username: true,
        },
      },
    },
  });

  return followers.map((data) => data.followingUser);
}

export async function getFollowersCount(id: number) {
  return await prisma.follow.count({
    where: {
      followedUserId: id,
    },
  });
}

export async function getFollowedUsers(id: number) {
  const followedUsers = await prisma.follow.findMany({
    where: {
      followingUserId: id,
    },
    select: {
      followedUser: {
        select: {
          id: true,
          displayName: true,
          username: true,
        },
      },
    },
  });

  return followedUsers.map((data) => data.followedUser);
}

export async function getFollowedCount(id: number) {
  return await prisma.follow.count({
    where: {
      followingUserId: id,
    },
  });
}

export async function unfollow(
  followingUserId: number,
  followedUserId: number
) {
  try {
    await prisma.follow.delete({
      where: {
        followingUserId_followedUserId: {
          followingUserId,
          followedUserId,
        },
      },
    });
  } catch (error) {
    throw new NotFoundError('Unfollow failed');
  }
}
