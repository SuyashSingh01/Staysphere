import React from "react";
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
        <img src={image} className="w-16 rounded-sm" key={image} />
      ))}
    </Carousel>
  );
};
export default SwipeImages;
