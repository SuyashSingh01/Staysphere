import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { differenceInDays } from "date-fns";

import DatePickerWithRange from "./DatePickerWithRange.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../Redux/slices/AuthSlice.js";

import { addBooking } from "../../Redux/slices/BookingSlice.js";
import { notification } from "antd";

const BookingWidget = ({ place }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { _id, price } = place;

  const { user } = useSelector((state) => state.auth);
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const [bookingData, setBookingData] = useState({
    noOfGuests: 1,
    name: user?.name || "",
    phone: "",
  });
  const { noOfGuests, name, phone } = bookingData;

  const numberOfNights =
    dateRange.from && dateRange.to
      ? differenceInDays(
          new Date(dateRange.to).setHours(0, 0, 0, 0),
          new Date(dateRange.from).setHours(0, 0, 0, 0)
        )
      : 0;

  // handle booking form
  const handleBookingData = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBooking = async () => {
    // User must be signed in to book place

    if (!user) {
      notification.error({
        message: "Please sign in to book place ",
        duration: 1,
      });

      navigate("/register");
      return;
    }

    // BOOKING DATA VALIDATION
    if (numberOfNights < 1) {
      notification.error({
        message: "Please select valid dates",
        duration: 1,
      });
      return;
    } else if (noOfGuests < 1) {
      return notification.error({
        message: "No. of guests can't be less than 1",
        duration: 1,
      });
    } else if (noOfGuests > place.maxGuests) {
      return notification.error({
        message: `Allowed max. no. of guests: ${place.maxGuests}`,
        duration,
      });
    } else if (name.trim() === "") {
      return notification.error({
        message: "Name can't be empty",
        duration: 1,
      });
    } else if (phone.trim() === "") {
      return notification.error({
        message: "Phone can't be empty",
        duration: 1,
        style: {
          backgroundColor: "#f9f9f9",
          color: "#333",
          borderRadius: "10px",
          border: "5px solid #333",
        },
      });
    }
    // send the data to backend server
    dispatch(setLoading(true));
    try {
      const bookingDetails = {
        checkIn: dateRange.from.toISOString(),
        checkOut: dateRange.to.toISOString(),
        noOfGuests,
        name,
        phone,
        placeId: _id,
        price: numberOfNights * price,
      };

      dispatch(addBooking(bookingDetails));

      navigate(`/account/bookings/${_id}/confirm-pay`, {
        state: {
          place,
        },
      });
    } catch (error) {
      toast.error("Something went wrong!");
      console.log("Error: ", error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="rounded-2xl bg-white py-8 shadow-xl">
      <div className="text-center text-xl">
        Price: <span className="font-semibold">₹{place.price}</span> / per night
      </div>
      <div className="mt-4 rounded-2xl border p-2">
        <div className="flex md:w-full">
          <DatePickerWithRange setDateRange={setDateRange} />
        </div>
        <div className="border-t py-3 px-4">
          <label>
            Number of guests:
            <input
              type="number"
              name="noOfGuests"
              placeholder={`Max. guests: ${place.maxGuests}`}
              min={1}
              max={place.maxGuests}
              value={noOfGuests}
              onChange={handleBookingData}
            />
          </label>
        </div>
        <div className="border-t py-3 px-4">
          <label>Your full name: </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleBookingData}
          />
          <label>Phone number: </label>
          <input
            type="tel"
            name="phone"
            value={phone}
            minLength={10}
            onChange={handleBookingData}
          />
        </div>
      </div>
      <button onClick={handleBooking} className="primary mt-4 py-2">
        Book this place
        {numberOfNights > 0 && <span> ₹{numberOfNights * price}</span>}
      </button>
    </div>
  );
};

export default BookingWidget;
