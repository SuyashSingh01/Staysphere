import React from "react";

const BookingRequests = () => {
  const requests = [
    {
      guestName: "John Doe",
      checkInDate: "2025-01-10",
      checkOutDate: "2025-01-15",
      numberOfGuests: 2,
      totalPrice: 500,
    },
    {
      guestName: "Jane Smith",
      checkInDate: "2025-01-20",
      checkOutDate: "2025-01-25",
      numberOfGuests: 4,
      totalPrice: 800,
    },
    {
      guestName: "Alice Johnson",
      checkInDate: "2025-01-28",
      checkOutDate: "2025-02-02",
      numberOfGuests: 3,
      totalPrice: 700,
    },
  ];
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Booking Requests
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request, index) => (
          <div
            key={index}
            className="bg-gray-200 shadow-md rounded-lg p-4 hover:scale-105 transform transition-transform duration-300 ease-in-out"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              {request.guestName}
            </h2>
            <p className="text-gray-700 mt-2">
              <span className="font-medium">Check-in:</span>{" "}
              {request.checkInDate}
            </p>
            <p className="text-gray-700 mt-1">
              <span className="font-medium">Check-out:</span>{" "}
              {request.checkOutDate}
            </p>
            <p className="text-gray-700 mt-1">
              <span className="font-medium">Guests:</span>{" "}
              {request.numberOfGuests}
            </p>
            <p className="text-gray-700 mt-1">
              <span className="font-medium">Price:</span> ${request.totalPrice}
            </p>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition-colors duration-300">
              Accept Request
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};


export default BookingRequests;
