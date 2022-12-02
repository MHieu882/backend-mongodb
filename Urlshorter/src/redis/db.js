import Redis from 'ioredis';

const clientRedis = new Redis();

clientRedis.on('connect', () => console.log('Redis connected '));
export default clientRedis;


//sess:4v1tkq_A4b7tRLTkvq68D1Ln_QEpE7ct