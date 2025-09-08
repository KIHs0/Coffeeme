import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { axiosInstance } from "../../utils/axiosInstance.js";
import axios from "axios";
import { Navigate } from "react-router";
export const loginThunk = createAsyncThunk(
  "users/login",
  async ({ username, password }, rejectWithValue) => {
    try {
      const response = await axiosInstance.post("/login", {
        username,
        password,
      });
      console.log(response);
      toast.success(`welcome ${response?.data?.user?.username}`);
      return response;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      return rejectWithValue(error?.response?.data?.error);
    }
  }
);

export const signupThunk = createAsyncThunk(
  "users/signup",
  async ({ username, password, gender, fullName }, rejectWithValue) => {
    try {
      const response = await axiosInstance.post("/register", {
        username,
        password,
        gender,
        fullName,
      });
      toast.success(`welcome ${response?.data.user.username}`);
      return response;
    } catch (error) {
      toast.success(error?.response?.data?.error);
      return rejectWithValue(error?.response?.data?.error);
    }
  }
);
export const logoutThunk = createAsyncThunk(
  "users/logout",
  async (rejectWithValue) => {
    try {
      const response = await axiosInstance.post("/logout");
      toast.success("you have been logged out 🫡🫡");
      // localStorage.setItem("selectedUser");
      return response;
    } catch (error) {
      toast.success("you must be log in to log out");
      return rejectWithValue(error);
    }
  }
);
export const getProfilethunk = createAsyncThunk(
  "users/getprofile",
  async (rejectWithValue) => {
    try {
      const response = await axiosInstance.get("/getprofile");
      return response.data;
    } catch (error) {
      let x = error.response.data.error;
      return rejectWithValue(error);
    }
  }
);
export const getotheruser = createAsyncThunk(
  "users/getotheruser",
  async (rejectWithValue) => {
    try {
      const response = await axiosInstance.get("/getUser");
      return response.data;
    } catch (error) {
      let x = error.response.data.error;
      // toast.success(x);
      return rejectWithValue(error);
    }
  }
);
