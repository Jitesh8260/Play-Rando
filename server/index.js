const express = require("express");
const http = require("http");
const initSocket = require("./socket");

const app = express();
const httpServer = http.createServer(app);
initSocket(httpServer);

httpServer.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
