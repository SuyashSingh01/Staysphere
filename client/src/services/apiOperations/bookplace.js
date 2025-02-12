import { bookingsApis } from "../api.urls";
import { request } from "../apiConnector";
import { setPaymentLoading } from "../../Redux/slices/BookingSlice";
import { toast } from "react-toastify";
import { notification } from "antd";

const {
  BOOKING_PAYMENT_API,
  BOOKING_VERIFY_API_PAYMENT,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = bookingsApis;

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;

    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export async function bookYourPlace(
  token,
  placeId,
  bookingDetail,
  userDetails,
  navigate,
  dispatch
) {
  const toastId = toast.loading("Loading...");
  try {
    //load the script
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      toast.error("RazorPay SDK failed to load");
      return;
    }

    //initiate the order
    const orderResponse = await request(
      "POST",
      BOOKING_PAYMENT_CHECKOUT_API,
      { placeId, bookingDetail },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message);
    }
    console.log("PRINTING orderResponse", orderResponse);
    //options
    const options = {
      key: process.env.RAZORPAY_KEY,
      currency: orderResponse.data.message.currency,
      amount: `${orderResponse.data.message.amount}`,
      order_id: orderResponse.data.message.id,
      name: "Staysphere",
      description: "Thank You for Booking with us",
      // image: apnalogo,
      prefill: {
        name: `${userDetails.name}`,
        email: userDetails.email,
      },
      handler: function (response) {
        //send successful wala mail
        sendPaymentSuccessEmail(
          response,
          orderResponse.data.message.amount,
          token
        );
        //verifyPayment
        verifyPayment(
          { ...response, bookingDetail },
          token,
          navigate,
          dispatch
        );
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    paymentObject.on("payment.failed", function (response) {
      toast.error("oops, payment failed");
      console.log(response.error);
    });
  } catch (error) {
    console.log("PAYMENT API ERROR.....", error);
    toast.error("Could not make Payment");
  }
  toast.dismiss(toastId);
}

async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    await request(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
  } catch (error) {
    console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
  }
}

//verify payment
async function verifyPayment(bodyData, token, navigate, dispatch) {
  notification.open(
    {
      message: "Payment is in progress",
      duration: 1,
      placement: "Top-left",
    },
    0
  );
  dispatch(setPaymentLoading(true));
  try {
    const response = await request(
      "POST",
      BOOKING_VERIFY_API_PAYMENT,
      bodyData,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    notification.success({
      message: "payment Successful,Booking added successfully",
      duration: 1,
      placement: "Top-left",
    });
    navigate("/account/bookings");
  } catch (error) {
    console.log("PAYMENT VERIFY ERROR....", error);
    notification.error({
      message: error.message,
      duration: 1,
      placement: "Top-left",
    });
  }

  dispatch(setPaymentLoading(false));
}
