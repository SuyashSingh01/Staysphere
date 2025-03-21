import { Link } from "react-router-dom";
import React, { memo, useMemo } from "react";
import PlaceImg from "../components/common/PlaceImg.jsx";
import BookingDates from "../components/common/BookingDates.jsx";
import Spinner from "../components/common/Spinner.jsx";
import NoTripBookedYet from "../components/common/NoTripBookedYet.jsx";
import { useBookings } from "../hooks/useQueryBooking.js";

const BookingsPage = () => {
  const { data, isLoading } = useBookings();
  const Bookings = useMemo(() => {
    if (data?.status === 200) {
      return data.data;
    }
  }, [data?.data, isLoading]);

  console.log("Bookings", Bookings);
  if (isLoading) return <Spinner />;

  return (
    <div className="w-full min-h-screen bg-white py-8 px-4 md:px-8 lg:px-16">
      <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
        Your Bookings
      </h1>
      {Bookings?.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {Bookings.map((booking, index) => (
            <Link
              to={`/account/bookings/${booking.bookingId}`}
              key={booking._id || index}
              className="block transform overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:scale-105 hover:shadow-2xl"
            >
              {/* Place Image */}
              <div className="relative h-40 md:h-52">
                {booking?.image?.length ? (
                  <PlaceImg
                    place={booking}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                    <span>No Image Available</span>
                  </div>
                )}
              </div>

              {/* Booking Details */}
              <div className="p-4">
                <h2 className="mb-2 text-xl font-semibold text-gray-800">
                  {booking?.place}
                </h2>
                <BookingDates
                  booking={booking}
                  className="mb-2 text-gray-600"
                />
                <div className="flex items-center gap-2 text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6 text-blue-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                    />
                  </svg>
                  <span className="text-lg font-medium">
                    Total Price: ₹{booking?.price}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex justify-center">
          <NoTripBookedYet />
        </div>
      )}
    </div>
  );
};

export default memo(BookingsPage);
