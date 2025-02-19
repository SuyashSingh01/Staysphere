import { useEffect, useRef, useState } from "react";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
function GuestDropdown({ guests, handleGuestChange }) {
  const [isVisible, setIsVisible] = useState(false);
  const [adultCount, setAdultCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const dropdownRef = useRef(null);

  function handleAdultValueChange(value) {
    if (value > 0) {
      setAdultCount(value);
    }
  }

  function handleChildrenValueChange(value) {
    if (value >= 0) {
      setChildrenCount(value);
    }
  }

  useEffect(() => {
    handleGuestChange(adultCount + childrenCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adultCount, childrenCount]);

  // Function to handle clicks outside the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsVisible(false);
        console.log("out side click");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div
        onClick={() => setIsVisible(!isVisible)}
        className="w-full  rounded relative"
      >
        <div
          htmlFor="guests"
          className="text-xs font-semibold uppercase block mb-1 absolute px-4 pt-3"
        >
          Guests
        </div>
        <div className="w-full px-4 pt-7 pb-3 cursor-pointer rounded-lg">
          {guests > 1 ? `${guests} guests` : `${guests} guest`}
        </div>
      </div>
      {/* dropdown */}
      {isVisible && (
        <div
          ref={dropdownRef}
          className="w-[390px] max-w-[400px] p-4 scale-[1.0] absolute bg-white  top-[206px] left-0 rounded-lg flex flex-col gap-4"
          style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 4px 15px" }}
        >
          {/* adults */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className=" font-semibold">Adults</span>
              <span className="text-gray-600 text-sm">Age 13+</span>
            </div>
            <div className="flex gap-3 items-center">
              <button
                onClick={() => handleAdultValueChange(adultCount - 1)}
                className={`w-8 h-8 rounded-full text-xl border border-gray-800 flex justify-center items-center ${
                  adultCount === 1
                    ? "cursor-not-allowed opacity-40"
                    : "opacity-70 hover:opacity-100 "
                }`}
              >
                <CiCircleMinus />
              </button>
              <span className="font-semibold w-5 flex justify-center">
                {adultCount}
              </span>
              <button
                onClick={() => handleAdultValueChange(adultCount + 1)}
                className="w-8 h-8 rounded-full text-xl border border-gray-800 flex justify-center items-center"
              >
                <CiCirclePlus />
              </button>
            </div>
          </div>
          {/* childrens */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className=" font-semibold">Children</span>
              <span className="text-gray-600 text-sm">Ages 2-12</span>
            </div>
            <div className="flex gap-3 items-center">
              <button
                onClick={() => handleChildrenValueChange(childrenCount - 1)}
                className={`w-8 h-8 rounded-full text-xl border border-gray-800 flex justify-center items-center ${
                  childrenCount === 0
                    ? "cursor-not-allowed opacity-40"
                    : "opacity-70 hover:opacity-100 "
                }`}
              >
                <CiCircleMinus />
              </button>
              <span className="font-semibold w-5 flex justify-center">
                {childrenCount}
              </span>
              <button
                onClick={() => handleChildrenValueChange(childrenCount + 1)}
                className="w-8 h-8 rounded-full text-xl border border-gray-800 flex justify-center items-center"
              >
                <CiCirclePlus />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GuestDropdown;
