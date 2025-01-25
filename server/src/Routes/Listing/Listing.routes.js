import express from "express";
import { controllers } from "../../controllers/index.controller.js";
// import { isHost, auth } from "../../middleware/auth";
// import { authorize } from "../../middleware/authorize";

const router = express.Router();

// Listings (Public)
router.get("/", controllers.listing.getAllListings); // Get all listings
router.get("/:id", controllers.listing.getListingById); // Get listing details by ID

// Listings (Host - Protected) added in Host routes
// router.post("/", auth, isHost, controllers.listing.addListing); // Add new listing
// router.put("/:id", auth, isHost, controllers.listing.updateListing); // Update listing
// router.delete("/:id", auth, isHost, controllers.listing.deleteListing); // Delete listing

export default router;
