import React from "react";
import { Select, Button, Input } from "antd";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { addBooking } from "../Redux/slices/BookingSlice";
import { booking } from "../services/api.urls";
import { bookYourPlace } from "../services/apiOperations/bookplace";
import { handleBookingPayment } from "../components/Booking/payment";

const ConfirmAndPay = () => {
  const params = useParams();
  const bookingid = params.id;
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookings } = useSelector((state) => state.bookings);
  const { BookingDetails } = location.state || {};
  const { placeDetail, booking } = BookingDetails || {};

  // Find the existience we can do it in backend booking

  let checkin = "N/A";
  let checkout = "N/A";

  if (booking?.checkIn && booking?.checkOut) {
    const checkInDate = new Date(booking.checkIn);
    const checkOutDate = new Date(booking.checkOut);

    if (!isNaN(checkInDate) && !isNaN(checkOutDate)) {
      checkin = format(checkInDate, "yyyy-MM-dd");
      checkout = format(checkOutDate, "yyyy-MM-dd");
    }
  }

  const bookingHandler = async () => {
    try {
      await handleBookingPayment();
      // called the handlebooking route
      // add  the booking in the backend
      console.log("handllebookingpayement called");
      dispatch(addBooking({ ...booking }));
      // add the logic for payment after the booking has been added  to the backend

      // bookYourPlace(
      //   token,
      //   booking?.place,
      //   BookingDetails,
      //   userDetails,
      //   navigate,
      //   dispatch
      // );
      // toast.success("Booking Confirmed");

      // navigate("/paymentsuccess");
      // setTimeout(() => {
      //   navigate("/");
      // }, 3000);
    } catch (e) {
      console.error(e.message);
      toast.error(e.message);
    }
  };
  // Calculate the number of nights
  const date1 = new Date(checkin);
  const date2 = new Date(checkout);
  const diffTime = !isNaN(date1) && !isNaN(date2) ? Math.abs(date2 - date1) : 0;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) || 0;

  // Calculate prices
  const basePrice = BookingDetails?.price || 0;
  const airbnbFee = Math.floor((5 / 100) * basePrice);
  const taxes = Math.floor((18 / 100) * basePrice);
  const totalPrice = basePrice + 1 + taxes;

  // Guard against missing booking details
  if (!booking) {
    return (
      <h1 className="text-center text-xl md:text-3xl font-bold">
        Booking not found. Try again later.
      </h1>
    );
  }

  return (
    <div className="min-h-screen py-10 px-6 flex justify-center">
      <div className="w-full gap-3 max-w-5xl flex flex-col md:flex-row md:gap-5 justify-between items-center">
        {/* Left Section */}
        <div className="md:col-span-2 p-8 rounded-lg">
          <h1 className="text-2xl font-bold mb-6">Confirm and Pay</h1>

          {/* Trip Details */}
          <div className="border-b pb-4 mb-6">
            <h2 className="text-lg font-semibold">Your trip</h2>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <p>Check In Date</p>
                <p>{checkin}</p>
              </div>
              <div className="flex justify-between">
                <p>Check Out Date</p>
                <p>{checkout}</p>
              </div>
              <div className="flex justify-between">
                <p>Guests</p>
                <p>{booking?.noOfGuest || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="border-b pb-4 mb-6">
            <h2 className="text-lg font-medium">Pay with</h2>
            <div className="mt-4 space-y-4">
              <Select placeholder="Net Banking" className="w-full">
                <Select.Option key="hdfc" value="hdfc">
                  HDFC Bank
                </Select.Option>
                <Select.Option key="sbi" value="sbi">
                  State Bank of India
                </Select.Option>
                <Select.Option key="icici" value="icici">
                  ICICI Bank
                </Select.Option>
              </Select>
            </div>
          </div>

          {/* Required Information */}
          <div className="mb-6">
            <h2 className="text-lg font-medium">Required for your trip</h2>
            <div className="mt-4 space-y-4">
              <label>
                Your Full Name
                <Input
                  placeholder="Full Name"
                  className="w-full"
                  defaultValue={booking?.name || ""}
                  disabled
                />
              </label>
              <label>
                Your Phone Number
                <Input
                  placeholder="Phone Number"
                  className="w-full"
                  defaultValue={booking?.phone || ""}
                  disabled
                />
              </label>
              <div className="flex justify-center items-center">
                <Input
                  placeholder="Alternative Phone number"
                  className="w-full"
                  type="number"
                  minLength={10}
                  maxLength={12}
                />
                <Button className="bg-primary" type="primary">
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div>
            <h2 className="text-lg font-medium">Cancellation policy</h2>
            <p className="mt-4 text-sm text-gray-600">
              Free cancellation before {checkin}. After that, the reservation is
              non-refundable.
            </p>
          </div>

          {/* Confirm Button */}
          <button
            className="mx-auto my-8 flex rounded-xl bg-primary py-2 px-10 md:px-14 text-md md:text-lg font-semibold text-white"
            onClick={bookingHandler}
          >
            Confirm and Pay
          </button>
        </div>

        {/* Right Section */}
        <div className="p-6 rounded-lg">
          <div className="mb-6">
            <img
              src="https://via.placeholder.com/150"
              alt="Listing Thumbnail"
              className="h-40 w-60 object-cover rounded-md"
            />
            <h2 className="text-lg font-medium mt-4">
              {placeDetail?.title || "No title available"}
            </h2>
            <p className="text-gray-600">
              {placeDetail?.location || "No location provided"}
            </p>
          </div>

          {/* Price Details */}
          <div className="border-t pt-4">
            <h2 className="text-lg font-medium mb-4">Price details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <p>
                  {placeDetail?.price} x {diffDays} night
                </p>
                <p>{basePrice}</p>
              </div>
              <div className="flex justify-between">
                <p>Airbnb service fee</p>
                <p>{airbnbFee}</p>
              </div>
              <div className="flex justify-between">
                <p>Taxes</p>
                <p>{taxes}</p>
              </div>
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
              <p className="text-xl font-semibold">Total (INR)</p>
              <p className="text-xl font-semibold">₹{totalPrice}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAndPay;
