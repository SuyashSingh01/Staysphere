import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../../Redux/slices/ListingSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import img1 from "../../assets/pexels-pixabay-533769.jpg"
import SwipeImages from "../../components/Card/SwipeImages.jsx";

import { CiStar } from "react-icons/ci";
const PlaceCard = ({ place }) => {

  const { id: placeId, images: photos, location: address, title, price, rating } = place;
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.listings.favorites);
  // console.log("image:" ,place.photos)

  // Check if the place is already in favorites
  const isFavorited = favorites.includes(placeId);
  // console.log("isFavorited", isFavorited);

  const handleLikeDislike = () => {
    if (isFavorited) {
      console.log("Remove from favorites", isFavorited);
      dispatch(removeFavorite(placeId)); // Remove from favorites
    } else {
      dispatch(addFavorite(placeId)); // Add to favorites
    }
  };

  return (

    <div className="flex flex-col justify-center  w-[330px] shadow-md p-2 rounded-xl">

      <Link to={`/place/${placeId}`}>
        {/* change with dynamic image link */}
        <div className="h-full w-[300px] rounded-xl object-cover">
          <SwipeImages photos={place.photos} />
        </div>
      </Link>
      <div className="flex justify-between items-center p-2">
        <div className="flex flex-col my-4 gap-2">
          <div className="flex items-center justify-between ">
            <h2 className="truncate font-bold">{address}</h2>
            <span className="flex md:text-md items-center"><CiStar />{rating}</span>
          </div>
          <h3 className="truncate text-sm text-gray-500 md:mt-1">{title}</h3>
          <div className="mt-1 md:mt-2">
            <span className="font-semibold">₹{price} </span>
            per night
          </div>
        </div>
        {/* Like/Dislike Button */}
        <div className="">
          <button onClick={handleLikeDislike} className="text-md text-red-500 bg-white focus:outline-none p-2"
          >{isFavorited ? (
            <FaHeart className="h-6 w-4" />) : (<FaRegHeart className="h-6 w-4" />)}
          </button>
        </div>
      </div>
    </div>


  );
};

export default PlaceCard;
