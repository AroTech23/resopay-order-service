const amqp = require('amqplib');

let channel = null;

async function connect() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertQueue('order.created', { durable: true });
  console.log('RabbitMQ connected');
}

async function publish(queue, payload) {
  if (!channel) await connect();
  channel.sendToQueue(
    queue,
    Buffer.from(JSON.stringify(payload)),
    { persistent: true }
  );
}

module.exports = { connect, publish };