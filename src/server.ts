import { initSocket } from "@common/core/socket";
import app from "./app";
import http from "http"
import { connectDatabase } from "database";
import { envConfig } from "@config/env";


const server = http.createServer(app);
initSocket(server);
console.log(envConfig)
server.listen(envConfig.port, async () => {
  await connectDatabase()
  console.log("Server is running on port 3000");
});
