import React from "react";
import PropTypes from "prop-types";
import { Carousel } from "antd";

const contentStyle = {
  margin: 0,
  padding: 2,
  height: "100px",
  color: "#fff",
  textAlign: "center",
};

// const photos = [{img:img},]
const SwipeImages = ({ photos }) => {
  return (
    <Carousel arrows={true} infinite={false}>
      {photos?.map((image) => (
        <img src={image} className="w-16 rounded-sm" key={image} alt="" />
      ))}
    </Carousel>
  );
};
SwipeImages.propTypes = {
  photos: PropTypes.arrayOf(PropTypes.string).isRequired,
};
export default SwipeImages;
