import React from 'react';

const PlaceImg = ({ place, index = 0, className = "relative" }) => {
  if (!place.photos?.length) {
    return <img src=" https://via.placeholder.com/200" alt="" className={className} />;
  }
  if (!className) {
    className = 'object-cover';
  }
  return <img src={place.photos[index]} alt="" className={className} />;
};

export default PlaceImg;
