import dotenv from "dotenv";
dotenv.config();
import { Server } from "socket.io";
import express from "express";
import http from "http";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (!userId) {
    return;
  }
  userSocketMap[userId] = socket.id;
  io.emit("onlineusers", Object.keys(userSocketMap)); // to send msg or work from backend we use io and hence it will be receive on slice with similar key by socket.on() & obviyously call back : ignore typoerr thats all ashole

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("onlineusers", Object.keys(userSocketMap));
  });
});
// the io.emit fr msg will be obviyously from msg.controller.js as backend and then takes as frontend from

const getSocketId = (userId) => {
  return userSocketMap[userId];
};
export { app, server, io, getSocketId };
