import axios from "axios";
import Reviews from "../components/common/Reviews";
import Spinner from "../components/common/Spinner";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import AddressLink from "../components/PlaceDetail/AddressLink";
import BookingDates from "../components/common/BookingDates";
import PlaceGallery from "../components/common/PlaceGallery";
import ExploreCard from "../components/common/ExploreCard";
import { request } from "../services/apiConnector";
import { useSelector } from "react-redux";
import { bookingsApis } from "../services/api.urls";
import { LoadingSpinner } from "../components/Wrapper/PageWrapper";

const SingleBookedPlace = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState({});
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const getBookings = async () => {
    try {
      setLoading(true);
      const { data } = await request(
        "GET",
        `${bookingsApis.GET_BOOKING_BY_ID + id}`,
        null,
        { Authorization: `Bearer ${token}` }
      );
      console.log("BookingData", data?.data);
      setBooking(data?.data);
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookings();
  }, [id]);

  return loading ? (
    <LoadingSpinner />
  ) : (
    <div>
      {booking?.place ? (
        <div className="p-4">
          <h1 className="text-3xl">{booking?.place?.placeName}</h1>
          <AddressLink
            className="my-2 block"
            placeAddress={booking.place?.placeLocation}
          />
          <PlaceGallery place={booking?.place?.image} />
          <div className="my-6 flex flex-col items-center justify-between rounded-2xl bg-gray-200 p-6 sm:flex-row">
            <div className="p-4 my-8">
              <h2 className="mb-4 text-2xl md:text-2xl">
                Your booking information
              </h2>
              <BookingDates booking={booking} />
            </div>
            <div className="mt-5 w-[80%] rounded-2xl bg-primary text-white sm:mt-0 flex justify-around items-center p-2 md:p-4">
              <div className="hidden md:block text-xl md:text-2xl">
                Total price
              </div>
              <div className="flex justify-center text-2xl">
                <span>₹{booking?.place?.price}</span>
              </div>
            </div>
          </div>
          <Reviews placeId={booking?._id} />
        </div>
      ) : (
        <ExploreCard
          title={"Booked Places"}
          explore={
            "You haven’t Booked any places yet. Explore and Book your favorites place!"
          }
        />
      )}
    </div>
  );
};

export default SingleBookedPlace;
