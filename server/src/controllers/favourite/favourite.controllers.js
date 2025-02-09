// --------------------------------------------Favourite handler----------------------------------

import { JsonResponse } from "../../utils/jsonResponse.js";
import User from "../../models/User.model.js";
import mongoose from "mongoose";

class FavouriteController {
  async getFavorite(req, res) {
    try {
      const userID = req.user.id;
      if (!userID) {
        return JsonResponse(res, {
          status: 400,
          message: "User ID is required",
          success: false,
        });
      }
      const favouriteList = await User.findById(userID)
        .populate({
          path: "favourite",
          select: "_id",
        })
        .lean()
        .exec();
      console.log(favouriteList.favourite);

      return JsonResponse(res, {
        success: true,
        status: 200,
        title: "Favourite list",
        message: "fetched favorites for user",
        data: favouriteList,
      });
    } catch (err) {
      console.log(err);

      return JsonResponse(res, {
        status: 500,
        message: "Server Error in Fetching Favourite",
        success: false,
        error: err.message,
      });
    }
  }
  async addFavorite(req, res) {
    try {
      const userID = req.user.id;
      const { placeID } = req.params;
      if (placeID === undefined) {
        return JsonResponse(res, {
          status: 400,
          message: "Place ID is required",
          success: false,
        });
      }
      // find the place in user whether the place is  already  marked  user favorite or not
      const userFavorite = await User.findById(userID)
        .populate("favourite", "_id")
        .exec();
      let userliked;
      if (userFavorite) {
        userliked = userFavorite.favourite.map((item) => {
          return item._id == new mongoose.Types.ObjectId(placeID);
        });
      }
      if (userliked && userliked.length) {
        return JsonResponse(res, {
          status: 400,
          data: null,
          success: false,
          message: "This is already Your Favourite",
        });
      }

      const newUserFavorite = await User.findByIdAndUpdate(
        userID,
        {
          $push: { favourite: placeID },
        },
        { new: true }
      );

      return JsonResponse(res, {
        status: 200,
        message: "place is Marked Favourite successfully",
        success: true,
        data: newUserFavorite,
      });
    } catch (err) {
      console.log(err);
      return JsonResponse(res, {
        status: 500,
        message: "Server Error in Marking Favourite",
        success: false,
        error: err.message,
      });
    }
  }
  async removeFavorite(req, res) {
    try {
      const userID = req.user.id;
      const placeID = req.params.id;

      const newFavorite = await User.findByIdAndUpdate(
        new mongoose.Types.ObjectId(userID),
        {
          $pull: { favourite: new mongoose.Types.ObjectId(placeID) },
        },
        { new: true }
      );

      return JsonResponse(res, {
        status: 200,
        message: "place is Removed From Favourite successfully",
        success: true,
        user: newFavorite,
      });
    } catch (err) {
      console.log(err);
      return JsonResponse(res, {
        status: 500,
        message: "Server Error while removing Favorite",
        success: false,
        error: err.message,
      });
    }
  }
}

export default new FavouriteController();
