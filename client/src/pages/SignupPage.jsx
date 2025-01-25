import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { setUserData, setLoading, setToken } from "../Redux/slices/AuthSlice";
import Spinner from "../components/common/Spinner";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../utility/Firebase";
// import { GoogleLogin } from "react-google-login";

const SignupPage = () => {
  const { loading, token, user } = useSelector((state) => state.auth);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleGoogleSignIn() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken(); // Firebase token
      console.log("googletoken", token);
      console.log("googlesignupresponse", result.user);
      // dispatch(setToken(token));
      // Send the token to your backend for verification
      const response = await fetch("http://localhost:4000/api/v1/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firebaseToken: token, user: result.user }),
      });

      const data = await response.json();
      if (data.success) {
        console.log("Signup successful:", data.user);
        dispatch(setToken(data.token));
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Google Sign-In failed:", error);
    }
  }

  //   const handleLoginSuccess = async (response) => {
  //     console.log("Google signup Success:", response);
  //     const { tokenId } = response;
  //     await fetch("http://localhost:4000/register", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ tokenId }),
  //     });
  //   };

  //   const handleLoginFailure = (error) => {
  //     console.error("Google signup Failed:", error);
  //   };

  const handleFormSubmit = async (formData) => {
    console.log("signupformdata", formData);
    dispatch(setLoading(true));
    if (
      formData.password !== undefined &&
      formData.password !== formData.confirmpassword
    ) {
      toast.error("Password and Confirm Password should be same");
      return;
    }
    // backend call to handle form data
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      console.log("signupformResult", result);
      const userDetails = {
        name: formData.name,
        email: formData.email,
        uid: result?.user?.uid,
      };
      dispatch(setToken(result?.user?.accessToken));
      dispatch(setUserData(userDetails));

      localStorage.setItem("token", JSON.stringify(result?.user?.accessToken));
      localStorage.setItem("user", JSON.stringify(userDetails));
      if (isSubmitSuccessful) reset();
      toast.success(`Account Created ${result.user.email}`);
      console.log("uid", user?.uid);
      navigate("/account");
    } catch (error) {
      console.log("error", error);
      toast.error("Couldn't create\n", error.message);
    }
    dispatch(setLoading(false));
  };
  return (
    <div className="mt-4 flex grow items-center justify-around p-4 md:p-0">
      {loading ? (
        <Spinner />
      ) : (
        <div className="mb-40">
          <h1 className="mb-4 text-center text-4xl">Register</h1>
          <form
            className="mx-auto max-w-md"
            onSubmit={handleSubmit(handleFormSubmit)}
          >
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              {...register("name", { required: true })}
            />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              {...register("email", { required: true })}
            />
            <input
              id="password"
              name="password"
              type="password"
              placeholder="password"
              {...register("password", { required: true })}
            />
            <input
              id="confirmpassword"
              name="confirmPassword"
              type="password"
              placeholder="confirm password"
              {...register("confirmpassword", { required: true })}
            />
            <button className="primary my-2" disabled={loading}>
              Register
            </button>
          </form>

          <div className="mb-4 flex w-full items-center gap-4">
            <div className="h-0 w-1/2 border-[1px]"></div>
            <p className="small -mt-1">or</p>
            <div className="h-0 w-1/2 border-[1px]"></div>
          </div>
          <button
            className="mt-6 rounded-[8px] bg-primary py-[8px] px-[12px] font-medium text-white"
            onClick={handleGoogleSignIn}
          >
            SignUp with Google
          </button>
          {/* <GoogleLogin
            clientId={clientId}
            buttonText="Login with Google"
            onSuccess={handleLoginSuccess}
            onFailure={handleLoginFailure}
            cookiePolicy={"single_host_origin"}
          /> */}
          <div className="py-2 text-center text-gray-500">
            Already a member?
            <Link className="text-black underline" to={"/login"}>
              Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
export default SignupPage;
