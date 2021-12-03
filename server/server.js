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

const userNames = {};

const io = new Server(server, {});

io.on("connection", (socket) => {
  // console.log(socket.id);
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

  socket.on("userName", (userName) => {
    const currentUserId = socket.id;
    userNames[currentUserId] = userName;
    // Show all clients for all users
    io.emit("clients", Array.from(io.sockets.sockets.keys()), userNames, currentUserId);
    socket.emit('deleteFromSelect', currentUserId)
  });

  // Display client id
  socket.emit("displayClientId", socket.id);

  // Remove client from all clients when someone disconnects
  socket.on("disconnect", () => {
    const id = socket.id;
    delete userNames[id];
    io.emit("clients", Array.from(io.sockets.sockets.keys()), userNames);
  });
});

app.use("/", express.static(clientPath));

server.listen(process.env.PORT || 3000);
