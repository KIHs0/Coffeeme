import express from "express";
import { IsAuthenticated } from "../middleware/isAuthenticate.js";
export const router2 = express.Router();
import { sendMsg, getMsg, callMsg } from "../controller/msg.controller.js";

router2.post("/send/:receiverId", IsAuthenticated, sendMsg);
router2.post("/get/:receiverId", IsAuthenticated, getMsg);
router2.post("/call/:receiverId", IsAuthenticated, callMsg);
