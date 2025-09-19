import dotenv from "dotenv";
dotenv.config();
import { Server } from "socket.io";
import express from "express";
import http from "http";
import e from "cors";
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
  // backends
  socket.on("offer", ({ sdp, to }) => {
    console.log("offer ran");
    const targetSocketId = userSocketMap[to];
    if (!targetSocketId) return;
    io.to(targetSocketId).emit("offer", { sdp, from: socket.id });
  });
  socket.on("ice-candidate", ({ candidate, to }) => {
    console.log("icecandidate ran");
    const targetSocketId = userSocketMap[to];
    if (!targetSocketId) {
      socket.emit("ice-stop");
      return;
    }
    if (targetSocketId) {
      console.log("ringingg.........");
      io.to(to).emit("ice-candidate", {
        candidate,
        from: socket.id,
      });
    } else {
      console.log("connecting....");
    }
  });

  // socket.on("answer", ({ sdp, to }) => {
  //   const targetSocketId = userSocketMap[to];
  //   if (targetSocketId) {
  //     io.to(targetSocketId).emit("answer", { sdp, from: socket.id });
  //   }
  // });

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
