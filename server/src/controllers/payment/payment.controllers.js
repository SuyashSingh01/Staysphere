import razorpayInstance from "../../config/razorpay.js";
import crypto from "crypto";
import User from "../../models/User.model.js";
import { isOverlapping } from "../../utils/utlitity.js";
import Place from "../../models/Place.model.js";
import Payment from "../../models/Payment.model.js";
import Booking from "../../models/Booking.model.js";
import { paymentSuccessEmail } from "../../mailTemplate/paymentSuccessEmail.js";
import { JsonResponse } from "../../utils/jsonResponse.js";
import { config } from "dotenv";
import BookingControllers from "../booking/booking.controllers.js";

config();

class PaymentController {
  // Capture Payment (Initiates payment and stores temporary data)

  async capturePayment(req, res) {
    try {
      const {
        checkOut,
        checkIn,
        currency = "INR",
        receipt,
        placeId,
      } = req.body.bookingDetail;
      const userId = req.user.id;

      if (!placeId) {
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: "Missing required fields",
        });
      }

      // Validate Place
      const place = await Place.findById(placeId);
      if (!place) {
        return JsonResponse(res, {
          success: false,
          message: "Place not found",
          status: 404,
          data: null,
        });
      }

      // Check if the place is already booked for the requested dates
      const existingBookings = await Booking.find({
        place: placeId,
        bookingStatus: "booked",
        $or: [{ checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } }],
      });

      if (existingBookings.length > 0) {
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: "The place is already booked for the selected dates.",
        });
      }

      const amount = place.price;

      try {
        // Create Razorpay Order
        const orderOptions = {
          amount: amount * 100, // Amount in paise
          currency: currency,
          receipt: receipt || `${Date.now()}_${userId}_${placeId}`,
        };
        const razorpayOrder = await razorpayInstance.orders.create(
          orderOptions
        );

        if (!razorpayOrder) {
          return JsonResponse(res, {
            status: 500,
            success: false,
            message: "Payment could not be initiated",
          });
        }

        // Save temporary payment record (No booking yet)
        const paymentId = await Payment.create({
          orderId: razorpayOrder.id,
          userId,
          placeId,
          amount: amount,
          currency: razorpayOrder.currency,
          paymentStatus: "pending",
          paymentMethod: "razorpay",
        });

        return JsonResponse(res, {
          status: 200,
          success: true,
          message: "Payment initiated successfully",
          data: {
            razorpayOrder,
          },
          paymentId: paymentId.id,
        });
      } catch (error) {
        console.log(error);
        return JsonResponse(res, {
          success: false,
          message: "Payment could not be initiated",
          status: 500,
        });
      }
    } catch (error) {
      console.log(error);
      return JsonResponse(res, {
        success: false,
        message: "Something went wrong",
        status: 500,
      });
    }
  }

  // Verify Payment (Creates booking only after successful payment)
  async verifyPayment(req, res) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;
      const userId = req.user.id;
      console.log(
        "razorpay ids",
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !userId
      ) {
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: "Please provide all the details for the order",
        });
      }

      // Verify Razorpay Signature
      const body = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        // Update payment status as "failed"
        await Payment.findOneAndUpdate(
          { orderId: razorpay_order_id },
          { paymentStatus: "failed" }
        );
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: "Invalid signature for payment",
        });
      }

      // Fetch temporary payment record
      // Update payment status as "success"
      const payment = await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        {
          paymentStatus: "success",
          signature: razorpay_signature,
        },
        { new: true }
      );

      if (!payment) {
        return JsonResponse(res, {
          status: 404,
          success: false,
          message: "Payment not found",
        });
      }
      // also update the booking status to completed
      // const booking = await Booking.findOneAndUpdate(
      //   { _id: payment.bookingId },
      //   { bookingStatus: "completed" },
      //   { new: true }
      // )
      // .populate("user")
      // .populate("payment");
      // await mailSender(
      //   booking.email,
      //   `Staysphere || Payment Received Your Booking Id${booking._id}`,
      //   paymentSuccessEmail(
      //     `${booking?.user?.name} `,
      //     payment?.amount,
      //     payment?.orderId,
      //     payment?.paymentId
      //   )
      // );

      //  already Created Booking in creating booking routes

      // const newBooking = await Booking.create({
      //   name: payment.placeName,
      //   checkIn,
      //   checkOut,
      //   adults: 1,
      //   children: 0,
      //   roomType: "Single",
      //   amount: payment.amount,
      //   bookingStatus: "confirmed",
      //   bookingDate: new Date(),
      //   user: userId,
      //   place: payment.placeId,
      // });
      // no need to update
      // payment.paymentStatus = "success";
      // payment.bookingId = newBooking._id;
      // await payment.save();

      return JsonResponse(res, {
        status: 200,
        success: true,
        message: "Payment verified and booking confirmed",
        data: payment,
      });
    } catch (error) {
      console.error("Error verifying payment:", error);
      return JsonResponse({
        status: 500,
        success: false,
        message: "Could not verify payment",
        error: error.message,
      });
    }
  }

  // async sendPaymentSuccessEmail(req, res) {
  //   const { orderId, paymentId, amount } = req.body;
  //   const userId = req.user.id;

  //   if (!orderId || !paymentId || !amount || !userId) {
  //     return JsonResponse(res, {
  //       status: 400,
  //       success: false,
  //       message: "Please provide all the details",
  //     });
  //   }

  //   try {
  //     const bookedUser = await User.findById(userId);

  //     await mailSender(
  //       bookedUser.email,
  //       `Payment Received`,
  //       paymentSuccessEmail(
  //         `${bookedUser.name} `,
  //         amount / 100,
  //         orderId,
  //         paymentId
  //       )
  //     );
  //   } catch (error) {
  //     console.log("error in sending mail", error);
  //     return JsonResponse(res, {
  //       status: 400,
  //       success: false,
  //       message: "Could not send email",
  //     });
  //   }
  // }
}

export default new PaymentController();
