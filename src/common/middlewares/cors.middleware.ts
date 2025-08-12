import { envConfig } from '@config/env';
import cors from 'cors';

const allowedRootDomains = [
   envConfig.cors.origin,
   'localhost',
   'localhost:5173',
   'admin.localhost:5173'
];

export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    try {
      const hostname = new URL(origin).hostname;

      const isAllowed = allowedRootDomains.some(domain =>
        hostname === domain || hostname.endsWith(`.${domain}`)
      );

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    } catch (err) {
      callback(new Error('Invalid origin'));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'cache-control'],
  exposedHeaders: ['Set-Cookie', 'Authorization'],
};

