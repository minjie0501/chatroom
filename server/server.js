import express from "express";
import http from "http";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { Server } from "socket.io";

const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const clientPath = `${__dirname}/../client`;
const server = http.createServer(app);

const io = new Server(server, {});

app.use("/", express.static(clientPath));

let users = [];
let counter = 0

io.on("connection", (socket) => {
  users.push({ id: socket.id, name: `name:${counter}` });
  counter++
  io.emit("users", users);

  socket.on("sendToAll", (message, user) => {
    io.emit("displayMessage", message, user);
  });

  socket.on("sendToMe", (message) => {
    socket.emit("sendToMe", message);
  });

  socket.on("disconnect", () => {
    users = users.filter(function (obj) {
      return obj.id !== socket.id;
    });
    console.log(users);
  });
});

server.listen(PORT, () => {
  console.log("server running on " + PORT);
});
