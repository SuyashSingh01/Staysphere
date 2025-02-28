import React from "react";
import PropTypes from "prop-types";

const PlaceImg = ({ place, index = 0, className = "relative" }) => {
  if (!place.image?.length) {
    return (
      <img src={place.image} alt="image staysphere" className={className} />
    );
  }
  if (!className) {
    className = "object-cover";
  }
  return <img src={place?.image[index]} alt="" className={className} />;
};
PlaceImg.propTypes = {
  place: PropTypes.shape({
    image: PropTypes.arrayOf(PropTypes.string),
  }),
  index: PropTypes.number,
  className: PropTypes.string,
};

export default PlaceImg;
