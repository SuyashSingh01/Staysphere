import {
  UserOutlined,
  HomeOutlined,
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  WalletOutlined,
  SettingOutlined,
  CalendarOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const getItem = (label, key, icon, path, children) => ({
  key,
  icon,
  label: <Link to={path}>{label}</Link>,
  children,
});

// **User Navigation**
export const sideBarItemsUser = [
  getItem("Dashboard", "1", <PieChartOutlined />, "/account"),
  getItem("Explore Stays", "2", <HomeOutlined />, "/"),
  getItem("My Booking", "3", <CalendarOutlined />, "/account/bookings"),
  getItem("Profile", "4", <UserOutlined />, null, [
    getItem("Favourite Places", "5", null, "/account/liked-place"),
    getItem("Porfile Edit", "6", null, "profile/settings"),
  ]),
  getItem("Transactions", "5", <WalletOutlined />, "transactions"),
  getItem("Support", "6", <FileOutlined />, "contact-support"),
  getItem("Settings", "7", <SettingOutlined />, null, [
    getItem("Change Password", "8", null, "settings/change-password"),
    getItem("Notification Preferences", "9", null, "settings/notifications"),
  ]),
];

// **Host Navigation**
export const sideBarItemsHost = [
  getItem("Dashboard", "1", <PieChartOutlined />, "/account"),
  getItem("Manage Listings", "2", <DesktopOutlined />, null, [
    getItem("My Hostings", "3", null, "/account/places"),
    getItem("Booking Request", "4", null, "/account/hosted/bookings"),
    getItem("Add New Listing", "3", null, "places/new"),
  ]),
  getItem("My Booking", "3", <CalendarOutlined />, "/account/bookings"),
  getItem("Earnings", "4", <WalletOutlined />, "host/earnings"),

  getItem("Profile", "6", <UserOutlined />, null, [
    getItem("Favourite Places", "5", null, "/account/liked-place"),
    getItem("Profile Setting", "5", null, "/account/profile/settings"),
  ]),
  getItem("Transactions", "5", <WalletOutlined />, "/account/transactions"),
  getItem("Settings", "7", <SettingOutlined />, null, [
    getItem("Change Password", "8", null, "settings/change-password"),
    getItem("Payout Preferences", "9", null, "/settings/payouts"),
    getItem("Payout Settings", "10", null, "/account/host/setting"),
  ]),
  getItem("Support", "10", <FileOutlined />, "contact-support"),
];
