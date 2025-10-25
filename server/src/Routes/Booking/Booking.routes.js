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
); 
// Request advance booking
router.post(
  '/request-advance',
  rateLimiter({ windowMs: 60000, max: 10 }),
  BookingController.requestAdvanceBooking
);

// Get personalized recommendations
router.get(
  '/recommendations',
  rateLimiter({ windowMs: 60000, max: 30 }),
  BookingController.getRecommendations
);

// Get similar places
router.get(
  '/similar/:placeId',
  rateLimiter({ windowMs: 60000, max: 30 }),
  BookingController.getSimilarPlaces
);
// Create a booking
// Get host's booking requests
// we can also add the cancellation request of the bookings
router.put(
  "/booking/cancel-request/:bookingId",
  auth,
  controllers.booking.cancelBooking
);

export default router;
