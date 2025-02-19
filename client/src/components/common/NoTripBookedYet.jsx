import React from "react";
import { Link } from "react-router-dom";

function NoTripBookedYet() {
  return (
    <div className="mt-4">
      <div className="flex flex-col justify-start">
        <h1 className="my-6 text-3xl font-semibold">Trips</h1>
        <hr className="border border-gray-300" />
        <h3 className="pt-6 text-2xl font-semibold">No trips booked... yet!</h3>
        <p>Time to dust off you bags and start planning your next adventure</p>
        <Link to="/" className="my-4">
          <div className="flex w-40 justify-center rounded-lg  text-white bg-orange-400  p-3 text-lg font-semibold hover:bg-orange-500 transition-colors">
            Start Searching
          </div>
        </Link>
      </div>
    </div>
  );
}

export default NoTripBookedYet;
