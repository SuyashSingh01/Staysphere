// import React from "react";
// import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { addFavorite, removeFavorite } from "../../Redux/slices/ListingSlice";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import img1 from "../../assets/pexels-pixabay-533769.jpg";
// import SwipeImages from "../../components/Card/SwipeImages.jsx";

// import { CiStar } from "react-icons/ci";
// const PlaceCard = ({ place }) => {
//   const {
//     _id: placeId,
//     image,
//     PlaceLocation: address,
//     placeName: title,
//     price,
//     review: rating,
//   } = place;
//   console.log("Eachplace", place);
//   const dispatch = useDispatch();
//   const favorites = useSelector((state) => state.listings.favorites);
//   // console.log("image:" ,place.photos)

//   // Check if the place is already in favorites
//   const isFavorited = favorites.includes(placeId);
//   // console.log("isFavorited", isFavorited);

//   const handleLikeDislike = () => {
//     if (isFavorited) {
//       console.log("Remove from favorites", isFavorited);
//       dispatch(removeFavorite(placeId)); // Remove from favorites
//     } else {
//       dispatch(addFavorite(placeId)); // Add to favorites
//     }
//   };

//   return (
//     <div className="flex flex-col justify-center  w-[330px] shadow-md p-2 rounded-xl">
//       <Link to={`/place/${placeId}`}>
//         {/* change with dynamic image link */}
//         <div className="h-full w-[300px] rounded-xl object-cover">
// <SwipeImages photos={image} />
//         </div>
//       </Link>
//       <div className="flex justify-between items-center p-2">
//         <div className="flex flex-col my-4 gap-2">
//           <div className="flex items-center justify-between ">
//             <h2 className="truncate font-bold">{address}</h2>
//             <span className="flex md:text-md items-center">
//               <CiStar />
//               {rating}
//             </span>
//           </div>
//           <h3 className="truncate text-sm text-gray-500 md:mt-1">{title}</h3>
//           <div className="mt-1 md:mt-2">
//             <span className="font-semibold">₹{price} </span>
//             per night
//           </div>
//         </div>
//         {/* Like/Dislike Button */}
//         <div className="">
//           <button
//             onClick={handleLikeDislike}
//             className="text-md text-red-500 bg-white focus:outline-none p-2"
//           >
//             {isFavorited ? (
//               <FaHeart className="h-6 w-4" />
//             ) : (
//               <FaRegHeart className="h-6 w-4" />
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PlaceCard;

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { memo, useEffect, useRef, useState, forwardRef } from "react";
import ArrowButton from "../Button/ArrowButton";
import star_icon from "../../assets/icons/star-icon.svg";
import heart_icon from "../../assets/icons/heart-icon.svg";
import heart_icon_filled from "../../assets/icons/heart-icon-filled.svg";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { motion } from "framer-motion";

export function formatNumberWithCommas(number) {
  if (typeof number !== "number") {
    throw new Error("Input must be a number");
  }

  return number.toLocaleString("en-US");
}

const PlaceCard = ({ place, ref }) => {
  const swiperRef = useRef(null);
  const {
    image: images,
    placeLoaction: location,
    placeName: title,
    reviews: rating,
    dateRange,
    price,
    _id: id,
  } = place;
  const [canSlidePrev, setCanSlidePrev] = useState(false);
  const [canSlideNext, setCanSlideNext] = useState(images?.length > 1);
  const favorites = useSelector((state) => state.listings.favorites);
  const removeFavoriteHandler = (id) => {
    console.log("Remove from favorites", id);
  };

  const { user: currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  // Check if current listing is in favorites
  const isFavorite = favorites.includes(id);

  const handleSlideChange = (swiper) => {
    setCanSlidePrev(swiper.isBeginning === false); // Can slide prev if not at the first slide
    setCanSlideNext(swiper.isEnd === false); // Can slide next if not at the last slide
  };

  function handlePreviousButtonClick(event) {
    event.stopPropagation();
    swiperRef.current?.slidePrev();
  }

  function handleNextButtonClick(event) {
    event.stopPropagation();
    swiperRef.current?.slideNext();
  }

  // Animation state for image mounting
  const [isImageVisible, setIsImageVisible] = useState(false);

  useEffect(() => {
    // Set image visibility to true when the card is mounted
    setIsImageVisible(true);
  }, []);

  return (
    <div
      ref={ref}
      onClick={() => navigate(`/place/${id}`)}
      className="overflow-hidden relative flex flex-col mb-4 cursor-pointer shadow-lg p-4 rounded-xl"
    >
      <div className="relative group">
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={handleSlideChange} // Update button visibility on slide change
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination]}
          className="w-[260px] sm:h-[300px] h-[304px] rounded-xl overflow-hidden"
        >
          {images?.map((img, index) => (
            <SwiperSlide key={index + img}>
              <motion.img
                src={img}
                alt={`slide-${index}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }} // Start with 0 opacity
                animate={{ opacity: isImageVisible ? 1 : 0 }} // Fade in effect
                transition={{ duration: 1 }} // Set the duration of the fade-in animation
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Buttons */}
        {canSlidePrev && (
          <ArrowButton
            onClickHandler={handlePreviousButtonClick}
            direction="prev"
            style={
              "left-3 scale-[0.9] hover:scale-100 hover:bg-opacity-100 bg-opacity-80 group-hover:opacity-100 opacity-0 duration-300  bg-slate-200"
            }
          />
        )}
        {canSlideNext && (
          <ArrowButton
            onClickHandler={handleNextButtonClick}
            direction="next"
            style={
              "right-3 scale-[0.9] hover:scale-100 hover:bg-opacity-100 bg-opacity-80 group-hover:opacity-100 opacity-0 duration-300 bg-slate-200 "
            }
          />
        )}

        {/* Add to favorites button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeFavoriteHandler(id);
          }}
          className="absolute top-3 right-3 bg-transparent "
        >
          <img
            src={isFavorite ? heart_icon_filled : heart_icon}
            className="w-6 h-6  hover:scale-105 duration-100 cursor-pointer active:scale-100 z-10"
            alt="heart_icon"
          />
        </button>
      </div>
      {/* Card Content */}
      <div className="mt-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">{location}</h3>
          <div className="flex items-center gap-1">
            <img src={star_icon} className="w-3 h-3" alt="star_icon" />
            <span>{rating.length}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm">{title}</p>
        {/* <div className="flex items-center justify-between">
            <span className="text-gray-700 text-sm">{dateRange}</span>
          </div> */}
        <div className="mt-2 flex gap-1">
          <span className="font-semibold">
            ₹{formatNumberWithCommas(Number(price))}
          </span>
          <span>night</span>
        </div>
      </div>
    </div>
  );
};

export default memo(PlaceCard);
