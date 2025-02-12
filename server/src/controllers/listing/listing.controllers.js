// import User from "../../models/User.model.js";
import Place from "../../models/Place.model.js";
import { JsonResponse } from "../../utils/jsonResponse.js";

class ListingController {
  // Get all listings with optional filters
  async getAllListings(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 8;
      const skip = (page - 1) * limit;

      // Query the database
      const places = await Place.find().skip(skip).limit(limit);
      const totalPlaces = await Place.countDocuments();
      res.status(200).json({
        places,
        totalPages: Math.ceil(totalPlaces / limit),
        currentPage: page,
      });
      // return JsonResponse(res, {
      //   status: 200,
      //   success: true,
      //   message: "Places are Fetched successfully",
      //   places,
      //   totalPages: Math.ceil(totalPlaces / limit),
      //   currentPage: page,
      // });
    } catch (err) {
      console.error(err);
      return JsonResponse(res, {
        status: 500,
        success: false,
        message: "Server error While fetching listings",
        error: err.message,
      });
    }
  }
  async getTopListings(req, res) {
    try {
      const { price, placeLocation, type, availability } = req.query;

      const matchQuery = {};
      if (price) matchQuery.price = { $lte: price };
      if (location) matchQuery.placeLocation = placeLocation;
      if (type) matchQuery.type = type;
      if (availability) matchQuery.availability = availability;

      const topListings = await Place.aggregate([
        { $match: matchQuery },
        {
          $lookup: {
            from: "Review",
            localField: "_id",
            foreignField: "place",
            as: "reviews",
          },
        },
        {
          $addFields: {
            averageRating: { $avg: "$reviews.rating" },
            reviewCount: { $size: "$reviews" },
          },
        },
        { $sort: { averageRating: -1, reviewCount: -1 } },
        { $limit: 10 },
      ]);

      return JsonResponse(res, {
        status: 200,
        success: true,
        message: "Top listings fetched successfully",
        data: topListings,
      });
    } catch (err) {
      console.error(err);
      return JsonResponse(res, {
        status: 500,
        success: false,
        message: "Server error fetching top listings",
        error: err.message,
      });
    }
  }
  // Get a single listing by ID
  async getListingById(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: "Please provide a listing ID",
        });
      }
      const listing = await Place.findById(id);

      if (!listing) {
        return JsonResponse(res, {
          status: 401,
          success: false,
          message: "Listing not found",
        });
      }

      return JsonResponse(res, {
        status: 200,
        success: true,
        message: "Listing fetched successfully",
        data: listing,
      });
    } catch (err) {
      console.error(err);
      return JsonResponse(res, {
        status: 500,
        success: false,
        message: "Server error fetching listing",
        error: err.message,
      });
    }
  }
}
export default new ListingController();
