import Review from "../../models/ReviewAndRating.model.js";
import Place from "../../models/Place.model.js";

class ReviewController {
  async addReview(req, res) {
    try {
      const { placeId, rating, comment } = req.body;
      const userId = req.user.id;

      if (!placeId || !rating) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
      }

      const place = await Place.findById(placeId);

      if (!place) {
        return res
          .status(404)
          .json({ success: false, message: "Place not found" });
      }

      const review = await Review.create({
        place: placeId,
        user: userId,
        rating,
        comment,
      });

      return res.status(201).json({
        success: true,
        message: "Review added successfully",
        data: review,
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    }
  }

  // Get reviews for a specific place
  async getReviewsForPlace(req, res) {
    try {
      const { placeId } = req.params;

      const reviews = await Review.find({ place: placeId }).populate(
        "user",
        "name"
      );

      return res.status(200).json({ success: true, data: reviews });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    }
  }
}

export default new ReviewController();
