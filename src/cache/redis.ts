import { envConfig } from '@config/env';
import { createClient } from 'redis';
export const redisClient = createClient({
  socket: {
    host: envConfig.redis.host,
    port: envConfig.redis.port,
  },
  password: envConfig.redis.password
});
export async function connectRedis() {
  redisClient.on('connect', () => {
    console.log('Connected to Redis');
  });

  redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
  });
  await redisClient.connect()
}

