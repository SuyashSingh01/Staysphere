import Place from "../../models/Place.model.js";
import { imageupload } from "../../services/fileUpload.js";
import { JsonResponse } from "../../utils/jsonResponse.js";

class HostController {
  async addhostplace(req, res) {
    try {
      const {
        title,
        description,
        price,
        location,
        perks,
        maxGuests,
        extraInfo,
      } = req.body;
      const hostId = req.user.id;
      const images = req.files;
      if (
        !title ||
        !description ||
        !price ||
        !location ||
        !perks ||
        !maxGuests ||
        !images ||
        !extraInfo
      ) {
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: "Missing required fields",
        });
      }
      // add the image upload function here
      const imagesUrls = await imageupload(req, res, images);

      const createdPlace = await Place.create({
        placeName: title,
        placeLocation: location,
        host: hostId,
        image: imagesUrls,
        price,
        description,
        amenities: perks,
        rules: extraInfo,
        maxGuests,
      });

      return JsonResponse(res, {
        status: 201,
        success: true,
        message: "Place created successfully",
        data: createdPlace,
      });
    } catch (err) {
      console.error(err);

      return JsonResponse(res, {
        status: 500,
        success: false,
        message: "Server error  occurred while creating place",
        error: err.message,
      });
    }
  }

  // Delete a place by ID
  async deleteHostPlace(req, res) {
    try {
      const { id } = req.params;
      const hostId = req.user.id;
      // check the host id and place id is valid
      if (!id || !hostId) {
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: "Missing required fields",
        });
      } // check if the place belongs to the host
      const placeBelongsHost = await Place.findOne({ _id: id, host: hostId });
      if (!placeBelongsHost) {
        return JsonResponse(res, {
          status: 401,
          success: false,
          message: "Place does not belong to host",
        });
      }

      const place = await Place.findOneAndDelete({ _id: id, host: hostId });

      if (!place) {
        return JsonResponse(res, {
          status: 401,
          success: false,
          message: "Place not found for deleting place",
          error: err.message,
        });
      }

      return JsonResponse(res, {
        status: 200,
        success: true,
        message: "Place  Deleted succesfully place",
        data: place,
      });
    } catch (err) {
      console.error(err);
      return JsonResponse(res, {
        status: 500,
        success: false,
        message: "Server error occurred while deleting place",
        error: err.message,
      });
    }
  }

  async getHostPlaceById(req, res) {
    try {
      const { id } = req.params;

      const place = await Place.findById(id);

      if (!place) {
        return JsonResponse(res, {
          status: 401,
          success: false,
          message: "Place not found ",
        });
      }

      return JsonResponse(res, {
        status: 200,
        success: true,
        message: "Place fetched successfully",
        data: place,
      });
    } catch (err) {
      console.error(err);
      return JsonResponse(res, {
        status: 500,
        success: false,
        message: "Server error fetching place",
        error: err.message,
      });
    }
  }

  // Get all places for a host
  async getAllHostPlaces(req, res) {
    try {
      const hostId = req.user.id;

      const places = await Place.find({ host: hostId });

      return JsonResponse(res, {
        status: 200,
        success: true,
        message: "Host places fetched successfully",
        data: places,
      });
    } catch (err) {
      console.error(err);
      return JsonResponse(res, {
        status: 500,
        success: false,
        message: "Server error fetching host places",
        error: err.message,
      });
    }
  }

  // Update a place by ID
  async updateHostPlace(req, res) {
    try {
      const { id } = req.params;
      // const updates = req.body;
      const hostId = req.user.id;
      const images = req.files;
      const {
        title,
        description,
        price,
        location,
        perks,
        maxGuests,
        extraInfo,
      } = req.body;

      if (
        !title ||
        !description ||
        !price ||
        !location ||
        !perks ||
        !maxGuests ||
        !images ||
        !extraInfo
      ) {
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: "Missing required fields",
        });
      }
      // add the image upload function here
      const imagesUrls = await imageupload(req, res, images);

      const updates = {
        placeName: title,
        placeLocation: location,
        host: hostId,
        image: imagesUrls,
        price,
        description,
        amenities: perks,
        rules: extraInfo,
        maxGuests,
      };

      const updatedPlace = await Place.findOneAndUpdate(
        { _id: id, host: hostId },
        updates,
        {
          new: true,
        }
      );

      if (!updatedPlace) {
        return JsonResponse(res, {
          status: 401,
          success: false,
          message: "Place not found for updating place",
        });
      }

      return JsonResponse(res, {
        status: 201,
        success: true,
        message: "Place updated successfully",
        data: updatedPlace,
      });
    } catch (err) {
      console.error(err);
      return JsonResponse(res, {
        status: 500,
        success: false,
        message: "Server error occurred while updating place",
        error: err.message,
      });
    }
  }
}

export default new HostController();
