import { bookingsApis, paymentApis } from "../../services/api.urls";
import { notification } from "antd";
import { request } from "../../services/apiConnector";

// export const handlePayment = async () => {
//   const orderResponse = await axios.post(
//     "http://localhost:4000/api/v1/payment/create-order",
//     {
//       amount: 1,
//     }
//   );

//   const { razorpay_order_id } = orderResponse.data;

//   const options = {
//     key: "YOUR_RAZORPAY_KEY_ID", // Enter the Key ID generated from the Dashboard
//     amount: 1000, // Amount in the smallest currency unit (e.g., paise for INR)
//     currency: "INR",
//     name: "Your Company Name",
//     description: "Test Transaction",
//     order_id: razorpay_order_id, // This is the order ID returned by Razorpay
//     handler: async (response) => {
//       const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
//         response;

//       await axios.post("http://localhost:4000/api/v1/payment/verify", {
//         razorpay_order_id,
//         razorpay_payment_id,
//         razorpay_signature,
//       });
//     },
//     prefill: {
//       name: "Your Name",
//       email: "your.email@example.com",
//       contact: "9999999999",
//     },
//     notes: {
//       address: "Your Address",
//     },
//     theme: {
//       color: "#F37254",
//     },
//   };

//   const rzp = new Razorpay(options);
//   rzp.open();
// };

// // Call handlePayment when the user initiates the payment
// handlePayment();

const {
  BOOKING_PAYMENT_CHECKOUT_API,
  BOOKING_VERIFY_API_PAYMENT,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = paymentApis;
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

export async function handleBookingPayment(
  token,
  bookingDetail,
  userDetails,
  navigate,
  dispatch
) {
  try {
    const toastId = notification.info({ message: "Loading...", duration: 1 });
    //load the script
    const loaded = await loadRazorpay();
    if (!loaded) {
      notification.error(
        { message: "Failed to load Razorpay SDK" },
        { placement: "Top left" }
      );
      return;
    }

    bookingDetail.currency = "INR";
    bookingDetail.receipt = "suyashTest";
    console.log("bookingnHandle", bookingDetail);

    //initiate the order

    const orderResponse = await request(
      "POST",
      BOOKING_PAYMENT_CHECKOUT_API,
      {
        bookingDetail,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("orderResponse", orderResponse);
    console.log("PRINTING orderResponse", orderResponse);
    if (!orderResponse?.data.success) {
      navigate("/login");
      throw new Error(orderResponse?.data.message);
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      currency: orderResponse.data.data.razorpayOrder.currency,
      amount: `${orderResponse.data.data.razorpayOrder.amount}`,
      order_id: orderResponse.data.data.razorpayOrder.id,
      name: "Staysphere",
      description: "Thank You for Booking the Place",
      // image: rzpLogo,
      prefill: {
        name: `${"suyashsingh"}`,
        email: "singhsuyash045@gmail.com",
      },
      handler: async function (response) {
        console.log("payement response", response);
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
          response;

        await verifyPayment(
          { ...response },
          token,
          bookingDetail,
          userDetails,
          navigate,
          dispatch
        );
      },
      payment_capture: 1,
      method: {
        upi: true,
      },
      notes: {
        address: "Address",
      },
      theme: {
        color: "#F37254",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    paymentObject.on("payment.failed", function (response) {
      notification.error({
        message: `Payment Failed ${response.error.description}`,
        placement: "topLeft",
        duration: 1,
      });
      console.log("Payment Failed Response:", response);
    });
  } catch (e) {
    console.log("PAYMENT API ERROR.....", e);
    notification.error({
      message: `Could not make Payment ${e.response.data.message}`,
      duration: 1,
    });
  }
}

async function verifyPayment(
  response,
  token,
  bookingDetail,
  userDetails,
  navigate,
  dispatch
) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      response;
    const paymentverifyresponse = await request(
      "POST",
      BOOKING_VERIFY_API_PAYMENT,
      {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      },
      { Authorization: `Bearer ${token}` }
    );

    console.log("paymentverifyresponse", paymentverifyresponse?.data?.data);
    if (!paymentverifyresponse?.data?.success) {
      throw new Error(paymentverifyresponse?.data?.message);
    }
    // create the booking if payment is verified
    const bookingcreated = await request(
      "POST",
      `${bookingsApis.CREATE_BOOKING}/${paymentverifyresponse.data.data._id}`,
      {
        bookingDetail,
        userDetails,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("booking created", bookingcreated);
  } catch (e) {
    console.log("Payment verify error", e);
  }
}
