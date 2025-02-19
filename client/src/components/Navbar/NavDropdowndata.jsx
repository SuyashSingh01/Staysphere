import { SettingOutlined } from "@ant-design/icons";
import { FaHome } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiCartAdd } from "react-icons/bi";
import { HiOutlineLogout } from "react-icons/hi";
import { Link } from "react-router-dom";
import { LogOutHandler } from "./LogOutHandler.jsx";
import {
  BsHeart,
  BsListUl,
  BsPersonCircle,
  BsJournalPlus,
} from "react-icons/bs";

// Common Items (Available to Both User & Host)
const commonItems = [
  {
    key: "2",
    label: (
      <Link className="px-4" to="/">
        Home
      </Link>
    ),
    icon: <FaHome />,
  },
  {
    key: "3",
    label: (
      <Link className="px-4" to="/account">
        Profile
      </Link>
    ),
    icon: <BsPersonCircle />,
  },
  {
    key: "5",
    label: (
      <Link className="px-4" to="/account/liked-place">
        Favourites
      </Link>
    ),
    icon: <BsHeart />,
  },
  {
    key: "7",
    label: (
      <Link className="px-4" to="/account/bookings">
        My Bookings
      </Link>
    ),
    icon: <BiCartAdd />,
  },
  {
    key: "8",
    label: (
      <Link className="px-4" to="/account/notification">
        Notification
      </Link>
    ),
    icon: <IoMdNotificationsOutline />,
  },
  {
    key: "9",
    label: (
      <Link className="px-4" to="/account/setting">
        Settings
      </Link>
    ),
    icon: <SettingOutlined />,
  },
  {
    key: "10",
    label: <LogOutHandler className="px-4 flex items-center gap-2" />,
    icon: <HiOutlineLogout />,
  },
];

// Additional Items for Hosts
const hostItems = [
  {
    key: "4",
    label: (
      <Link className="px-4" to="/account/places">
        Manage Listings
      </Link>
    ),
    icon: <BsListUl />,
  },
  {
    key: "6",
    label: (
      <Link className="px-4" to="/account/places/new">
        Host Listings
      </Link>
    ),
    icon: <BsJournalPlus />,
  },
];

export const getMenuItems = (role) => {
  return role === "Host" ? [...hostItems, ...commonItems] : commonItems;
};

export const LogoutItems = [
  {
    key: "1",
    label: <Link to="/register">Signup</Link>,
  },
  {
    key: "2",
    label: <Link to="/login">Signin</Link>,
  },
];
