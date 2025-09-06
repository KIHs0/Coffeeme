import { wrapasync } from "../utils/utility.js";
import { Message } from "../model/msg.model.js";
import { Conversation } from "../model/conversation.model.js";
// import mongoose from "mongoose";
import { io, getSocketId } from "../socket/socket.js";
export const sendMsg = wrapasync(async (req, res, next) => {
  let senderId = req.user.userid;
  let receiverId = req.params.receiverId;
  const msg = req.body.msg;
  const newMessage = await Message.create({
    senderId,
    receiverId,
    message: msg,
  });

  let convo = await Conversation?.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  if (!convo) {
    convo = await Conversation?.create({
      participants: [senderId, receiverId],
    });
  }
  if (newMessage) {
    convo.participantsMsg.push(newMessage._id);
    await convo.save();
  }
  /**
   * socket.io
   */
  const socketId = getSocketId(receiverId);
  io.to(socketId).emit("newMessage", newMessage); //calls to frontend with same key

  res.status(200).json({ newMessage });
});
export const getMsg = wrapasync(async (req, res, next) => {
  let senderId = req.user.userid;
  let receiverId = req.params.receiverId;
  let convo = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  }).populate("participantsMsg");

  // Get friends of friends - populate the 'friends' array for every friend
  res.status(200).json({ convo });
});
