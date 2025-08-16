import z from "zod";

export const ConfigSchema = z.object({
  environment: z.string(),
  port: z.number(),

  mongodb: z.object({
    uri: z.string(),
    name: z.string(),
  }),

  cloudflareR2: z.object({
    region: z.string().optional(),
    bucketName: z.string().optional(),
    endpoint: z.string().optional(),
    accessKeyId: z.string().optional(),
    secretAccessKey: z.string().optional(),
    publicUrl: z.string().optional(),
  }),

  jwt: z.object({
    accessTokenSecret: z.string().min(1, "JWT access token secret is required"),
    accessTokenExpiration: z.number(),
    refreshTokenSecret: z.string().min(1, "JWT refresh token secret is required"),
    refreshTokenExpiration: z.number(),
    issuer: z.string(),
    audience: z.string(),
  }),

  cookie: z.object({
    domain: z.string().optional(),
    sameSite: z.enum(["lax", "strict", "none"]).optional(),
    maxAge: z.number(),
  }),
  cors: z.object({
    origin: z.string().default("http://localhost:5173"),
  }),
  telegram: z.object({
    botToken: z.string(),
    botUsername: z.string(),
  }),
  user: z.object({
    username: z.string(),
    password: z.string(),
    email: z.email(),
    usernameAdmin: z.string(),
    emailAdmin: z.email(),
    passwordAdmin: z.string(),
  }),
  redis: z.object({
    host: z.string(),
    port: z.number().default(6379),
    password: z.string()

  })
});

export type ConfigType = z.infer<typeof ConfigSchema>;
