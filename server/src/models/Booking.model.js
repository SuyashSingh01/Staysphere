import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  checkIn: Date,
  checkOut: Date,
  adults: Number,
  children: Number,
  roomType: String,
  amount: Number,
  totalAmount: Number,

  bookingStatus: {
    type: String,
    enum: ["available ", "await", "booked", "cancelled"],
    default: "available",
  },
  bookingDate: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Place",
    required: true,
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
  },
  review: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review",
  },
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
