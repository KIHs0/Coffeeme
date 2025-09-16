import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { axiosInstance } from "../../utils/axiosInstance.js";
import axios from "axios";
export const msgThunk = createAsyncThunk(
  "msg/send",
  async ({ selectedUser, msg }, rejectWithValue) => {
    try {
      // console.log(msg); we can directly send from here as well will see later
      if (msg === "") {
        return toast.error("Please Send Something");
      }
      const response = await axiosInstance.post(`/send/${selectedUser?._id}`, {
        msg,
      });
      return response;
    } catch (error) {
      toast.success(error?.response?.data?.error);
      return rejectWithValue(error?.response?.data?.error);
    }
  }
);
export const msgThunk2 = createAsyncThunk(
  "msg/get",
  async ({ payload }, rejectWithValue) => {
    try {
      const response = await axiosInstance.post(`/get/${payload?._id}`);
      return response;
    } catch (error) {
      toast.error(error);
      return rejectWithValue(error);
    }
  }
);
