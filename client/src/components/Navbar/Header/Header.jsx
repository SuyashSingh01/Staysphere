import world_icon from "../../../assets/icons/world-icon.svg";
import menu_icon from "../../../assets/icons/menu-icon.svg";
import user_icon from "../../../assets/icons/user-icon-2.svg";
import { useLocation, useNavigate } from "react-router-dom";
import stayspherelogo from "../../../assets/logos/stayspherelogo2.png";
// import stayspherelogo from "../../../assets/logos/stayspherelogo2.png";
import Navbar from "../Navbar.jsx";
import { useSelector } from "react-redux";

import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar.jsx";
import { toast } from "react-toastify";

function Header() {
  const path = useLocation();
  const [isSignUpOpen, setSignUpOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const currentUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      toast.success("Logout successful!");
    } catch (error) {
      console.error(error);
      toast.error("Error in log out");
    }
  }
  return (
    <>
      <header
        className={`bg-white ${
          path.pathname.startsWith("/place/")
            ? "xl:px-[160px] sm:px-10 hidden sm:block"
            : "sm:px-10 xl:px-[80px] px-6 sticky top-0 z-20"
        }`}
      >
        {/* Desktop Header */}
        <div
          className={`sm:flex hidden sm:justify-between  py-4 border-b-[1px]`}
        >
          {/* logo */}
          <div className="lg:w-[22%] flex items-center">
            <img
              className="h-8 hidden xl:block"
              src={stayspherelogo}
              alt="air bnb logo"
            />
            <img
              className="h-10 block xl:hidden"
              src={stayspherelogo}
              alt="air bnb logo"
            />
          </div>
          {/* Search Bar */}
          <div
            className={` ${
              path.pathname === "/wishlist"
                ? "hidden"
                : "flex items-center justify-center"
            }`}
          >
            <SearchBar device="desktop" />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1 relative">
            <button className="hover:bg-gray-100 font-semibold px-3 py-2 rounded-full text-sm">
              Airbnb your home
            </button>
            <button className="p-3 hover:bg-gray-100 rounded-full">
              <img className="w-4 h-4" src={world_icon} alt="" />
            </button>
            {/* Menu Button */}
            <button
              onClick={() => setMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 border border-gray-300 rounded-full p-2 hover:shadow-md cursor-pointer"
            >
              <div className="px-2">
                <img className="w-4 h-4" src={menu_icon} alt="menu icon" />
              </div>
              <div
                className={`${
                  currentUser && "bg-gray-700"
                } flex items-center justify-center text-white w-8 h-8 text-xs rounded-full`}
              >
                {currentUser && currentUser.username.slice(0, 1)}
                {!currentUser && (
                  <img
                    src={user_icon}
                    className="w-full opacity-60"
                    alt="user_icon"
                  />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Header */}
        <div
          className={`${
            path.pathname === "/" ? "" : "hidden"
          } sm:hidden flex pt-3 mb-4`}
        >
          <SearchBar device="mobile" />
        </div>

        {/* Navbar */}
        <div className={` ${path.pathname === "/" ? "" : "hidden"}`}>
          <Navbar />
        </div>
      </header>
    </>
  );
}
export default Header;
