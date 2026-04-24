const amqp = require('amqplib');

let connection = null;
let channel = null;

async function connectMQ(retries = 5) {
    if (connection) return { connection, channel };
    
    while (retries > 0) {
        try {
            connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672');
            channel = await connection.createChannel();
            console.log('✅ Đã kết nối với RabbitMQ');
            return { connection, channel };
        } catch (error) {
            retries--;
            console.error(`❌ Lỗi kết nối RabbitMQ (Đang thử lại... còn ${retries} lần):`, error.message);
            if (retries === 0) throw error;
            // Chờ 3 giây trước khi thử lại
            await new Promise(res => setTimeout(res, 3000));
        }
    }
}

async function publishToQueue(queue, message) {
    const { channel } = await connectMQ();
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
}

async function consumeQueue(queue, callback) {
    const { channel } = await connectMQ();
    await channel.assertQueue(queue, { durable: true });
    channel.prefetch(1);
    console.log(`[*] Đang chờ tin nhắn trong hàng đợi ${queue}.`);
    channel.consume(queue, async (msg) => {
        if (msg !== null) {
            const content = JSON.parse(msg.content.toString());
            await callback(content);
            channel.ack(msg);
        }
    });
}

module.exports = { connectMQ, publishToQueue, consumeQueue };
