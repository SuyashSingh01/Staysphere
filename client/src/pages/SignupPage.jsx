import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { setUserData, setLoading, setToken } from "../Redux/slices/AuthSlice";
import Spinner from "../components/common/Spinner";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../utility/Firebase";
import { FormControl, MenuItem } from "@mui/joy";
import { message, Select } from "antd";
import { notification } from "antd";
import { request } from "../services/apiConnector";
import { authApis } from "../services/api.urls";

const SignupPage = () => {
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: "User",
    },
  });

  async function handleGoogleSignIn() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();

      const { data } = await request("POST", authApis.REGISTER_API, {
        firebaseToken: token,
        user: result.user,
      });
      if (data.success) {
        console.log("datta", data);
        dispatch(setToken(data.token));
        dispatch(setUserData(data.user));
        notification.success({
          message: "Google Sign-In successful",
          duration: 1,
        });
        navigate("/account");
      } else {
        notification.warning({
          message: "Google Sign-In failed: " + data?.data?.message,
          duration: 1,
        });
      }
    } catch (e) {
      console.log(e.response.data.message);
      notification.error({
        message: e.response?.data.message || e.message || "Unknown Error",
        duration: 1,
      });
    }
  }

  const handleFormSubmit = async (formData) => {
    dispatch(setLoading(true));
    console.log(formData);

    if (formData.password !== formData.confirmpassword) {
      notification.error({
        message: "Password and Confirm Password do not match",
        duration: 1,
      });
      dispatch(setLoading(false));
      return;
    }

    try {
      const result = await request("POST", authApis.REGISTER_API, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      console.log(result);

      const userDetails = {
        name: formData.name,
        email: formData.email,
        id: result?.data?.data._id,
        role: formData.role,
      };

      dispatch(setToken(result?.data?.data?.token));
      dispatch(setUserData(userDetails));

      localStorage.setItem("token", JSON.stringify(result?.data?.data?.token));
      localStorage.setItem("user", JSON.stringify(userDetails));

      notification.success({
        message: `Account Created: ${result.email}`,
        duration: 1,
      });

      reset();
      navigate("/account");
    } catch (error) {
      notification.error({
        message:
          "Couldn't create account: " + (error?.message || "Unknown Error"),
        duration: 1,
        placement: "topRight",
      });
    }

    dispatch(setLoading(false));
  };

  return (
    <div className="mt-4 flex grow items-center justify-around p-4 md:p-0">
      {loading ? (
        <Spinner />
      ) : (
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <div className="mb-40 w-full">
            <h1 className="mb-4 text-center text-4xl text-orange-700 ">
              Register
            </h1>
            <form
              className="mx-auto max-w-md"
              onSubmit={handleSubmit(handleFormSubmit)}
            >
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-800">{errors.name.message}</p>
              )}

              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-800">{errors.email.message}</p>
              )}

              <input
                id="password"
                type="password"
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-red-800">{errors.password.message}</p>
              )}

              <input
                id="confirmpassword"
                type="password"
                placeholder="Confirm Password"
                {...register("confirmpassword", {
                  required: "Confirm Password is required",
                })}
              />
              {errors.confirmpassword && (
                <p className="text-red-800">{errors.confirmpassword.message}</p>
              )}

              <FormControl>
                <Controller
                  name="role"
                  control={control}
                  rules={{ required: "Role is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      defaultValue="user"
                      onChange={(value) => setValue("role", value)}
                      style={{ width: "100%", height: "40px" }}
                    >
                      <Option value="Admin">Admin</Option>
                      <Option value="User">User</Option>
                      <Option value="Host">Host</Option>
                    </Select>
                  )}
                />
                {errors.role && (
                  <p className="text-red-800">{errors.role.message}</p>
                )}
              </FormControl>

              <button
                className="w-full bg-orange-400 focus:ring-orange-700 active:bg-orange-500 focus:bg-orange-600 transition-shadow my-4 text-xl p-2 rounded-[8px] text-white"
                type="submit"
                disabled={loading}
              >
                Register
              </button>
            </form>

            <div className="mb-4 flex w-full items-center gap-4">
              <div className="h-0 w-1/2 border-[1px]"></div>
              <p className="small -mt-1">or</p>
              <div className="h-0 w-1/2 border-[1px]"></div>
            </div>

            <button
              className="mt-6 rounded-[8px] bg-orange-400 focus:ring-orange-700 active:bg-orange-500 focus:bg-orange-600 transition-shadow py-[8px] px-[12px] font-medium text-white"
              onClick={handleGoogleSignIn}
            >
              Sign Up with Google
            </button>

            <div className="py-2 text-center text-gray-500">
              Already a member?{" "}
              <Link className="text-black underline" to={"/login"}>
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupPage;
