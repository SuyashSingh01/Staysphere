import express from "express";
import { controllers } from "../../controllers/index.controller.js";
const router = express.Router();

// Route to get listings with optional filters
router.get("/place/top-listing", controllers.listing.getTopListings);
// Listings (Public)
router.get("/place/getAllplaces", controllers.listing.getAllListings); // Get all listings
router.get("/place/getplaceDetails/:id", controllers.listing.getListingById); // Get listing details by ID

// Listings (Host - Protected) added in Host routes
// router.post("/", auth, isHost, controllers.listing.addListing); // Add new listing
// router.put("/:id", auth, isHost, controllers.listing.updateListing); // Update listing
// router.delete("/:id", auth, isHost, controllers.listing.deleteListing); // Delete listing

export default router;
