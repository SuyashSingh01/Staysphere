import Review from "../../models/ReviewAndRating.model.js";
import Place from "../../models/Place.model.js";
import { JsonResponse } from "../../utils/jsonResponse.js";

class ReviewController {
  async addReview(req, res) {
    try {
      const { placeId, rating, comment } = req.body;
      const userId = req.user.id;

      if (!placeId || !rating) {
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: "Missing required fields",
          data: null,
        });
      }

      const place = await Place.findById(placeId);

      if (!place) {
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: "Place not found",
          data: null,
        });
      }

      const review = await Review.create({
        place: placeId,
        postedBy: userId,
        rating,
        comment,
      });

      return JsonResponse(res, {
        status: 201,
        title: "Review has been added",
        success: true,
        message: "Review added successfully",
        data: review,
      });
    } catch (err) {
      console.error(err);
      return JsonResponse(res, {
        status: 500,
        success: false,
        message: "Server error  occurred while adding review",
        error: err.message,
      });
    }
  }

  // Get reviews for a specific place
  async getReviewsForPlace(req, res) {
    try {
      const { placeId } = req.params;

      const reviews = await Review.find({ place: placeId }).populate(
        "postedBy",
        "name email"
      );

      return JsonResponse(res, {
        status: 201,
        title: "Reviews fetched",
        success: true,
        data: reviews,
        message: "Reviews fetched successfully",
      });
    } catch (err) {
      console.error(err);
      return JsonResponse(res, {
        title: "Server error in Getting Review",
        status: 500,
        success: false,
        message: "Server error  while getting reviews",
        error: err.message,
      });
    }
  }
}

export default new ReviewController();
