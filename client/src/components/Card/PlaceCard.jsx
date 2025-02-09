import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { memo, useEffect, useRef, useState } from "react";
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

const PlaceCard = ({ place }) => {
  const swiperRef = useRef(null);
  const {
    image: images,
    placeLoaction: location,
    placeName: title,
    review: rating,
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
    <>
      <div
        onClick={() => navigate(`/place/${id}`)}
        className="overflow-hidden relative flex flex-col mb-4 cursor-pointer shadow-md"
      >
        <div className="relative group">
          {/* Swiper for sliding images */}
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={handleSlideChange} // Update button visibility on slide change
            pagination={{ clickable: true }}
            modules={[Navigation, Pagination]}
            className="w-[250px] sm:h-[300px] h-[304px] rounded-xl overflow-hidden"
          >
            {images.map((img, index) => (
              <SwiperSlide key={index}>
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
                "left-3 scale-[0.9] hover:scale-100 hover:bg-opacity-100 bg-opacity-80 group-hover:opacity-100 opacity-0 duration-300 bg-white"
              }
            />
          )}
          {canSlideNext && (
            <ArrowButton
              onClickHandler={handleNextButtonClick}
              direction="next"
              style={
                "right-3 scale-[0.9] hover:scale-100 hover:bg-opacity-100 bg-opacity-80 group-hover:opacity-100 opacity-0 duration-300 bg-white"
              }
            />
          )}

          {/* Add to favorites button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeFavoriteHandler(id);
            }}
            className="absolute top-3 right-3 z-10"
          >
            <img
              src={isFavorite ? heart_icon_filled : heart_icon}
              className="w-6 h-6 hover:scale-105 duration-100 cursor-pointer active:scale-100"
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
              <span>{rating}</span>
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
    </>
  );
};

export default memo(PlaceCard);
