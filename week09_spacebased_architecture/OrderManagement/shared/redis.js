const redis = require('redis');

const client = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => console.log('❌ Redis Client Error', err));

async function connectRedis() {
    if (!client.isOpen) {
        await client.connect();
        console.log('✅ Đã kết nối với Redis (Data Grid)');
    }
    return client;
}

module.exports = { connectRedis, client };
