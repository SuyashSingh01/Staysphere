import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    email: {
      type: String,
      // required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    expires: 5 * 60,
  }
);
const OTP = mongoose.model("OTP", otpSchema);
export default OTP;
