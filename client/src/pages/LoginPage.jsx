import React, { memo, useMemo, useState } from "react";
import { auth, googleProvider } from "../utility/Firebase";
import { useSelector, useDispatch } from "react-redux";
import { setToken, setLoading, setUserData } from "../Redux/slices/AuthSlice";
import { signInWithPopup } from "firebase/auth";
import { request } from "../services/apiConnector";
import { authApis } from "../services/api.urls.js";
import { Flex, notification } from "antd";
import { LoadingSpinner } from "../components/Wrapper/PageWrapper.jsx";
import { useNavigate, Link } from "react-router-dom";
// import { GoogleLogin } from "react-google-login";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { loading, user, token } = useSelector((state) => state.auth);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFormData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Your Firebase initialization file

  async function handleGoogleSignIn() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken(); // Firebase token

      // Send the token to your backend for verification
      const { data, success } = await request("POST", authApis.LOGIN_API, {
        firebaseToken: token,
      });

      if (data.success) {
        notification.success({
          message: data?.message + " " + data?.data?.user?.name,
          duration: 1,
        });
        console.log("Login/Signup successful:", data?.data.user);

        const userDetails = {
          name: data?.data?.user?.name,
          email: data?.data.user.email,
          id: data?.data.user?.uid || data?.data.user?._id,
          role: data?.data.user?.role || "User",
        };
        dispatch(setToken(data?.data?.token));
        dispatch(setUserData(userDetails));

        localStorage.setItem("token", JSON.stringify(data?.data?.token));
        localStorage.setItem("user", JSON.stringify(data?.data?.user._id));
        navigate("/account");
      } else {
        console.error("Error:", data?.message);
        notification.info({
          message: data?.message,
          duration: 1,
        });
      }
    } catch (error) {
      notification.error({
        message: "Google Sign-In failed" + error.message,
        duration: 1,
      });
      console.error("Google Sign-In failed:", error);
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const email = formData.email;
    const regex = /^[a-zA-Z0-9_.+\-]+[\x40][a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

    const isValid = regex.test(email);
    if (
      formData.password === undefined ||
      (formData.password !== undefined && formData.password.length < 6) ||
      !isValid
    ) {
      notification.error({
        message: "Invalid Email or Password",
        duration: 1,
      });
      return;
    }

    dispatch(setLoading(true));
    try {
      const { data } = await request("POST", authApis.LOGIN_API, {
        email: formData.email,
        password: formData.password,
        token,
      });
      console.log("loginDataResponse:", data);

      if (!data.success) {
        notification.error({
          message: data?.data?.message,
          duration: 1,
        });
        return;
      }

      const userDetails = {
        name: data.data?.user?.name,
        email: data?.data.user.email,
        id: data?.data.user?._id || data?.data.user?.uid,
        role: data?.data.user?.role || "User",
      };
      dispatch(setToken(data?.data?.token));
      dispatch(setUserData(userDetails));
      setFormData({ email: "", password: "" });
      console.log("uid", user);

      localStorage.setItem("token", JSON.stringify(data?.data?.token));
      localStorage.setItem("user", JSON.stringify(userDetails));
      notification.success({
        message: `Account Logged In: ${data?.data.user.name}`,
        duration: 1,
      });
      navigate("/account");

      // clear the form data
    } catch (e) {
      notification.error({
        message: "Login Failed: " + e.message,
        duration: 1,
      });
      console.error("error", e.message);
    }
    dispatch(setLoading(false));
  };

  return (
    <div className="mt-4 flex grow items-center justify-around p-4 md:p-0">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="mb-40">
          <h1 className="mb-4 text-center text-4xl">Staysphere Login </h1>
          <form className="mx-auto max-w-md" onSubmit={handleFormSubmit}>
            <input
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleFormData}
              // {...register("email", { required: true })}
            />
            <input
              name="password"
              type="password"
              placeholder="password"
              value={formData.password}
              onChange={handleFormData}
              // {...register("password", { required: true })}
            />
            <button className="primary my-4 text-xl">Login</button>
          </form>

          <Flex justify="space-around" align="center">
            <button
              type="button"
              className="my-6 rounded-[8px] bg-primary py-[6px] px-[12px]  text-white"
              onClick={handleGoogleSignIn}
            >
              Sign In with Google
            </button>
            <button
              type="button"
              className="my-6 rounded-[8px] bg-primary py-[6px] px-[12px]  text-white"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password
            </button>
          </Flex>
          <div className="mb-4 flex w-full items-center gap-4">
            <div className="h-0 w-1/2 border-[1px]"></div>
            <p className="small -mt-1">or</p>

            <div className="h-0 w-1/2 border-[1px]"></div>
          </div>
          <div className="py-2 text-center text-gray-500">
            Don't have an account yet?{" "}
            <Link className="text-black underline" to={"/register"}>
              Register now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Login);
