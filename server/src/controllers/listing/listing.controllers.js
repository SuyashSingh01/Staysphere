import Place from "../../models/Place.model.js";
import { JsonResponse } from "../../utils/jsonResponse.js";
import {redisConnect} from "../../config/redis.js";
import memoryCache from "../../data-structure/cache/lruCache.js";

class ListingController {
  async getAllListings(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 8;
      const skip = (page - 1) * limit;
      const category = req.query.category || "all";
      const searchQuery = req.query.search || "";
      const key = `listings:${page}:${limit}:${category}:${searchQuery}`;

      //  Check LRU in-memory cache
      let data = memoryCache.get(key);
      if (data) {
        return JsonResponse(res,{
          status: 200,
          success: true,
          message: "Listings fetched successfully (from memory cache)",
          data: data,
        });
      }

      //  Check Redis cache
      const cached = await redisConnect.get(key);
      if (cached) {
        const parsed = JSON.parse(cached);
        memoryCache.put(key, parsed);
        return JsonResponse(res,{
          status: 200,
          success: true,
          message: "Listings fetched successfully (from Redis cache)",
          data: parsed,
        });
      }

      let matchStage = {};
      if (category !== "all") {
        matchStage = { type: category };
      }
      if (searchQuery) {
        matchStage.$or = [
          { placeName: { $regex: searchQuery, $options: "i" } },
          { placeLocation: { $regex: searchQuery, $options: "i" } },
        ];
      }

      // Aggregation pipeline
      const placesAggregation = await Place.aggregate([
        { $match: matchStage },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ]);

      const totalPlaces = await Place.countDocuments(matchStage);
      const responseData = {
        places: placesAggregation,
        totalPages: Math.ceil(totalPlaces / limit),
        currentPage: page,
      };
      await redisConnect.setEx(key, 3600, JSON.stringify(responseData)); // 1h TTL
      memoryCache.put(key, responseData);
      
      return JsonResponse(res,{
        status: 200,
        success: true,
        message: "Listings fetched successfully",
        data: responseData,
      });
    } catch (err) {
      console.error(err);
      return JsonResponse(res, {
        status: 500,
        success: false,
        message: "Server error while fetching listings",
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
       const key = `listing:${id}`;
      let cached = memoryCache.get(key);
      if (cached) return JsonResponse(res, { status: 200, success: true, data: cached });

      const redisData = await redisConnect.get(key);
      if (redisData) {
        const parsed = JSON.parse(redisData);
        memoryCache.put(key, parsed);
        return JsonResponse(res, { status: 200, success: true, data: parsed });
      }
      const listing = await Place.findById(id);

      await redisConnect.setEx(key, 3600, JSON.stringify(listing));
      memoryCache.put(key, listing);

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
