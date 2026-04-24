const redis = require('redis');

const client = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => console.log('❌ Lỗi kết nối Redis:', err));

async function connectRedis() {
    if (!client.isOpen) {
        await client.connect();
    }
    return client;
}

module.exports = { connectRedis, client };
