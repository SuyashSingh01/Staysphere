import React, { useState, useEffect, memo } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./Navbar/Navbar.jsx";
import Footer from "./Footer/Footer.jsx";
import logo from "../assets/logo.svg";
import Header from "./Navbar/Header/Header.jsx";

import search_icon from "../assets/icons/search-icon-2.svg";
import search_icon_red from "../assets/icons/search-icon-2-red.svg";
import heart_icon from "../assets/icons/heart-icon-2.svg";
import heart_icon_red from "../assets/icons/heart-icon-2-red.svg";
import user_icon from "../assets/icons/user-icon.svg";
import user_icon_red from "../assets/icons/user-icon-red.svg";
import airbnb_icon from "../assets/logos/stayspherelogo2.png";
import airbnb_icon_red from "../assets/logos/stayspherelogo2.png";
import message_icon from "../assets/icons/message-icon.svg";
import message_icon_red from "../assets/icons/message-icon-red.svg";

const Layout = () => {
  const [selectedButton, setSelectedButton] = useState("Explore");
  const navigate = useNavigate();
  const path = useLocation();
  const currentUser = useSelector((state) => state.auth.user);
  useEffect(() => {
    if (path.pathname === "/") {
      setSelectedButton("Explore");
    }
    if (path.pathname === "/wishlist") {
      setSelectedButton("Wishlists");
    }
    if (path.pathname === "/login") {
      setSelectedButton("Log in");
    }
    if (path.pathname === "/profile") {
      setSelectedButton("Profile");
    }
    if (path.pathname === "/trips") {
      setSelectedButton("Trips");
    }
    if (path.pathname === "/messages") {
      setSelectedButton("Messages");
    }
  }, [path]);
  return (
    <>
      {/* <Header /> */}
      <Navbar />
      <div className="mx-auto flex min-h-screen max-w-screen-xl flex-col mt-20 ">
        <Outlet />
      </div>
      <Footer />

      {/* Mobile Navigation */}
      <div
        className={` block sm:hidden fixed bottom-0 w-full h-16 bg-white z-20  items-center justify-center`}
      >
        <div
          className={`${
            currentUser
              ? "flex justify-between w-full px-6"
              : "flex gap-[50px] bg-white"
          }`}
        >
          {/* Eplore Button */}
          <button
            onClick={() => {
              setSelectedButton("Explore");
              navigate("/");
            }}
            className={` bg-white flex flex-col items-center gap-1 ${
              selectedButton === "Explore" ? "opacity-100" : "opacity-60"
            }`}
          >
            <img
              className={`w-6 h-6`}
              src={selectedButton === "Explore" ? search_icon_red : search_icon}
              alt="search icon"
            />
            <span
              className={`text-[10px] font-semibold ${
                selectedButton === "Explore" ? "text-[#E81948]" : ""
              }`}
            >
              Explore
            </span>
          </button>
          {/* Wishlists Button */}
          <button
            onClick={() => {
              setSelectedButton("Wishlists");
              navigate("/wishlist");
            }}
            className={`  bg-white${
              currentUser ? "" : "hidden"
            } flex flex-col items-center gap-1 ${
              selectedButton === "Wishlists" ? "opacity-100" : "opacity-60"
            }`}
          >
            <img
              className={`w-6 h-6`}
              src={selectedButton === "Wishlists" ? heart_icon_red : heart_icon}
              alt="heart icon"
            />
            <span
              className={`text-[10px] font-semibold ${
                selectedButton === "Wishlists" ? "text-[#E81948]" : ""
              }`}
            >
              Wishlists
            </span>
          </button>
          {/* Trips Button */}
          <button
            onClick={() => {
              setSelectedButton("Trips");
              navigate("/bookings");
            }}
            className={`  bg-white${
              currentUser ? "" : "hidden"
            } flex flex-col items-center gap-1 ${
              selectedButton === "Trips" ? "opacity-100" : "opacity-60"
            }`}
          >
            <img
              className={`w-10 h-14`}
              src={selectedButton === "Trips" ? airbnb_icon_red : airbnb_icon}
              alt="heart icon"
            />
            <span
              className={`text-[10px] font-semibold ${
                selectedButton === "Trips" ? "text-[#E81948]" : ""
              }`}
            >
              Trips
            </span>
          </button>
          {/* Messages Button */}
          <button
            onClick={() => {
              setSelectedButton("Messages");
              navigate("/messages");
            }}
            className={`bg-white ${
              currentUser ? "" : "hidden"
            } flex flex-col items-center gap-1 ${
              selectedButton === "Messages" ? "opacity-100" : "opacity-60"
            }`}
          >
            <img
              className={`w-6 h-6`}
              src={
                selectedButton === "Messages" ? message_icon_red : message_icon
              }
              alt="heart icon"
            />
            <span
              className={`text-[10px] font-semibold ${
                selectedButton === "Messages" ? "text-[#E81948]" : ""
              }`}
            >
              Messages
            </span>
          </button>
          {/* Log in Button */}
          <button
            onClick={() => {
              setSelectedButton("Log in");
              navigate("/login");
            }}
            className={`bg-white ${
              currentUser ? "hidden" : ""
            } flex flex-col items-center gap-1 ${
              selectedButton === "Log in" ? "opacity-100" : "opacity-60"
            }`}
          >
            <img
              className={`w-6 h-6`}
              src={selectedButton === "Log in" ? user_icon_red : user_icon}
              alt="user icon"
            />
            <span
              className={`text-[10px] font-semibold ${
                selectedButton === "Log in" ? "text-[#E81948]" : ""
              }`}
            >
              Log in
            </span>
          </button>
          {/* Profile Button */}
          <button
            onClick={() => {
              setSelectedButton("Profile");
              navigate("/account");
            }}
            className={`bg-white ${
              currentUser ? "" : "hidden"
            } flex flex-col items-center gap-1 ${
              selectedButton === "Profile" ? "opacity-100" : "opacity-60"
            }`}
          >
            <img
              className={`w-6 h-6`}
              src={selectedButton === "Profile" ? user_icon_red : user_icon}
              alt="user icon"
            />
            <span
              className={`text-[10px] font-semibold ${
                selectedButton === "Profile" ? "text-[#E81948]" : ""
              }`}
            >
              Profile
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default memo(Layout);
