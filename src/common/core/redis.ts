import { createClient } from 'redis';
export const redisClient = createClient();
export async function connectRedis() {
  redisClient.on('connect', () => {
    console.log('Connected to Redis');
  });

  redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
  });
  await redisClient.connect()
}

