const redis = require("redis");

const client = redis.createClient({
    username: 'default',
    password: 'czFMc5z3WtYk3ioiXeGR405P6uODT77w',
    socket: {
        host: 'redis-15825.c257.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 15825
    }
});

client.on('error', err => console.error('Redis Connection Error:', err));

async function connectRedis() {
    try {
        await client.connect();
        console.log('Connected to Redis');
    } catch (err) {
        console.error('Redis Connection Failed:', err);
    }
}

connectRedis();




module.exports = client;
