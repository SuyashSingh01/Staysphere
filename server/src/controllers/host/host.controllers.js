import mongoose from "mongoose";
import Place from "../../models/Place.model.js";
import { imageUpload } from "../../services/fileUpload.js";
import { JsonResponse } from "../../utils/jsonResponse.js";

class HostController {
  // async addhostplace(req, res) {

  //   try {
  //     const {
  //       title,
  //       description,
  //       price,
  //       address: location,
  //       perks,
  //       maxGuests,
  //       extraInfo,
  //       type,
  //     } = req.body;

  //     const hostId = req.user.id;
  //     const images = req.files;
  //     console.log("addhostplace", req.body);
  //     console.log("Received Data:", req.body, "Images:", images);
  //     if (
  //       !title ||
  //       !description ||
  //       !price ||
  //       !location ||
  //       !perks ||
  //       !maxGuests ||
  //       !extraInfo ||
  //       !images ||
  //       !type
  //     ) {
  //       return JsonResponse(res, {
  //         status: 400,
  //         success: false,
  //         message: "Missing required fields",
  //         data: null,
  //       });
  //     }

  //     // Check if the place already exists using aggregation
  //     const existingPlace = await Place.aggregate([
  //       {
  //         $match: {
  //           placeName: title,
  //           placeLocation: location,
  //         },
  //       },
  //       { $limit: 1 },
  //     ]);

  //     if (existingPlace.length > 0) {
  //       return JsonResponse(res, {
  //         status: 400,
  //         success: false,
  //         message:
  //           "A place with this name and location already exists try different place name",
  //         data: null,
  //       });
  //     }

  //     // Handle image uploads (Assuming `uploadImages` is a function that returns an array of URLs)
  //     const imageUrls = images ? await imageupload(images) : [];
  //     console.log("imageurls", imageUrls);
  //     // Create the place in the database
  //     const createdPlace = await Place.create({
  //       placeName: title,
  //       placeLocation: location,
  //       host: hostId,
  //       image: imageUrls,
  //       price,
  //       description,
  //       amenities: perks,
  //       rules: extraInfo,
  //       type,
  //       maxGuests,
  //     });

  //     return JsonResponse(res, {
  //       status: 201,
  //       success: true,
  //       message: "Place created successfully",
  //       data: createdPlace,
  //     });
  //   } catch (err) {
  //     console.error("Error creating place:", err);

  //     return JsonResponse(res, {
  //       status: 500,
  //       success: false,
  //       message: "Server error occurred while creating place",
  //       error: err.message,
  //     });
  //   }
  // }

  // Delete a place by ID

  async addHostPlace(req, res) {
    try {
      const {
        title,
        description,
        price,
        address,
        perks,
        maxGuests,
        extraInfo,
        type,
        availability,
      } = req.body;

      const hostId = req.user.id;
      const images = req.files?.images;

      console.log("Received Data:", { ...req.body, images: images?.length });

      // Validate required fields
      const requiredFields = [
        "title",
        "description",
        "price",
        "address",
        "perks",
        "maxGuests",
        "type",
      ];
      const missingFields = requiredFields.filter((field) => !req.body[field]);

      if (missingFields.length > 0) {
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
          data: null,
        });
      }

