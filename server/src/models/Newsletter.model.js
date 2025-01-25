import mongoose from "mongoose";

const newsletter = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  messages: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Newsletter", newsletter);
