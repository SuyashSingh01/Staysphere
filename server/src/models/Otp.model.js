import mongoose from "mongoose";
import { sendVerificationEmail } from "../utils/sendEmail.js";

const otpSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  // email: {
  //   type: String,
  //   // required: true,
  // },
  // phone: {
  //   type: Number,
  //   required: true,
  // },
  email: {
    type: String,
    validate: {
      validator: function (v) {
        return this.phone || v;
      },
      message: "Either email or phone must be provided",
    },
  },
  phone: {
    type: Number,
    validate: {
      validator: function (v) {
        return this.email || v;
      },
      message: "Either phone or email must be provided",
    },
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now, expires: 5 * 60 },
});

otpSchema.pre("save", async function (next) {
  console.log("New document saved to database");
  // Only send an email when a new document is created
  if (this.isNew && this.email) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;
