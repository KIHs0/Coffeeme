/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { FaUser, FaKey, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { loginThunk, getProfilethunk, getotheruser } from "../../store2/user/user.thunk.js";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [loginData, setlogindata] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loginBTN = () => {
    setIsLoading(true);
    (async () => {
      try {
        const res = await dispatch(loginThunk(loginData));
        if (res?.payload) {
          await Promise.all([
            dispatch(getProfilethunk()),
            dispatch(getotheruser())
          ]);
          toast.success("Login successful!");
          navigate('/');
        }
      } catch (error) {
        toast.error("Login failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    })();
  };

  const inputHandler = (e) => {
    setlogindata((prevval) => ({
      ...prevval,
      [e.target.name]: e.target.value,
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      loginBTN();
    }
  };

  return (
    <div className="flex justify-center  items-center min-h-screen  p-10 md:p-0">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white text-center">
          <div className="flex justify-center mb-4">
            <FaLock className="text-3xl" />
          </div>
          <h1 className="text-2xl font-bold">Welcome Back!</h1>
          <p className="opacity-90">Please login to your account</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                name="username"
                className="w-full pl-10 pr-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Username"
                onChange={inputHandler}
                onKeyDown={handleKeyPress}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaKey className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full pl-10 pr-12 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                onChange={inputHandler}
                onKeyPress={handleKeyPress}
              />
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                ) : (
                  <FaEye className="text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* <div className="flex justify-between items-center">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-indigo-600 hover:underline">
              Forgot password?
            </Link>
          </div> */}

          <button
            className={`w-full btn btn-primary py-3 px-4 rounded-lg font-medium transition-all ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg'}`}
            onClick={loginBTN}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : 'LOGIN'}
          </button>

          <div className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-600 font-medium hover:underline">
              Sign up
            </Link>
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-4 text-center">
          <p className="text-xs text-gray-500">
            By logging in, you agree to our <a href="#" className="text-indigo-600 hover:underline">Terms</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;