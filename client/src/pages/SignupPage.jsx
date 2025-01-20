
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link,useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { setUserData, setLoading, setToken } from '../Redux/slices/AuthSlice';
import Spinner from '../components/common/Spinner';
import {createUserWithEmailAndPassword} from 'firebase/auth'; 
import { auth } from '../utility/Firebase';
const SignupPage = () => {

    const { loading,token,user } = useSelector((state) => state.auth);
    const { register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitSuccessful },
    } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleFormSubmit = async (formData) => {
        console.log("signupformdata", formData);
        dispatch(setLoading(true));
        if(formData.password !== undefined && formData.password !== formData.confirmpassword){
            toast.error("Password and Confirm Password should be same");
            return ;
        }
        // backend call to handle form data
        try{
            const result=await createUserWithEmailAndPassword(auth, formData.email, formData.password);
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
            console.log('uid',user?.uid);
            navigate("/account");
          }
          catch(error){
              console.log("error",error);
              toast.error("Couldn't create\n",error.message);
      
          }
        dispatch(setLoading(false));
    }
    return (
        <div className="mt-4 flex grow items-center justify-around p-4 md:p-0">
            {loading ? (<Spinner />) : (
                <div className="mb-40">
                    <h1 className="mb-4 text-center text-4xl">Register</h1>
                    <form className="mx-auto max-w-md" onSubmit={handleSubmit(handleFormSubmit)}>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            {...register("name", { required: true })}
                        />
                        <input
                            id='email'
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            {...register("email", { required: true })}
                        />
                        <input
                            id='password'
                            name="password"
                            type="password"
                            placeholder="password"
                            {...register("password", { required: true })}
                        />
                        <input
                            id='confirmpassword'
                            name="confirmPassword"
                            type="password"
                            placeholder="confirm password"
                            {...register("confirmpassword", { required: true })}
                        />
                        <button className="primary my-2" disabled={loading}>Register</button>
                    </form>

                    <div className="mb-4 flex w-full items-center gap-4">
                        <div className="h-0 w-1/2 border-[1px]"></div>
                        <p className="small -mt-1">or</p>
                        <div className="h-0 w-1/2 border-[1px]"></div>
                    </div>
                    <div className="py-2 text-center text-gray-500">
                        Already a member?
                        <Link className="text-black underline" to={'/login'}>
                            Login
                        </Link>
                    </div>
                </div>)}
        </div>

    );
};
export default SignupPage;
