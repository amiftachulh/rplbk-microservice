import amqp from 'amqplib';

export async function sendMessage(queue: string, message: string) {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue(queue);

    channel.sendToQueue(queue, Buffer.from(message));

    setTimeout(() => {
      connection.close();
    }, 1000);
  } catch (error) {
    console.error(error);
  }
}
