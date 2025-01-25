import razorpayInstance from "../../config/razorpay.js";
import crypto from "crypto";
import User from "../../models/User.model.js";
import mailSender, { isOverlapping } from "../../utils/sendEmail.js";
import Place from "../../models/Place.model.js";
import Payment from "../../models/Payment.model.js";
import Booking from "../../models/Booking.model.js";
import { paymentSuccessEmail } from "../../mailTemplate/paymentSuccessEmail.js";

class PaymentController {
  // Capture Payment (Initiates payment and stores temporary data)
  async capturePayment(req, res) {
    try {
      const { placeId, checkOut, checkIn } = req.body.bookingDetail;
      const userId = req.user.id;

      if (!placeId || !userId) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
      }

      // Validate Place
      const place = await Place.findById(placeId);
      if (!place) {
        return res
          .status(404)
          .json({ success: false, message: "Place not found" });
      }

      // Check for overlapping bookings
      const user = await User.findById(userId).populate("bookings");
      const hasOverlappingBooking = user.bookings.some(
        (booking) =>
          booking.place.toString() === placeId &&
          isOverlapping(booking.checkIn, booking.checkOut, checkIn, checkOut)
      );
      if (hasOverlappingBooking) {
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: "Booking already exists for these dates",
        });
      }

      // Calculate total amount
      const totalAmount = place.price;

      // Create Razorpay Order
      const orderOptions = {
        amount: totalAmount * 100, // Amount in paise
        currency: "INR",
        receipt: `${Date.now()}_${userId}`,
      };
      const razorpayOrder = await razorpayInstance.orders.create(orderOptions);

      // Save temporary payment record (No booking yet)
      await Payment.create({
        orderId: razorpayOrder.id,
        userId,
        placeId,
        amount: totalAmount,
        currency: razorpayOrder.currency,
        paymentStatus: "pending",
        paymentMethod: "razorpay",
      });

      return JsonResponse(res, {
        success: true,
        message: "Payment initiated successfully",
        data: {
          orderId: razorpayOrder.id,
          amount: totalAmount,
          currency: razorpayOrder.currency,
        },
      });
    } catch (error) {
      console.error("Error capturing payment:", error);
      return JsonResponse(res, {
        status: 500,
        success: false,
        message: "Could not initiate payment",
      });
    }
  }

  // Verify Payment (Creates booking only after successful payment)
  async verifyPayment(req, res) {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        checkIn,
        checkOut,
      } = req.body;
      const userId = req.user.id;

      if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !userId
      ) {
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: "Please provide all the details",
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
          message: "Invalid signature",
        });
      }

      // Fetch temporary payment record
      const payment = await Payment.findOne({ orderId: razorpay_order_id });
      if (!payment) {
        return JsonResponse(res, {
          status: 404,
          success: false,
          message: "Payment not found",
        });
      }

      // Create Booking
      const newBooking = await Booking.create({
        name: payment.placeName,
        checkIn,
        checkOut,
        adults: 1,
        children: 0,
        roomType: "Single",
        amount: payment.amount,
        bookingStatus: "confirmed",
        bookingDate: new Date(),
        user: userId,
        place: payment.placeId,
      });

      // Update payment status as "success"
      payment.paymentStatus = "success";
      payment.bookingId = newBooking._id;
      await payment.save();

      return res.status(200).json({
        success: true,
        message: "Payment verified and booking confirmed",
        bookingId: newBooking._id,
      });
    } catch (error) {
      console.error("Error verifying payment:", error);
      res
        .status(500)
        .json({ success: false, message: "Could not verify payment" });
    }
  }

  async sendPaymentSuccessEmail(req, res) {
    const { orderId, paymentId, amount } = req.body;

    const userId = req.user.id;

    if (!orderId || !paymentId || !amount || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all the details" });
    }

    try {
      const bookedUser = await User.findById(userId);

      await mailSender(
        bookedUser.email,
        `Payment Received`,
        paymentSuccessEmail(
          `${bookedUser.name} `,
          amount / 100,
          orderId,
          paymentId
        )
      );
    } catch (error) {
      console.log("error in sending mail", error);
      return res
        .status(400)
        .json({ success: false, message: "Could not send email" });
    }
  }
}

export default new PaymentController();
