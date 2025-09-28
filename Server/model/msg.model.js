import mongoose, { model, Schema } from "mongoose";

const msgSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: "string",
      required: true,
    },
    time: {
      type: "string",
    },
    like: {
      type: Boolean,
    },
  },
  { timestamps: true }
);
export const Message = mongoose.model("Message", msgSchema);
