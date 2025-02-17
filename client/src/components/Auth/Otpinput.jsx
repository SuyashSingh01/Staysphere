import React, { useState, useRef, useEffect, useMemo } from "react";
import { Input, notification, Card, Flex } from "antd";
import useVerifyOtp from "../../hooks/auth/useMutatationVerifyOtp";
import { useLocation, useNavigate } from "react-router-dom";
import {
  setIsEmailVerified,
  setIsPhoneVerified,
} from "../../Redux/slices/ProfileSlice";
import { useDispatch } from "react-redux";
import { memo } from "react";
const OTPInput = ({ length = 6 }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const [isDisabled, setIsDisabled] = useState(true);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);
  const { mutate: verifyOtp, isLoading: isOtpLoading, data } = useVerifyOtp();
  const verifyOtpData = useMemo(() => data?.data, [data]);
  const { state } = useLocation();
  const email = state?.email;
  const phone = state?.phone;

  console.log("EMAIl", email, "phone", phone);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsDisabled(false);
    }
  }, [timer]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    if (otp.includes("")) {
      notification.error({ message: "Please enter Valid OTP" });
      return;
    }

    verifyOtp(
      {
        otp: otp.join(""),
        email: email,
        phone: phone,
      },
      {
        onSuccess: () => {
          console.log("OTP Verified Successfully");

          if (phone) {
            localStorage.setItem("isPhoneVerified", JSON.stringify(true));
            dispatch(setIsPhoneVerified(true));
          }
          if (email) {
            localStorage.setItem("isEmailVerified", JSON.stringify(true));
            console.log("OTP success");
            dispatch(setIsEmailVerified(true));
          }
          notification.success({ message: "OTP Verified Successfully!" });
          console.log("Navigation to profile settings");
          navigate("/account/profile/settings");
        },
        onError: (error) => {
          console.error("OTP verification error:", error);
          notification.error({
            message: error.message || "OTP Verification Failed",
          });
        },
      }
    );
  };

  return (
    <Card className="mt-10 flex flex-col items-center space-y-4 justify-center p-4 shadow-md max-w-md h-full mx-auto">
      <h2 className="text-5xl font-bold text-center text-orange-400">
        Enter OTP
      </h2>
      <div className="flex space-x-2 mt-10">
        {otp.map((digit, index) => (
          <Input
            key={index}
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputRefs.current[index] = el)}
            className="h-12 w-12 text-center text-lg font-semibold border border-gray-300 rounded-md focus:border-orange-500 focus:ring focus:ring-orange-200"
          />
        ))}
      </div>
      <Flex justify="center" align="center" className="space-x-4 mt-14">
        <button
          type="primary"
          className="my-6 rounded-[8px] bg-orange-500 focus:bg-orange-600 py-[6px] px-[12px]  text-white"
          onClick={handleSubmit}
        >
          Verify OTP
        </button>
        <button
          type="link"
          className={`my-6 rounded-[8px] bg-orange-500 focus:bg-orange-600 py-[6px] px-[12px] text-white ${
            isDisabled ? "cursor-not-allowed" : ""
          }`}
          onClick={() => {
            setOtp(new Array(length).fill(""));
            setTimer(60);
            setIsDisabled(true);
          }}
        >
          {isDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
        </button>
      </Flex>
    </Card>
  );
};

export default memo(OTPInput);
