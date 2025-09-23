import { app, server } from "./socket/socket.js";
import express from "express";
import { router } from "./routes/user.router.js";
import { router2 } from "./routes/msg.router.js";
import { connection1 } from "./db/cluster0ChatMe.db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import * as path from "path";
//socket

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const allowedOrigins = [process.env.CLIENT_URL, "https://192.168.1.135:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Optional: make sure OPTIONS is handled

const port = process.env.PORT || 3000;
app.use("/", router);
app.use("/", router2);
/**
 * ------------INIT
 */

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({ error: err.message || err });
});

server.listen(port, () => {
  connection1().catch((e) => console.log("err connecting db", e));
});
