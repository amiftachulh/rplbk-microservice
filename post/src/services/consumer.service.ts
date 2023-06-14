import amqp from 'amqplib';
import { prisma } from '../db/client';

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
        const userId = content.userId;
        console.log('Received data:', content);
        await prisma.$transaction([
          prisma.post.deleteMany({ where: { userId } }),
          prisma.like.deleteMany({ where: { userId } }),
        ]);
        channel.ack(message);
      }
    });
  } catch (error) {
    console.error(error);
  }
}
