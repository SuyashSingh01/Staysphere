import React from "react";

const PlaceImg = ({ place, index = 0, className = "relative" }) => {
  if (!place.image?.length) {
    return (
      <img src={place.image} alt="image staysphere" className={className} />
    );
  }
  if (!className) {
    className = "object-cover";
  }
  return <img src={place.image[index]} alt="" className={className} />;
};

export default PlaceImg;
