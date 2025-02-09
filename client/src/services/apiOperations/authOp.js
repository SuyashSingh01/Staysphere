import { toast } from "react-toastify";
import { request } from "../apiConnector";
import { authApis } from "../api.urls";
import { setLoading } from "../../Redux/slices/AuthSlice";
import { notification } from "antd";
// import endpoints

const { RESETPASSTOKEN_API, RESETPASSWORD_API } = authApis;
export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await request("POST", RESETPASSTOKEN_API, {
        email,
      });

      console.log("RESET PASSWORD TOKEN RESPONSE....", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      notification.success({
        message: "Reset Email Sent",
        duration: 1,
      });
      // toast.success("Reset Email Sent");
      setEmailSent(true);
    } catch (error) {
      console.log("RESET PASSWORD TOKEN Error", error);
      toast.error("Failed to send email for resetting password");
    }
    dispatch(setLoading(false));
  };
}
export function resetPassword(password, confirmPassword, token, navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await request("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      });

      console.log("RESET Password RESPONSE ... ", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      notification.success({
        message: "Password has been reset successfully",
        duration: 1,
      });
      navigate("/login");
      // toast.success("Password has been reset successfully");
    } catch (error) {
      console.log("RESET PASSWORD TOKEN Error", error);
      // toast.error("Unable to reset password");
      notification.error({
        message: "Unable to reset password",
        duration: 1,
      });
    }
    dispatch(setLoading(false));
  };
}
