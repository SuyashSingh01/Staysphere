import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: "Host", required: true },
  messages: [
    {
      sender: String,
      message: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model("Chat", ChatSchema);
