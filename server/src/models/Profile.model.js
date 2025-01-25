import mongoose from "mongoose";

const profileschema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  username: {
    type: String,
    trim: true,
    required: true,
  },

  gender: {
    type: String,
  },
  education: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    trim: true,
  },
  about: {
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
  verified: {
    type: Boolean,
    default: false,
  },
});
export default mongoose.model("profile", profileschema);
