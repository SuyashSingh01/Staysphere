import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useSelector } from "react-redux";
import { Dropdown, Modal } from "antd";
import { LoginItems, LogoutItems } from "./NavDropdowndata.jsx";
import SearchBar from "../common/SearchBar";
import {
  FaHome,
  FaStar,
  FaUmbrellaBeach,
  FaMountain,
  FaUniversity,
  FaWater,
  FaTractor,
  FaBinoculars,
  FaFilter,
} from "react-icons/fa";

const Navbar = () => {
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [hasShadow, setHasShadow] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Historical homes");
  const [toggleTaxes, setToggleTaxes] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);

  const categories = [
    { name: "Homes", icon: <FaHome size={20} /> },
    { name: "Icons", icon: <FaStar size={20} /> },
    { name: "Islands", icon: <FaUmbrellaBeach size={20} /> },
    { name: "world", icon: <FaMountain size={20} /> },
    { name: "Castles", icon: <FaUniversity size={20} /> },
    { name: "Lake", icon: <FaWater size={20} /> },
    { name: "Farms", icon: <FaTractor size={20} /> },
    { name: "Amazing views", icon: <FaBinoculars size={20} /> },
  ];

  const handleScroll = (event) => {
    event.preventDefault();
    const shouldHaveShadow = window.scrollY > 0;
    setHasShadow(shouldHaveShadow);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: false });
    if (location?.pathname === "/") {
      setShowSearchBar(true);
    } else {
      setShowSearchBar(false);
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location]);

  const openFilterModal = () => {
    setFilterModalVisible(true);
  };

  const closeFilterModal = () => {
    setFilterModalVisible(false);
  };

  return (
    <header
      className={` fixed top-0 z-10 flex w-screen flex-col justify-around mb-4 bg-white p-2 ${hasShadow ? "shadow-md" : ""
        }`}
    >
      
      <div
        className={`
         flex p-2 ${showSearchBar ? "justify-around px-5" : "justify-between px-10"
          }  max-w-screen-2xl`}
      >
        <Link to="/" className="flex items-center gap-1">
          <img
            className="h-8 w-8 md:h-10 md:w-10"
            src="https://cdn-icons-png.flaticon.com/512/2111/2111320.png"
            alt="png"
          />
          <span className="hidden text-2xl font-bold text-red-500 md:block">
            Airbnb
          </span>
        </Link>

        {showSearchBar && <SearchBar />}

        <div
          className={`w-50 flex h-full items-center gap-2 rounded-full py-1 px-3 md:border shadow-sm ${isActive ? "border border-slate-200 shadow-md" : ""
            }`}
          onClick={() => setIsActive(!isActive)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="hidden h-6 w-6 md:block"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
          <div
            className={`z-10 h-[35px] w-[35px] overflow-hidden rounded-full cursor-pointer transition`}
          >
            {user ? (
              <Dropdown
                menu={{
                  items: LoginItems,
                }}
                placement="bottomRight"
                arrow={{
                  pointAtCenter: true,
                }}
                trigger={["click"]}
              >
                <Avatar>
                  {user?.picture ? (
                    <AvatarImage src={user.picture} className="h-full w-full" />
                  ) : (
                    <AvatarImage
                      src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      className="h-full w-full"
                    />
                  )}
                </Avatar>
              </Dropdown>
            ) : (
              <Dropdown
                menu={{
                  items: LogoutItems,
                }}
                placement="bottomRight"
                arrow={{
                  pointAtCenter: true,
                }}
              >
                <svg
                  fill="#858080"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="796 796 200 200"
                  enableBackground="new 796 796 200 200"
                  xmlSpace="preserve"
                  stroke="#858080"
                  className="h-8 w-8"
                >
                  <path d="..."></path>
                </svg>
              </Dropdown>
            )}
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      {showSearchBar && (
        <div className=" mt-2 flex flex-wrap w-full items-center justify-around px-10 py-4 border-b border-gray-200 bg-white max-w-screen-2xl">
          {/* Categories Section */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {categories.map((category) => (
              <div
                key={category.name}
                className={`flex flex-col items-center cursor-pointer ${activeCategory === category.name
                    ? "text-black font-semibold"
                    : "text-gray-500"
                  }`}
                onClick={() => setActiveCategory(category.name)}
              >
                <span className="text-lg sm:text-xl">{category.icon}</span>
                <span className="text-sm sm:text-base">{category.name}</span>
                {activeCategory === category.name && (
                  <div className="w-full h-[2px] bg-black mt-1"></div>
                )}
              </div>
            ))}
          </div>

          {/* Filters Section */}
          <div className="flex flex-wrap items-center gap-4 mt-4 sm:mt-0 sm:gap-6">
            <button
              className="flex items-center gap-2 border px-3 py-2 rounded-full text-gray-700 hover:shadow text-sm sm:text-base"
              onClick={openFilterModal}
            >
              <FaFilter size={20} />
              <span>Filters</span>
            </button>
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <span>Display total before taxes</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={toggleTaxes}
                  onChange={() => setToggleTaxes(!toggleTaxes)}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-black transition-all"></div>
                <div className="absolute w-5 h-5 bg-white rounded-full shadow left-0.5 top-0.5 peer-checked:left-6 transition-all"></div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      <Modal
        title="Filter Options"
        open={filterModalVisible}
        onCancel={closeFilterModal}
        footer={null}
      >
        <div className="flex flex-col gap-6">
          {/* Price Range */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Price Range</h3>
            <input
              type="range"
              min="0"
              max="1000"
              className="w-full"
              onChange={(e) => console.log(`Price: $${e.target.value}`)}
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>$0</span>
              <span>$1000+</span>
            </div>
          </div>

          {/* Property Type */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Property Type</h3>
            <select
              className="border rounded-md w-full px-3 py-2"
              onChange={(e) => console.log(`Selected Type: ${e.target.value}`)}
            >
              <option value="">Select</option>
              <option value="home">Home</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="cabin">Cabin</option>
            </select>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Amenities</h3>
            <div className="flex flex-wrap gap-4">
              {["Pool", "Wi-Fi", "Parking", "Pet Friendly"].map((amenity) => (
                <label key={amenity} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    onChange={() => console.log(`${amenity} toggled`)}
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>

          {/* Guests */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Guests</h3>
            <input
              type="number"
              className="border rounded-md w-full px-3 py-2"
              placeholder="Number of Guests"
              onChange={(e) => console.log(`Guests: ${e.target.value}`)}
            />
          </div>
        </div>
      </Modal>

    </header>
  );
};

export default Navbar;
