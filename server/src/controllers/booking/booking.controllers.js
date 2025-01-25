import { config } from "dotenv";
// import { check, validationResult } from "express-validator";
config();
import User from "../../models/User.model.js";
import { JsonResponse } from "../../utils/jsonResponse.js";

class BookingController {
  async createBooking(req, res) {
    try {
      const {
        userId,
        checkIn,
        checkOut,
        phone,
        place: placeID,
        price,
        payementId,
        totalAmount,
        bookingstatus,
        bookingDetails,
      } = req.body;

      const bookingData = {
        user: userId,
        checkIn,
        checkOut,
        phone,
        place: placeID,
        price,
        payementId,
        totalAmount,
        bookingstatus,
        bookingDetails,
      };
      const checkBookingStatus = function () {
        if (bookingstatus === "booked") {
          return true;
        }
        return false;
      };
      if (checkBookingStatus) {
        return JsonResponse(res, {
          message: "Booking is already done",
          success: false,
          data: null,
        });
      }
      // also add the bookingid in user fields bookings which is reference to booking model
      const user = await User.findOne({ _id: userId });
      user.bookings.push(bookingData);
      await user.save();

      const bookedData = await Booking.create(bookingData);

      return JsonResponse(res, {
        status: 201,
        message: "Booking is created successfully",
        success: true,
        data: bookedData,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server Error While Booking",
        success: false,
        error: err.message,
      });
    }
  }

  async getallUserBookings(req, res) {
    const { name, email } = req.body;
    try {
      return JsonResponse(res, {
        status: 200,
        message: "User Bookings fetched successfully",
        success: true,
        user: userBookings,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server Error in creating user",
        success: false,
        error: err.message,
      });
    }
  }
}

export default new BookingController();
