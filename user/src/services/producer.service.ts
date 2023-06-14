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

export async function publishMessage(exchange: string, message: string) {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertExchange(exchange, 'fanout', { durable: false });

    channel.publish(exchange, '', Buffer.from(message));

    setTimeout(() => {
      connection.close();
    }, 1000);
  } catch (error) {
    console.error(error);
  }
}
