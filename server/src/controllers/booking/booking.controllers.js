import { config } from "dotenv";
// import { check, validationResult } from "express-validator";
config();
import User from "../../models/User.model.js";
import { JsonResponse } from "../../utils/jsonResponse.js";
import Booking from "../../models/Booking.model.js";
import Payment from "../../models/Payment.model.js";
import { paymentSuccessEmail } from "../../mailTemplate/paymentSuccessEmail.js";
import mailSender from "../../utils/sendEmail.js";
import mongoose from "mongoose";
import generateReceipt from "../../utils/generatePDF.js";
import Place from "../../models/Place.model.js";

class BookingController {
  async createBooking(req, res) {
    try {
      const { checkIn, checkOut, phone, price, placeId } =
        req.body.bookingDetail;
      const userId = req.user.id;
      const { paymentId } = req.params;
      console.log("Checking", checkIn, checkOut, phone, price, placeId);
      console.log("PAYEMNTID", paymentId);

      if (!checkIn || !checkOut || !phone || !price || !paymentId || !placeId) {
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: "All fields are required for booking",
        });
      }
      console.log("paymentid", paymentId);
      //  Verify if payment exists and is successful
      const payment = await Payment.findOne({
        _id: new mongoose.Types.ObjectId(paymentId),
        userId,
        paymentStatus: "success",
      });

      if (!payment) {
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: "Payment not found or incomplete",
          data: [],
        });
      }
      // also make sure to incrment the number of bookings

      // Create new booking
      const booking = await Booking.create({
        user: userId,
        checkIn,
        checkOut,
        phone,
        place: placeId,
        price,
        paymentId,
        bookingStatus: "booked",
      });
      // need to check out the bookings
      // increment the number of bookings for the place
      const updatedPlace = await Place.findByIdAndUpdate(
        new mongoose.Types.ObjectId(placeId),
        {
          $push: { numberOfBookings: booking._id },
        },
        { new: true }
      ).populate("host");

      // Add booking reference to user
      const user = await User.findByIdAndUpdate(
        new mongoose.Types.ObjectId(userId),
        {
          $push: { bookings: booking._id },
        },
        { new: true }
      );
      try {
        // Generate PDF receipt
        const receiptPath = await generateReceipt({
          _id: booking._id,
          user,
          updatedPlace,
          checkIn,
          checkOut,
          price,
          paymentId,
        });

        // Send email with receipt
        await mailSender(
          user.email,
          `Staysphere || Payment Received - Your Booking ID: ${booking._id}`,
          paymentSuccessEmail(
            `${user?.name}`,
            payment?.amount,
            payment?.orderId,
            payment?._id
          ),
          [{ filename: "Receipt.pdf", path: receiptPath }] // Attach receipt
        );

        return JsonResponse(res, {
          status: 201,
          success: true,
          message: "Booking created successfully",
          data: booking,
        });
      } catch (error) {
        console.error(error);
        return JsonResponse(res, {
          status: 500,
          success: false,
          message: "Error creating booking",
        });
      }
    } catch (error) {
      console.error(error);
      return JsonResponse(res, {
        status: 500,
        success: false,
        message: "Error creating booking",
      });
    }
  }
  async getallUserBookings(req, res) {
    try {
      const id = req.user.id;
      const userBookings = await User.findOne({ _id: id }).populate("bookings");
      if (!userBookings) {
        return JsonResponse(res, {
          title: "Booking not found",
          status: 404,
          message: "No user bookings",
          data: [],
        });
      }
      return JsonResponse(res, {
        status: 200,
        message: "User Bookings fetched successfully",
        success: true,
        data: userBookings.bookings,
      });
    } catch (err) {
      console.log(err);
      return JsonResponse(res, {
        status: 500,
        message: "Server Error in creating user",
        success: false,
        error: err.message,
      });
    }
  }
  // single booking
  async getBookingById(req, res) {
    try {
      const id = req.user.id;
      const { bookingId } = req.params;
      console.log("bookingId", bookingId);
      const userBookings = await Booking.findById(bookingId)
        .populate("place")
        .populate("review")
        .populate("payment");
      if (!userBookings)
        return JsonResponse(res, {
          status: 404,
          message: "No user bookings",
          data: [],
          success: false,
        });
      return JsonResponse(res, {
        status: 200,
        message: "User Bookings fetched successfully",
        success: true,
        data: userBookings,
      });
    } catch (err) {
      console.log(err);
      return JsonResponse(res, {
        status: 500,
        message: "Server Error in creating user",
        success: false,
        error: err.message,
      });
    }
  }

  // Cancel booking
  async cancelBooking(req, res) {
    try {
      const { bookingId } = req.params;

      const booking = await Booking.findById(bookingId).populate({
        path: "place",
        select: "host",
      });

      if (!booking) {
        return JsonResponse(res, {
          status: 404,
          message: "Booking not found",
          success: false,
        });
      }
      const hostId = booking.place.host;
      const host = await User.findById(hostId);
      if (host && host.role === "Host") {
        host.cancelRequest.push(bookingId);
        await host.save();
      }

      return JsonResponse(res, {
        status: 200,
        message: "Cancel request submitted successfully",
        success: true,
        data: host,
      });
    } catch (err) {
      console.error(err);
      return JsonResponse(res, {
        status: 500,
        message: "Server Error in making Cancelling Request",
        success: false,
        error: err.message,
      });
    }
  }

  // Request for booking advance booking need to make good flow control request   need to check here
  async RequestforAdvanceBooking(req, res) {
    try {
      const { userId, bookingId } = req.body;
      const booking = await Booking.findById(bookingId).populate({
        path: "place",
        select: "host",
      });

      if (!booking) {
        return JsonResponse(res, {
          status: 404,
          message: "Booking not found",
          success: false,
        });
      }

      // Get the host's user ID from the place
      const hostId = booking.place.host;

      // Add booking request to the host's bookingRequest array
      const host = await User.findById(hostId);
      if (host && host.role === "Host") {
        host.bookingRequest.push(bookingId);
        await host.save();
      }

      return JsonResponse(res, {
        status: 200,
        message: "Booking request submitted successfully",
        success: true,
        data: host,
      });
    } catch (err) {
      console.error(err);
      return JsonResponse(res, {
        status: 500,
        message: "Server Error in submitting booking request",
        success: false,
        error: err.message,
      });
    }
  }
}

export default new BookingController();
