import { initSocket } from "@common/core/socket";
import app from "./app";
import http from "http";
import { connectDatabase } from "database";
import { envConfig } from "@config/env";
import { connectRedis } from "cache/redis";

async function boostrap() {
  try {
    // Connect services first
    await connectDatabase();
    await connectRedis();

    const server = http.createServer(app);

    // Initialize Socket.IO (or similar) after creating server
    initSocket(server);

    server.listen(envConfig.port, () => {
      console.log(`Server is running on port ${envConfig.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

boostrap();
