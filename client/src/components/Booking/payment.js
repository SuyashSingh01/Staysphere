import axios from "axios";
import { toast } from "react-toastify";
import { notification } from "antd";

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

// Function to dynamically load the Razorpay script
function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      console.log("Script loaded");
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export async function handleBookingPayment(
  token,
  placeId,
  userDetails,
  navigate,
  dispatch
) {
  // const toastId = toast.loading("Loading...");
  try {
    const toastId = notification.info({ message: "Loading...", duration: 1 });
    //load the script
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      // toast.error("RazorPay SDK failed to load");
      notification.error(
        { message: "RazorPay SDK failed to load" },
        { placement: "Top left" }
      );

      return;
    }

    //initiate the order
    const orderResponse = await axios.post(
      "http://localhost:4001/api/v1/checkout",
      {
        bookingDetail: {
          placeId: "679f57c368a6885963cd4f11",
          checkIn: "09-02-25",
          checkOut: "10-02-25",
          price: "1",
          currency: "INR",
          receipt: "suyashTest",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OTg2ZWI0MTJlNjU2NGEwYjdkMWJlYiIsImVtYWlsIjoic2luZ2hzdXlhc2gwNDVAZ21haWwuY29tIiwiaWF0IjoxNzM4OTI1MTE5LCJleHAiOjE3MzkwMTE1MTl9.qxAXeezFq_Y8aiejdCRWxVHHzyonJG-cxH8G-pPo5TM"}`,
        },
      }
    );
    console.log("orderResponse", orderResponse);
    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message);
    }
    console.log("PRINTING orderResponse", orderResponse);

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
        console.log("razorpay_payment_id", razorpay_payment_id);
        console.log("razorpay_order_id", razorpay_order_id);
        console.log("razorpay_signature", razorpay_signature);
        //send successful wala mail
        // sendPaymentSuccessEmail(
        //   response,
        //   orderResponse.data.message.amount,
        //   token
        // );
        //verifyPayment
        // verifyPayment({ ...response, booking }, token, navigate, dispatch);
        const paymentverifyresponse = await axios.post(
          "http://localhost:4001/api/v1/verifyPayment",
          {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
          },
          {
            headers: {
              Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OTg2ZWI0MTJlNjU2NGEwYjdkMWJlYiIsImVtYWlsIjoic2luZ2hzdXlhc2gwNDVAZ21haWwuY29tIiwiaWF0IjoxNzM4OTI1MTE5LCJleHAiOjE3MzkwMTE1MTl9.qxAXeezFq_Y8aiejdCRWxVHHzyonJG-cxH8G-pPo5TM"}`,
            },
          }
        );
        console.log("paymentverifyresponse", paymentverifyresponse?.data?.data);
        const bookingcreated = await axios.post(
          `http://localhost:4001/api/v1/create-booking/${paymentverifyresponse.data.data._id}`,
          {
            placeId: "679f57c368a6885963cd4f11",
            checkIn: "09-02-25",
            checkOut: "10-02-25",
            price: "1",
            phone: "83497232",
          },
          {
            headers: {
              Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OTg2ZWI0MTJlNjU2NGEwYjdkMWJlYiIsImVtYWlsIjoic2luZ2hzdXlhc2gwNDVAZ21haWwuY29tIiwiaWF0IjoxNzM4OTI1MTE5LCJleHAiOjE3MzkwMTE1MTl9.qxAXeezFq_Y8aiejdCRWxVHHzyonJG-cxH8G-pPo5TM"}`,
            },
          }
        );
        console.log("booking created", bookingcreated);
      },
      notes: {
        address: "Address",
      },
      theme: {
        color: "#F37254",
      },
    };
    //miss hogya tha
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    paymentObject.on("payment.failed", function (response) {
      console.log("Payment Failed Response:", response);
    });

    // };
    // const rzp = new Razorpay(options);
    // rzp.open();
  } catch (e) {
    console.log("PAYMENT API ERROR.....", e);
    notification.error({
      message: `Could not make Payment ${e.response.data.message}`,
      duration: 1,
    });
  }
}
