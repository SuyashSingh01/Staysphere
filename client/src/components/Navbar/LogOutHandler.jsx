import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../Redux/slices/AuthSlice";
import { useNavigate, Link } from "react-router-dom";
import { notification } from "antd";

export const LogOutHandler = ({ className }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    notification.success({
      message: "Logout Successful",
      duration: 1,
      placement: "topRight",
    });
    navigate("/login");
  };

  return (
    <Link onClick={handleLogout} className={className}>
      Logout
    </Link>
  );
};
