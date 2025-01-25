import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trime: true,
    },
    email: {
      type: String,
      required: true,
      trime: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    otherdetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "profile",
    },
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "booking",
      },
    ],
    token: {
      type: String,
    },
    role: {
      type: String,
      enum: ["Admin", "Host", "Tenant"],
      default: "Tenant",
    },
    favourite: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "booking",
      },
    ],
    review: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "review",
      },
    ],
    phone: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // social login
    googleId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
