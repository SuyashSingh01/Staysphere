import mongoose from "mongoose";

const placeschema = new mongoose.Schema(
  {
    placeName: {
      type: String,
      required: true,
    },
    placeLocation: {
      type: String,
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    image: [
      {
        type: String,
        required: true,
      },
    ],
    availablity: {
      type: String,
      enum: ["available", "booked", "unavailable"],
      default: "available",
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    benefits: {
      type: String,
      // required: true,
    },
    amenities: [
      {
        type: String,
        required: true,
      },
    ],
    rules: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    maxGuests: {
      type: Number,
      required: true,
    },
    numberOfBookings: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Place", placeschema);
