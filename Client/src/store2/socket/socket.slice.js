import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

const initialState = {
  socket: null,
  onlineusers: null,
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    initializeSocket: (state, action) => {
      if (!action.payload) return;
      const socket = io(import.meta.env.VITE_BASE_URL, {
        query: {
          userId: action.payload,
        },
      });
      state.socket = socket;
    },

    setonlineusers: (state, action) => {
      state.onlineusers = action.payload;
    },
  },
});

export const { initializeSocket, setonlineusers } = socketSlice.actions; // to be use the useDispatch fx and useSelector
export default socketSlice.reducer; // to be exported in only store
