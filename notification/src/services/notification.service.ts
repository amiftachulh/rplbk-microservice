import { prisma } from '../db/client';

type Notification = {
  userId: number;
  sourceUserId: number;
  postId?: number | null;
};

export async function handleFollowNotification({
  userId,
  sourceUserId,
}: Notification) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        sourceUserId,
        type: 'follow',
        text: `@user:${sourceUserId} is following you`,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export async function handlePostLikeNotification({
  userId,
  sourceUserId,
  postId,
}: Notification) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        sourceUserId,
        postId,
        type: 'postLike',
        text: `@user:${sourceUserId} likes your @post:${postId}`,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export async function handleCommentNotification({
  userId,
  sourceUserId,
  postId,
}: Notification) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        sourceUserId,
        postId,
        type: 'comment',
        text: `@user:${sourceUserId} comment on your @post:${postId}`,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export async function getNotifications(userId: number) {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}
