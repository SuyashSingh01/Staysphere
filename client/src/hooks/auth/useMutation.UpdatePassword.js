import { notification } from "antd";
import { useMutation } from "@tanstack/react-query";
import { request } from "../../services/apiConnector";
import { authApis } from "../../services/api.urls";

const updatePassword = async ({
  oldPassword,
  newPassword,
  confirmPassword,
  token,
}) => {
  const { data } = await request(
    "POST",
    authApis.CHANGE_PASSWORD_API,
    {
      oldPassword,
      newPassword,
      confirmPassword,
    },
    {
      Authorization: `Bearer ${token}`,
    }
  );
  return data.data;
};

const useUpdatePassword = () => {
  return useMutation({
    mutationKey: ["updatePassword"],
    mutationFn: updatePassword,
    onSuccess: (data) => {
      notification.success({
        message: "Passwored Updated successfully!",
      });
      console.log("Success Response:", data);
    },
    onError: (error) => {
      notification.error({
        message: error.response?.data?.message || "Failed to Update Password.",
      });
    },
  });
};

export default useUpdatePassword;
