import { useMutation } from "@tanstack/react-query";
import { request } from "../../services/apiConnector";
import { authApis } from "../../services/api.urls";
import { useSelector } from "react-redux";

const verifyOtp = async ({ otp, email, phone, token }) => {
  // console.log("submitOtp:", otp, "email:", email, "phone:", phone);
  if (!email && !phone) {
    throw new Error("Either email or phone must be provided");
  }
  console.log("Token:", token);
  const OtpEndpoint = email
    ? authApis.VERIFY_EMAIL_OTP_API
    : authApis.VERIFY_PHONE_OTP_API;

  const { data } = await request(
    "POST",
    OtpEndpoint,
    { otp, email, phone },

    {
      Authorization: `Bearer ${token}`,
    }
  );
  return data;
};

const useVerifyOtp = () => {
  return useMutation({
    mutationKey: ["verifyOtp"],
    mutationFn: verifyOtp,
  });
};

export default useVerifyOtp;
