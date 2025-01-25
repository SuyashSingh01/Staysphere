import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  checkIn: Date,
  checkOut: Date,
  adults: Number,
  children: Number,
  roomType: String,
  totalAmount: Number,
  bookingStatus: String,
  bookingDate: Date,
  bookingTime: String,
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
