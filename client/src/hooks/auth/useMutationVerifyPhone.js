import { notification } from "antd";
import { useMutation } from "@tanstack/react-query";
import { request } from "../../services/apiConnector";
import { authApis } from "../../services/api.urls";

const verifyPhone = async (phone) => {
  const { data } = await request("POST", authApis.VERIFY_PHONE_API, { phone });
  return data;
};

const useVerifyPhone = () => {
  return useMutation({
    mutationKey: ["verifyPhone"],
    mutationFn: verifyPhone,
    onSuccess: (data) => {
      notification.success({
        message: "Verification Otp sent successfully on your phone!",
      });
      console.log("Success Response:", data);
    },
    onError: (error) => {
      notification.error({
        message:
          error.response?.data?.message ||
          "Failed to send verification Otp at Phone.",
      });
    },
  });
};

export default useVerifyPhone;
