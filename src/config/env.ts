import { ConfigSchema, ConfigType } from "@common/schemas/env.schema";
import dotenv from "dotenv"
dotenv.config()
const rawConfig = {
  environment: process.env.NODE_ENV || "production",
  port: Number(process.env.PORT || 3000),

  mongodb: {
      uri: process.env.MONGO_URI,
      name: process.env.MONGO_DATABASE_NAME
  },
  // Cloudflare R2 configuration
  cloudflareR2: {
      region: process.env.R2_REGION,
      bucketName: process.env.R2_BUCKET_NAME,
      endpoint: process.env.R2_ENDPOINT,
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      publicUrl: process.env.R2_PUBLIC_URL,
  },

 
  // JWT configuration
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    accessTokenExpiration: Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION || 3600), // default to 1 hour
    issuer: process.env.JWT_ISSUER || 'your-issuer', // Replace with your issuer
    audience: process.env.JWT_AUDIENCE || 'your-audience', // Replace with your audience
  },
  // Cookie configuration
  cookie: {
    domain: process.env.COOKIE_DOMAIN,
    sameSite: process.env.COOKIE_SAME_SITE || 'lax', // default to 'lax' if not set
    maxAge: Number(process.env.COOKIE_MAX_AGE || 604800), // default to 7d
  },

  cors: {
    origin: process.env.CORS_ORIGIN
  },

  telegram: {
    botToken: process.env.BOT_TOKEN,
    botUsername: process.env.BOT_USERNAME
  },

  user: {
    username: process.env.SUPER_USERNAME,
    email: process.env.SUPER_EMAIL,
    password: process.env.SUPER_PASSWORD,
    usernameAdmin: process.env.ADMIN_USERNAME,
    emailAdmin: process.env.ADMIN_EMAIL,
    passwordAdmin: process.env.ADMIN_PASSWORD,
  }
};
export const envConfig: ConfigType = ConfigSchema.parse(rawConfig);

