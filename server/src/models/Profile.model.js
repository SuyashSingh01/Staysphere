import mongoose from "mongoose";

const profileschema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  otherEmail: {
    type: String,
    trim: true,
  },
  gender: {
    type: String,
  },

  country: {
    type: String,
    trim: true,
  },

  phone: {
    type: Number,
    trim: true,
  },
  profilepic: {
    type: String,
  },
  dateofBirth: {
    type: Date,
  },
  address: {
    type: String,
    trim: true,
  },
  website: {
    type: String,
    trim: true,
  },

  bio: {
    type: String,
    trim: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
export default mongoose.model("Profile", profileschema);
