import { useMutation } from "@tanstack/react-query";
import { request } from "../../services/apiConnector";
import { authApis } from "../../services/api.urls";

const verifyOtp = async ({ otp, email, phone }) => {
  console.log("submitOtp:", otp, "email:", email, "phone:", phone);
  if (!email && !phone) {
    throw new Error("Either email or phone must be provided");
  }

  const OtpEndpoint = email
    ? authApis.VERIFY_EMAIL_OTP_API
    : authApis.VERIFY_PHONE_OTP_API;

  const { data } = await request("POST", OtpEndpoint, { otp, email, phone });
  return data;
};

const useVerifyOtp = () => {
  return useMutation({
    mutationKey: ["verifyOtp"],
    mutationFn: verifyOtp,
  });
};

export default useVerifyOtp;
