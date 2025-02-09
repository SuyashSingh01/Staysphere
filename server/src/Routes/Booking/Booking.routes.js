import express from "express";
import { controllers } from "../../controllers/index.controller.js";
import { auth } from "../../middleware/auth.js";

const router = express.Router();

// User Bookings
router.get("/booking/all", auth, controllers.booking.getallUserBookings); // Get all user bookings
router.get("/booking/:bookingId", auth, controllers.booking.getBookingById);
router.post(
  "/create-booking/:paymentId",
  auth,
  controllers.booking.createBooking
); // Create a booking
// Get host's booking requests
// we can also add the cancellation request of the bookings
router.put(
  "/booking/cancel-request/:bookingId",
  auth,
  controllers.booking.cancelBooking
);

export default router;
