import { app, server } from "./socket/socket.js";
import express from "express";
import { router } from "./routes/user.router.js";
import { router2 } from "./routes/msg.router.js";
import { connection1 } from "./db/cluster0ChatMe.db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
//socket

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
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
