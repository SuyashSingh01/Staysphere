import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useSelector } from "react-redux";
import { Dropdown, Modal } from "antd";
import { LoginItems, LogoutItems } from "./NavDropdowndata.jsx";
import SearchBar from "../common/SearchBar";
import logo from "../../assets/logos/stayspherelogo2.png";

import CatNavbar from "./CatNavbar.jsx";

const Navbar = () => {
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [hasShadow, setHasShadow] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Historical homes");
  const [toggleTaxes, setToggleTaxes] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);

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
      className={` fixed top-0 z-10 flex w-screen flex-col justify-around mb-4 bg-white p-2 ${
        hasShadow ? "shadow-md" : ""
      }`}
    >
      <div
        className={`
         flex p-2 ${
           showSearchBar ? "justify-around px-5" : "justify-between px-10"
         }  max-w-screen-2xl`}
      >
        <Link
          to="/"
          className="flex items-center gap-1 justify-center h-[50px] "
        >
          <img
            className="h-[80px] rounded-full  md:h-[100px] rounded-s mt-2"
            src={logo}
            alt="png"
          />
          {/* <span className="hidden text-2xl text-center font-bold text-orange-600 md:block">
            Staysphere
          </span> */}
        </Link>

        {showSearchBar && <SearchBar />}

        <div
          className={`w-50 flex h-full items-center gap-2 rounded-full py-1 px-3 md:border shadow-sm ${
            isActive ? "border border-slate-200 shadow-md" : ""
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
        <div className="w-full">
          {/* Categories Section */}
          <CatNavbar
            openFilterModal={openFilterModal}
            closeFilterModal={closeFilterModal}
            toggleTaxes={toggleTaxes}
            setToggleTaxes={setToggleTaxes}
          />
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
