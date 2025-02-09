import mongoose from "mongoose";

const reviewRatingSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    extramessage: {
      type: String,
    },
    communication: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    cleanliness: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Review", reviewRatingSchema);
