import React from "react";
import { Link } from "react-router-dom";

const ExploreCard = ({ title, explore }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h2 className="text-2xl font-semibold text-gray-600 bg-white mt-4">
        No {title}
      </h2>
      <p className="text-gray-500 mt-2">{explore}</p>
      <Link
        to={"/"}
        className="mt-6 rounded-lg bg-orange-500 transition-colors px-6 py-2 text-white active:bg-orange-500  hover:bg-orange-700"
      >
        Explore Places
      </Link>
    </div>
  );
};

export default ExploreCard;
