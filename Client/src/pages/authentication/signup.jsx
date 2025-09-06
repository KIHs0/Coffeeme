/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { FaUser, FaKey, FaLock } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { signupThunk } from "../../store2/user/user.thunk";
const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [signup, setsignup] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "male",
  });

  const handleRegister = async () => {
    const res = await dispatch(signupThunk(signup));
    if (res?.payload) {
      navigate("/");
    }
  };

  const inputHandler = (e) => {
    setsignup((pv) => ({
      ...pv,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <div className="flex justify-center items-center   min-h-screen  p-6 ">
      <div className="max-w-[30rem] items-center bordergradient   bg-base-200 flex flex-col  gap-5  p-6  rounded-lg w-full">
        <label className="flex items-center gap-2 ">
          <FaLock />
          <p className="text-1xl">SignUp !!!</p>
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <FaUser />
          <input
            type="text"
            placeholder="Full_Name"
            name="fullName"
            onChange={(e) => {
              inputHandler(e);
            }}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <FaUser />
          <input
            type="text"
            className="grow"
            name="username"
            placeholder="Username"
            onChange={(e) => {
              inputHandler(e);
            }}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <FaKey />
          <input
            type="password"
            placeholder="Password"
            className="grow"
            name="password"
            onChange={(e) => {
              inputHandler(e);
            }}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <FaKey />
          <input
            type="password"
            placeholder="Confirm_Password"
            className="grow"
            name="confirmPassword"
            onChange={(e) => {
              inputHandler(e);
            }}
          />
        </label>
        <button
          onClick={() => handleRegister()}
          className="btn btn-active btn-primary"
        >
          SIGN_UP
        </button>
        <p>
          Already have an Account ?
          <Link to="/login" className="text-blue-400 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
