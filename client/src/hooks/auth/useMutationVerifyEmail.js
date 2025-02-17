import { notification } from "antd";
import { useMutation } from "@tanstack/react-query";
import { request } from "../../services/apiConnector";
import { authApis } from "../../services/api.urls";

const verifyEmail = async (email) => {
  const { data } = await request("POST", authApis.VERIFY_EMAIL_API, { email });
  return data.data;
};

const useVerifyEmail = () => {
  return useMutation({
    mutationKey: ["verifyEmail"],
    mutationFn: verifyEmail,
    staleTime: 1000 * 60 * 60 * 24, // Cache results for 24 hours
    onSuccess: (data) => {
      notification.success({
        message: "Verification email sent successfully!",
      });
      console.log("Success Response:", data);
    },
    onError: (error) => {
      notification.error({
        message:
          error.response?.data?.message || "Failed to send verification email.",
      });
    },
  });
};

export default useVerifyEmail;
