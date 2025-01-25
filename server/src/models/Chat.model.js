import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ChatSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  messages: [MessageSchema],
});

export default mongoose.model("Chat", ChatSchema);
