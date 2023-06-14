import amqp from 'amqplib';
import {
  handleCommentNotification,
  handleFollowNotification,
  handlePostLikeNotification,
} from './notification.service';

export async function consumeMessage(queue: string) {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(queue);

    channel.consume(queue, async (message) => {
      if (message !== null) {
        const content = JSON.parse(message.content.toString());
        console.log('Receiving:', content);
        if (queue === 'follow') {
          await handleFollowNotification(content);
        } else if (queue === 'postLike') {
          await handlePostLikeNotification(content);
        } else if (queue === 'comment') {
          await handleCommentNotification(content);
        }

        channel.ack(message);
      }
    });
  } catch (error) {
    console.error(error);
  }
}
