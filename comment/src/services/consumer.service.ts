import amqp from 'amqplib';
import {
  deleteCommentsByPostId,
  deleteCommentsByUserId,
} from './comment.service';

export async function consumePostDeleted(queue: string) {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(queue);

    channel.consume(queue, async (message) => {
      if (message !== null) {
        const content = JSON.parse(message.content.toString());
        console.log('Received data:', content);
        await deleteCommentsByPostId(content.postId);
        channel.ack(message);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

export async function subscribeUserDeleted() {
  try {
    const exchange = 'userDeleted';
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertExchange(exchange, 'fanout', { durable: false });
    const q = await channel.assertQueue('', { exclusive: true });
    channel.bindQueue(q.queue, exchange, '');
    channel.consume(q.queue, async (message) => {
      if (message !== null) {
        const content = JSON.parse(message.content.toString());
        console.log('Received data:', content);
        await deleteCommentsByUserId(content.userId);
        channel.ack(message);
      }
    });
  } catch (error) {
    console.error(error);
  }
}
