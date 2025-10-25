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
import { redisConnect } from "../../config/redis.js";
import redisLockService from "../../services/locking/redisLockService.js";
import { BookingRequest, getOrCreateQueue } from "../../services/booking/bookingQueueService.js";
import { recommendationGraph } from "../../services/recommendation/recommendationEngine.js";

class BookingController {
  async createBooking(req, res) {
    try {
      const { checkIn, checkOut, phone, price, placeId } =
      req.body.bookingDetail;
      const userId = req.user.id;
      const { paymentId } = req.params;
      if (!checkIn || !checkOut || !phone || !price || !paymentId || !placeId) {
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: "All fields are required for booking",
        });
      }
      console.debug("Checking", checkIn, checkOut, phone, price, placeId);
      console.debug("paymentid", paymentId);
      
      // Check if place is already locked
      const lockValue = `${userId}-${Date.now()}`; // Unique identifier
      const lockKey = `lock:place:${placeId}`;
      let lockAcquired = false;
      const isLocked = await redisConnect.get(lockKey);

      // Add to priority queue
      const queue = getOrCreateQueue(placeId);
      const bookingRequest = new BookingRequest(
        userId,
        placeId,
        checkIn,
        checkOut,
        price,
        Date.now(),
        price // Higher price = higher priority
      );
      queue.enqueue(bookingRequest);

      console.log(`Booking request queued. Queue size: ${queue.size()}`);
      // Try to acquire distributed lock with retry
      const lockResult = await redisLockService.acquireLock(
        lockKey,
        lockValue,
        300, // 5 minutes TTL
        15,  // 15 retry attempts
        200  // 200ms between retries
      );

      if (!lockResult.success) {
        return JsonResponse(res, {
          status: 409,
          success: false,
          message: "Place is currently being booked by another user. Please try again.",
        });
      }

      lockAcquired = true;
      console.log(`Lock acquired after ${lockResult.attempt} attempts`);

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
      // Release lock after booking creation
      await redisConnect.del(lockKey);
      // Update place and user
      const [updatedPlace, user] = await Promise.all([
        Place.findByIdAndUpdate(
          placeId,
          { $push: { numberOfBookings: booking._id } },
          { new: true }
        ).populate("host"),
        User.findByIdAndUpdate(
          userId,
          { $push: { bookings: booking._id } },
          { new: true }
        )
      ]);
       // Add to recommendation graph
      recommendationGraph.addInteraction(userId, placeId, 'booked');
       // Generate receipt and send email (non-blocking)
      this.sendBookingConfirmation(booking, user, updatedPlace, payment)
        .catch(err => console.error('Error sending confirmation:', err));

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
    finally {
      // Always release lock
      if (lockAcquired) {
        await redisLockService.releaseLock(lockKey, lockValue);
        console.log('Lock released');
      }
    }
  }
  async getallUserBookings(req, res) {
    try {
      const id = req.user.id;
      const userBookings = await User.findOne({ _id: id }).populate({
        path: "bookings",
        populate: {
          path: "place",
          model: "Place",
        },
      });
      const userBookingsData = userBookings.bookings.map((booking) => {
        return {
          bookingId: booking._id,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          place: booking.place.placeName,
          image: booking.place.image,
          price: booking.place.price,
          bookingStatus: booking.bookingStatus,
        };
      });

      // console.log(userBookingsData);

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
        data: userBookingsData,
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
  async requestforAdvanceBooking(req, res) {
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

  async sendBookingConfirmation(booking, user, place, payment) {
    try {
      const receiptPath = await generateReceipt({
        _id: booking._id,
        user,
        updatedPlace: place,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        price: booking.price,
        paymentId: payment._id,
      });

      await mailSender(
        user.email,
        `Staysphere || Payment Received - Your Booking ID: ${booking._id}`,
        paymentSuccessEmail(
          user.name,
          payment.amount,
          payment.orderId,
          payment._id
        ),
        [{ filename: "Receipt.pdf", path: receiptPath }]
      );
    } catch (error) {
      console.error('Error sending booking confirmation:', error);
    }
  }

  
  // Get personalized recommendations for a user
  async getRecommendations(req, res) {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit) || 10;

      // Get recommendations from graph
      const recommendations = recommendationGraph.recommendPlaces(userId, limit * 2);

      // Fetch full place details
      const placeIds = recommendations.map(r => r.placeId);
      const places = await Place.find({
        _id: { $in: placeIds },
        isActive: true
      })
      .populate('host', 'name email')
      .limit(limit);

      // Merge scores with place data
      const placesWithScores = places.map(place => {
        const rec = recommendations.find(r => r.placeId === place._id.toString());
        return {
          ...place.toObject(),
          recommendationScore: rec?.score || 0
        };
      });

      return JsonResponse(res, {
        status: 200,
        success: true,
        message: "Recommendations fetched successfully",
        data: placesWithScores,
      });
    } catch (error) {
      console.error('Recommendation error:', error);
      return JsonResponse(res, {
        status: 500,
        success: false,
        message: "Error fetching recommendations",
        error: error.message
      });
    }
  }

  //  Get similar places
  async getSimilarPlaces(req, res) {
    try {
      const { placeId } = req.params;
      const limit = parseInt(req.query.limit) || 10;

      const similarPlaces = recommendationGraph.findSimilarPlaces(placeId, limit * 2);

      const placeIds = similarPlaces.map(p => p.placeId);
      const places = await Place.find({
        _id: { $in: placeIds },
        isActive: true
      })
      .populate('host', 'name email')
      .limit(limit);

      const placesWithScores = places.map(place => {
        const sim = similarPlaces.find(s => s.placeId === place._id.toString());
        return {
          ...place.toObject(),
          similarityScore: sim?.score || 0
        };
      });

      return JsonResponse(res, {
        status: 200,
        success: true,
        message: "Similar places fetched successfully",
        data: placesWithScores,
      });
    } catch (error) {
      console.error('Similar places error:', error);
      return JsonResponse(res, {
        status: 500,
        success: false,
        message: "Error fetching similar places",
        error: error.message
      });
    }
  }
}

export default new BookingController();
