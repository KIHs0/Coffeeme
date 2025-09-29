import { wrapasync } from "../utils/utility.js";
import { Message } from "../model/msg.model.js";
import { Conversation } from "../model/conversation.model.js";
import mongoose from "mongoose";
import { io, getSocketId } from "../socket/socket.js";
import { match } from "assert";

export const sendMsg = wrapasync(async (req, res, next) => {
  const date = new Date().toLocaleString("en-GB", {
    day: "2-digit",
    hour12: false,
    minute: "2-digit",
    month: "short",
    hour: "2-digit",
  });

  let senderId = req.user.userid;
  let receiverId = req.params.receiverId;
  const msg = req.body.msg;
  const newMessage = await Message.create({
    senderId,
    receiverId,
    message: msg,
    time: date,
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
  res.status(200).json({ convo });
  // Get friends of friends - populate the 'friends' array for every friend
});
export const updateMsg = async ({ senderid, receiverid, keys }) => {
  let convo = await Conversation.findOne({
    participants: { $all: [senderid, receiverid] },
  }).populate("participantsMsg");
  const matchingMsgs = convo?.participantsMsg.flatMap((msg) =>
    Object.keys(keys)
      .filter((e) => e === msg._id.toString())
      .map((e) => ({ e, msg }))
  );
  if (!matchingMsgs || matchingMsgs.length === 0) {
    return;
  }
  const updates = matchingMsgs.map(({ msg, e }) => {
    return {
      updateOne: {
        filter: { _id: msg._id },
        update: { $set: { like: keys[e] } }, // toggle or default true
      },
    };
  });
  console.log(JSON.stringify(updates));
  if (!updates || updates.length === 0) {
    console.log("No updates to perform");
    return;
  }
  const result = await Message.bulkWrite(updates, { ordered: false });
  console.log(result.modifiedCount);
};
