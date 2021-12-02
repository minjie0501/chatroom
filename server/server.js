import express from "express";
import http from "http";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Server } from "socket.io";

const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const clientPath = `${__dirname}/../client`;
const server = http.createServer(app);

const io = new Server(server, {});

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("sendToAll", (message, user) => {
    /// listening to sendToAll events
    io.emit("displayMessage", message, user); //send displayMessage event to everyone
  });

  // Send message just to me
  socket.on("sendToMe", (message) => {
    socket.emit("displayToMe", message);
  });

  // Send private message
  socket.on("sendPrivate", (message, user, sendTo) => {
    socket.to(sendTo).emit("displayPrivateMessage", message, user);
  });

  // Show all clients for all users
  io.emit("clients", Array.from(io.sockets.sockets.keys()));

  // Display client id
  socket.emit("displayClientId", socket.id);

  // Remove client from all clients when someone disconnects
  socket.on("disconnect", () => {
    io.emit("clients", Array.from(io.sockets.sockets.keys()));
  });
});

app.use("/", express.static(clientPath));

server.listen(PORT, () => {
  console.log("server running on " + PORT);
});