      // Validate price and maxGuests
      if (isNaN(price) || price <= 0) {
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: "Invalid price. Must be a positive number.",
          data: null,
        });
      }

      if (maxGuests <= 0) {
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: "Invalid maxGuests. Must be a positive integer.",
          data: null,
        });
      }

      // Check if the place already exists
      const existingPlace = await Place.findOne({
        placeName: title,
        placeLocation: address,
        host: hostId,
      });

      if (existingPlace) {
        return JsonResponse(res, {
          status: 400,
          success: false,
          message:
            "You have already listed a place with this name and location. Please use a different name or location.",
          data: null,
        });
      }

      // Handle image uploads
      let imageUrls = [];
      if (images && images.length > 0) {
        imageUrls = await imageUpload(images);
      }

      // Handle existing image URLs from the frontend
      const existingImages = req.body.existingImages || [];
      imageUrls = [...imageUrls, ...existingImages];

      if (imageUrls.length === 0) {
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: "At least one image is required.",
          data: null,
        });
      }

      // Create the place in the database
      const createdPlace = await Place.create({
        placeName: title,
        placeLocation: address,
        host: hostId,
        image: imageUrls,
        price: Number.parseFloat(price),
        description,
        amenities: perks,
        rules: extraInfo,
        type,
        maxGuests: Number.parseInt(maxGuests),
        availability: availability ? new Date(availability) : null,
      });

      return JsonResponse(res, {
        status: 201,
        success: true,
        message: "Place created successfully",
        data: createdPlace,
      });
    } catch (err) {
      console.error("Error creating place:", err);

      if (err instanceof mongoose.Error.ValidationError) {
        const validationErrors = Object.values(err.errors).map(
          (error) => error.message
        );
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: "Validation error",
          errors: validationErrors,
        });
      }

      return JsonResponse(res, {
        status: 500,
        success: false,
        message: "Server error occurred while creating place",
        error: err.message,
      });
    }
  }

  async updateHostPlace(req, res) {
    try {
      const { placeId } = req.params;
      const {
        title,
        description,
        price,
        address,
        perks,
        maxGuests,
        extraInfo,
        type,
        availability,
      } = req.body;

      const hostId = req.user.id;
      const images = req.files;

      console.log("Updating place:", placeId);
      console.log("Received Data:", { ...req.body, images: images?.length });

      // Find the existing place
      const existingPlace = await Place.findOne({ _id: placeId, host: hostId });

      if (!existingPlace) {
        return JsonResponse(res, {
          status: 404,
          success: false,
          message: "Place not found or you don't have permission to edit it.",
          data: null,
        });
      }

      // Handle image uploads for new images
      let newImageUrls = [];
      if (images && images.length > 0) {
        newImageUrls = await imageUpload(images);
      }

      // Handle existing image URLs from the frontend
      const existingImages = req.body.existingImages || [];
      const updatedImageUrls = [...existingImages, ...newImageUrls];

      if (updatedImageUrls.length === 0) {
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: "At least one image is required.",
          data: null,
        });
      }

      // Update the place
      const updatedPlace = await Place.findByIdAndUpdate(
        placeId,
        {
          placeName: title || existingPlace.placeName,
          placeLocation: address || existingPlace.placeLocation,
          image: updatedImageUrls,
          price: price ? Number.parseFloat(price) : existingPlace.price,
          description: description || existingPlace.description,
          amenities: perks || existingPlace.amenities,
          rules: extraInfo || existingPlace.rules,
          type: type || existingPlace.type,
          maxGuests: maxGuests
            ? Number.parseInt(maxGuests)
            : existingPlace.maxGuests,
          availability: availability
            ? new Date(availability)
            : existingPlace.availability,
        },
        { new: true, runValidators: true }
      );

      return JsonResponse(res, {
        status: 200,
        success: true,
        message: "Place updated successfully",
        data: updatedPlace,
      });
    } catch (err) {
      console.error("Error updating place:", err);

      if (err instanceof mongoose.Error.ValidationError) {
        const validationErrors = Object.values(err.errors).map(
          (error) => error.message
        );
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: "Validation error",
          errors: validationErrors,
        });
      }

      return JsonResponse(res, {
        status: 500,
        success: false,
        message: "Server error occurred while updating place",
        error: err.message,
      });
    }
  }

  async deleteHostPlace(req, res) {
    try {
      const id = req.params.placeId;
      console.log("Delete host place", id);
      const hostId = req.user.id;
      // check the host id and place id is valid
      if (!id || !hostId) {
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: "Missing required fields to delete the place",
        });
      } // check if the place belongs to the host
      const placeBelongsHost = await Place.findOne({
        _id: id,
        host: hostId,
      });
      if (!placeBelongsHost) {
        return JsonResponse(res, {
          status: 401,
          success: false,
          message: "Place does not belong to host",
          data: [],
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
      console.log("getHostPlaceById", id);
      if (!id) {
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: "Missing required fields to get the place",
        });
      }
      const place = await Place.findById({ _id: id });

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

      // find the number of booking for

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
  // async updateHostPlace(req, res) {
  //   try {
  //     const { id } = req.params;
  //     const hostId = req.user.id;
  //     const { file } = req.body;
  //     const {
  //       title,
  //       description,
  //       price,
  //       address: location,
  //       perks,
  //       maxGuests,
  //       extraInfo,
  //       type,
  //     } = req.body;
  //     console.log("updatePlacebody", req.body);
  //     console.log(`updateHostPlace:`, images);
  //     // console.log(JSON.stringify(images, null, 2));

  //     const newUploadedImages = []; // Store new Cloudinary uploaded images

  //     for (const img of images) {
  //       if (typeof img === "string" && img.startsWith("http")) {
  //         continue;
  //       } else if (img && img.path) {
  //         newUploadedImages.push(img.path);
  //       } else {
  //         console.warn("Invalid image format:", img);
  //       }
  //     }
  //     // images.forEach((image) => {
  //     //   console.log(URL.createObjectURL(image)); // If image is a Blob or File
  //     // });

  //     if (
  //       !title ||
  //       !description ||
  //       !price ||
  //       !location ||
  //       !perks ||
  //       !maxGuests ||
  //       !images ||
  //       !extraInfo ||
  //       !type
  //     ) {
  //       return JsonResponse(res, {
  //         status: 400,
  //         success: false,
  //         message: "Missing required fields for updateHostPlace",
  //         data: [],
  //       });
  //     }
  //     // add the image upload function here
  //     const imagesUrls = await imageupload(newUploadedImages);

  //     const updates = {
  //       placeName: title,
  //       placeLocation: location,
  //       host: hostId,
  //       image: [...newUploadedImages],
  //       price,
  //       description,
  //       amenities: perks,
  //       rules: extraInfo,
  //       maxGuests,
  //       type: type,
  //     };

  //     const updatedPlace = await Place.findOneAndUpdate(
  //       { _id: id, host: hostId },
  //       updates,
  //       {
  //         new: true,
  //       }
  //     );

  //     if (!updatedPlace) {
  //       return JsonResponse(res, {
  //         status: 401,
  //         success: false,
  //         message: "Place not found for updating place",
  //       });
  //     }

  //     return JsonResponse(res, {
  //       status: 201,
  //       success: true,
  //       message: "Place updated successfully",
  //       data: updatedPlace,
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     return JsonResponse(res, {
  //       status: 500,
  //       success: false,
  //       message: "Server error occurred while updating place",
  //       error: err.message,
  //     });
  //   }
  // }
}

export default new HostController();
