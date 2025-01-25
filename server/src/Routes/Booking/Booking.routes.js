import express from "express";
import { controllers } from "../../controllers/index.controller.js";
import { auth } from "../../middleware/auth.js";

const router = express.Router();

// User Bookings
router.post("/addbooking", auth, controllers.booking.createBooking); // Create a booking
router.get("/user/allbooking", auth, controllers.booking.getallUserBookings); // Get user bookings
// Get host's booking requests

export default router;
