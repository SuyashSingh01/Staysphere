import React, { memo } from "react";
import PropTypes from "prop-types";
// import PlaceImg from "../common/PlaceImg.jsx";
import SwipeImages from "./SwipeImages.jsx";
import { addListing, addplaceDetail } from "../../Redux/slices/ListingSlice.js";
import { useDispatch, useSelector } from "react-redux";

import { useDeletePlace } from "../../hooks/host/useMutationDeleteHostedPlace.js";

const InfoCard = ({ place, navigate }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const editHandler = () => {
    dispatch(addplaceDetail(place));
    navigate(`/account/places/${place?._id}`, { state: { place } });
  };
  const deletePlaceMutation = useDeletePlace();

  const deletHandler = () => {
    if (!token) {
      console.error("No token found!");
      return;
    }
    deletePlaceMutation.mutate({ placeId: place._id, token });
  };

  const requestHandler = () => {
    navigate("/account/hosted/bookings");
  };
  return (
    <div
      className="mx-3 flex flex-col md:flex-row gap-4 rounded-2xl bg-gray-100 p-2 md:p-4 transition-all hover:bg-gray-200 shadow-md"
      key={place?._id}
    >
      {/* using swiper */}
      <div className="h-full max-w-[20rem] rounded-xl object-cover">
        <SwipeImages photos={place?.image} />
      </div>

      {/* <PlaceImg place={place} className=" w-full md:w-30 rounded-md" /> */}
      <div className="flex flex-col gap-2  p-2 md:p-4 rounded-md">
        <div className=" w-full">
          <h2 className="text-lg md:text-2xl font-bold  md:mt-2">
            {place.placeName}
          </h2>
          <p className="line-clamp-4 mt-2 md:mt-4 py-4 text-sm text-wrap">
            {place.description}
          </p>
        </div>
        <div className="mt-8 md:mt-8 my-8 ">
          <p className="text-sm md:text-base">Max Guests: {place.maxGuests}</p>
          <p className="text-sm md:text-base">Price: {place.price}</p>
          <p className="text-sm md:text-base">
            No. of Booking : {place?.numberOfBookings?.length}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-4 ">
          <button
            className="bg-orange-400 active:bg-orange-500  cursor-pointer rounded-md md:p-2 w-16 md:w-32 text-white"
            onClick={editHandler}
          >
            Edit
          </button>
          <button
            className="bg-orange-400 active:bg-orange-500  cursor-pointer rounded-md md:p-2 w-16 md:w-32 text-white"
            onClick={deletHandler}
          >
            {deletePlaceMutation.isLoading ? "Deleting..." : "Delete"}
          </button>
          <button
            className="bg-orange-400 active:bg-orange-500  cursor-pointer rounded-md md:p-3 w-16 md:w-32 text-white"
            onClick={requestHandler}
          >
            See-Request
          </button>
        </div>
      </div>
    </div>
  );
};
InfoCard.propTypes = {
  place: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    placeName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    maxGuests: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    numberOfBookings: PropTypes.number.isRequired,
    image: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  navigate: PropTypes.func.isRequired,
};

export default memo(InfoCard);
