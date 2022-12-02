import Redis from 'ioredis';

const redis = new Redis({
  host: 'redis-18693.c232.us-east-1-2.ec2.cloud.redislabs.com',
  port: 18693,
  password: '5QA3XIyX6FX7Lrk3cEQWX3gEF4VEK7qA',
});
redis.set('ass', 'asf');
redis.dbsize().then(data => console.log(data));
redis.sadd('name', 'asd');
