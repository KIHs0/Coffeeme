import { createSlice } from "@reduxjs/toolkit";
import {
  loginThunk,
  logoutThunk,
  signupThunk,
  getProfilethunk,
  getotheruser,
} from "./user.thunk.js";

const initialState = {
  isAuthenticate: JSON.parse(localStorage.getItem("etac")),
  screenLoading: true,
  otheruser: null,
  userProfile: null, // after user login data saved at this state and HENCE can be used through useSelector and accessable from everywhere allover the react component
  // selectedUser: JSON.parse(localStorage.getItem("selectedUser")),
  selectedUser: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    selectedUserfx: (state, action) => {
      // localStorage.setItem("selectedUser", JSON.stringify(action.payload));
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginThunk.pending, (state, action) => {});
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.userProfile = action.payload.data.user; // payload here is an res.json returned from user.thunk.js -- loginThunk => axiosInstace.js => user.controller.js -- login
      localStorage.setItem("etac", JSON.stringify(true));
      state.screenLoading = false;
    });
    builder.addCase(loginThunk.rejected, (state, action) => {});

    /**
     * getprofile
     */

    builder.addCase(getProfilethunk.pending, (state, action) => {
      state.screenLoading = true;
    });
    builder.addCase(getProfilethunk.fulfilled, (state, action) => {
      state.screenLoading = false;
      state.userProfile = action?.payload?.profile;
    });
    builder.addCase(getProfilethunk.rejected, (state, action) => {});

    /**
     * signUP thunk
     */

    builder.addCase(signupThunk.pending, (state, action) => {});
    builder.addCase(signupThunk.fulfilled, (state, action) => {
      state.userProfile = action.payload.data.user; // payload here is an res.json returned from user.thunk.js -- loginThunk => axiosInstace.js => user.controller.js -- login
      state.isAuthenticate = true;
      state.screenLoading = false;
    });
    builder.addCase(signupThunk.rejected, (state, action) => {});

    /**
     * logout thunk
     */

    builder.addCase(logoutThunk.pending, (state, action) => {});
    builder.addCase(logoutThunk.fulfilled, (state, action) => {
      state.userProfile = null; // payload here is an res.json returned from user.thunk.js -- loginThunk => axiosInstace.js => user.controller.js -- login
      state.screenLoading = true;
      localStorage.clear();
    });
    builder.addCase(logoutThunk.rejected, (state, action) => {});

    /**
     * get other user or adding frnd
     *
     */

    builder.addCase(getotheruser.pending, (state, action) => {});
    builder.addCase(getotheruser.fulfilled, (state, action) => {
      let arr = action?.payload?.res;
      state.otheruser = arr;
    });
    builder.addCase(getotheruser.rejected, (state, action) => {});
  },
});

export const { selectedUserfx } = userSlice.actions; // to be use the useDispatch fx and useSelector
export default userSlice.reducer; // to be exported in only store
