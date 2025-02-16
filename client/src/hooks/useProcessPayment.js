import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "../services/apiConnector";
import { bookingsApis, paymentApis } from "../services/api.urls";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import { addBooking } from "../Redux/slices/BookingSlice";

// Function to dynamically load the Razorpay script
async function loadRazorpay() {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Verify Payment & Create Booking
const verifyPayment = async (response, token, bookingDetail, userDetails) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    response;

  const paymentVerifyResponse = await request(
    "POST",
    paymentApis.BOOKING_VERIFY_API_PAYMENT,
    { razorpay_order_id, razorpay_payment_id, razorpay_signature },
    { Authorization: `Bearer ${token}` }
  );

  if (!paymentVerifyResponse?.data?.success) {
    throw new Error(paymentVerifyResponse?.data?.message);
  }

  // Create booking if payment is verified
  const bookingCreated = await request(
    "POST",
    `${bookingsApis.CREATE_BOOKING}/${paymentVerifyResponse.data.data._id}`,
    { bookingDetail, userDetails },
    { Authorization: `Bearer ${token}` }
  );

  return bookingCreated.data;
};

// Handle Booking Payment with Razorpay
export const useBookingPayment = (token, bookingDetail, userDetails) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async () => {
      const loaded = await loadRazorpay();
      if (!loaded) {
        throw new Error("Failed to load Razorpay SDK");
      }

      bookingDetail.currency = "INR";
      bookingDetail.receipt = "BookingReceipt";
      const orderResponse = await request(
        "POST",
        paymentApis.BOOKING_PAYMENT_CHECKOUT_API,
        { bookingDetail },
        { Authorization: `Bearer ${token}` }
      );

      if (!orderResponse?.data.success) {
        throw new Error(orderResponse?.data.message);
      }

      return new Promise((resolve, reject) => {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY,
          currency: orderResponse.data.data.razorpayOrder.currency,
          amount: `${orderResponse.data.data.razorpayOrder.amount}`,
          order_id: orderResponse.data.data.razorpayOrder.id,
          name: "Staysphere",
          description: "Thank you for booking!",
          prefill: { name: "User", email: "user@example.com" },
          handler: async function (response) {
            try {
              const bookingCreated = await verifyPayment(
                response,
                token,
                bookingDetail,
                userDetails
              );
              resolve(bookingCreated);
              dispatch(addBooking(bookingCreated));
            } catch (error) {
              reject(error);
            }
          },
          theme: { color: "#F37254" },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", function (response) {
          reject(new Error(`Payment Failed: ${response.error.description}`));
        });
      });
    },
    onSuccess: () => {
      notification.success({ message: "Booking successful!", duration: 2 });
      queryClient.invalidateQueries(["bookings"]);
      navigate("/account/bookings");
    },
    onError: (error) => {
      notification.error({
        message: `Payment Error: ${error.response.data.message}`,
      });
    },
  });
};
