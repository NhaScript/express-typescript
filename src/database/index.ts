import log from "@common/core/logger";
import { envConfig } from "@config/env";
import mongoose from "mongoose";

/**
 * This module exports a function to connect to a MongoDB database using Mongoose.
 * It reads the database URL from environment variables or defaults to a local MongoDB instance.
 */
export const connectDatabase = async () => {
  try {
    const dbUrl = envConfig.mongodb.uri;
    await mongoose.connect(dbUrl, {dbName: envConfig.mongodb.name});
    log.info('Database connected successfully');
  } catch (error: any) {
    log.error('Database connection failed:', error);
    process.exit(1);
  }
}
