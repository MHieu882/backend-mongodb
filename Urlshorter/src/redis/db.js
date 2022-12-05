import Redis from 'ioredis';

const clientRedis = new Redis();

clientRedis.on('connect', () => console.log('Redis connected '));
export default clientRedis;
