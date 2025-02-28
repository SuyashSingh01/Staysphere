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
      ref: "Profile",
    },
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
    token: {
      type: String,
    },
    role: {
      type: String,
      enum: ["Admin", "Host", "User"],
      default: "User",
    },
    favourite: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Place",
      },
    ],
    review: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    cancelRequest: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
    phone: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isSubscribed: {
      type: Boolean,
      default: false,
    },
    resetPasswordExpires: {
      type: Date,
    },
    // social login
    googleId: {
      type: String,
    },
    CryptoPaymentEnabled: {
      type: Boolean,
      default: false,
    },
    contractAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
