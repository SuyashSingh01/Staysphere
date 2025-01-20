import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth } from '../utility/Firebase';
import { useSelector, useDispatch } from 'react-redux';
import { setToken, setLoading, setUserData } from '../Redux/slices/AuthSlice';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Spinner from '../components/common/Spinner';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { loading ,user} = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();



  const handleFormData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const email = formData.email;
    const regex = /^[a-zA-Z0-9_.+\-]+[\x40][a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

    const isValid = regex.test(email);
    if (formData.password === undefined || formData.password !== undefined && formData.password.length < 6 || !isValid) {
      toast.error("Password  and Email  should be valid");
      return;
    }
    console.log("loginData:", formData);
    dispatch(setLoading(true));
    try {
      const response = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      console.log("Loginresponseresponse: ", response?.user);

      const userDetails = {
        name: response?.user?.name,
        email: formData.email,
        uid: response?.user?.uid,
    };
      dispatch(setToken(response?.user?.refreshToken));

      dispatch(setUserData(userDetails));
      setFormData({ email: "", password: "" });
      localStorage.setItem("token", JSON.stringify(response.user?.refreshToken));
      localStorage.setItem("user", JSON.stringify(userDetails));
      toast.success(`Login Success:${response.user.email}`);
      console.log('uid',user);
      navigate("/account");
      

      // clear the form data
    }
    catch (error) {
      toast.error("Couldn't Login\n", error.message);
      console.error("error", error.message);
    }
    dispatch(setLoading(false));
  }

  return (

    <div className="mt-4 flex grow items-center justify-around p-4 md:p-0">
      {loading ? (<Spinner />
      ) :
        (<div className="mb-40">
          <h1 className="mb-4 text-center text-4xl">Login</h1>
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
            <button className="primary my-4">Login</button>
          </form>

          <div className="mb-4 flex w-full items-center gap-4">
            <div className="h-0 w-1/2 border-[1px]"></div>
            <p className="small -mt-1">or</p>
            <div className="h-0 w-1/2 border-[1px]"></div>
          </div>
          <div className="py-2 text-center text-gray-500">
            Don't have an account yet?{' '}
            <Link className="text-black underline" to={'/register'}>
              Register now
            </Link>
          </div>
        </div>
        )}
    </div>
  );
}

export default Login