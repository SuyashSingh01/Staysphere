import { notification } from "antd";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { Input, Button, Card } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneAndroidRoundedIcon from "@mui/icons-material/PhoneAndroidRounded";
import useVerifyEmail from "../../../hooks/auth/useMutationVerifyEmail";
import useVerifyPhone from "../../../hooks/auth/useMutationVerifyPhone";

const ProfileDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [role, setRole] = useState(user?.role ?? "User");
  const { isEmailVerified, isPhoneVerified } = useSelector(
    (state) => state.profile
  );
  console.log("Email Verified:", isEmailVerified);
  console.log("Phone Verified:", isPhoneVerified);
  const {
    mutate: verifyEmail,
    isLoading: isEmailLoading,
    isSuccess: isEmailSuccess,
  } = useVerifyEmail();

  const {
    mutate: verifyPhone,
    isLoading: isPhoneLoading,
    isSuccess: isPhoneSuccess,
  } = useVerifyPhone();

  const handleEmailVerification = () => {
    if (!email) {
      notification.error({
        message: "Email is required!",
        duration: 2,
        placement: "topRight",
      });
      return;
    }

    verifyEmail(email, {
      onSuccess: () => {
        navigate("/verify/otp", { state: { email } }); // Correct way to pass state
      },
    });
  };

  const handlePhoneVerification = () => {
    if (!phone) {
      notification.error({
        message: "Phone is required!",
        duration: 2,
        placement: "topRight",
      });
      return;
    }

    verifyPhone(phone, {
      onSuccess: () => {
        navigate("/verify/otp", { state: { phone } });
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
      className="p-6 max-w-3xl mx-auto"
    >
      <Card className="p-6 space-y-6 shadow-lg border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 backdrop-blur-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Profile Settings
        </h2>
        <div className="space-y-5">
          {/* Email Section */}
          <div className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg shadow-md">
            <EmailRoundedIcon className="text-blue-500" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 bg-transparent border-none focus:ring-0"
            />
            {!isEmailVerified && (
              <Button
                size="sm"
                onClick={handleEmailVerification}
                variant="solid"
              >
                {isEmailLoading ? "Verifying..." : "Verify"}
              </Button>
            )}
            {isEmailVerified && (
              <span className="text-green-500">Verified</span>
            )}
          </div>

          {/* Phone Section */}
          <div className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg shadow-md">
            <PhoneAndroidRoundedIcon className="text-green-500" />
            <Input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="flex-1 bg-transparent border-none focus:ring-0"
            />
            {!isPhoneVerified && (
              <Button
                size="sm"
                onClick={handlePhoneVerification}
                variant="solid"
              >
                {isPhoneLoading ? "Verifying..." : "Verify"}
              </Button>
            )}
            {isPhoneVerified && (
              <span className="text-green-500">Verified</span>
            )}
          </div>

          {/* Role Selection */}
          <div className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg shadow-md">
            <label className="font-medium text-gray-700 dark:text-gray-300">
              Role:
            </label>
            <select
              className="border p-2 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring focus:ring-blue-300"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Guest">Guest</option>
              <option value="Host">Host</option>
            </select>
          </div>

          {/* Save Button */}
          <Button
            fullWidth
            size="lg"
            variant="soft"
            className="bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md"
            onClick={() => alert("Profile Updated!")}
          >
            Save Changes
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProfileDetails;
