import { configureStore } from "@reduxjs/toolkit";

import userReducers from "./user/user.slice"; // extra reduceers
import msgReducers from "./msg/msg.slice";
import socketReducers from "./socket/socket.slice";
export const store = configureStore({
  reducer: {
    userReducers,
    msgReducers,
    socketReducers,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ["socketReducers.socket", "userReducers.user"],
      },
    }),
});
