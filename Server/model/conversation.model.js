import mongoose, { model, Schema } from "mongoose";
const conversationSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    participantsMsg: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  { timestamps: true }
);
export const Conversation = mongoose.model("Conversation", conversationSchema);
