import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    receiptId: {
      type: String,
    },
    paymentId: {
      type: String,
    },
    signature: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
    },
    paymentStatus: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      // required: true,
    },
  },
  {
    timestamp: true,
  }
);

const PaymentMethods = mongoose.model("Payment", paymentSchema);
export default PaymentMethods;
