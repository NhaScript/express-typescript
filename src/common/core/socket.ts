import { envConfig } from "@config/env";
import { Server } from "socket.io";

const allowedRootDomains = new Set([
  envConfig.cors.origin,
  "localhost",
  "localhost:5173",
  "admin.localhost:5173",
]);

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        // Allow non-browser clients (like Postman or CLI tools)
        if (!origin) return callback(null, true);

        try {
          const { hostname } = new URL(origin);

          const isAllowed =
            allowedRootDomains.has(hostname) ||
            [...allowedRootDomains].some((domain) =>
              hostname.endsWith(`.${domain}`)
            );

          if (isAllowed) {
            callback(null, true);
          } else {
            callback(new Error(`CORS not allowed for origin: ${origin}`));
          }
        } catch {
          callback(new Error("Invalid origin format"));
        }
      },
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });
};

export { io };
