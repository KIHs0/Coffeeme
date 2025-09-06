import { createSlice } from "@reduxjs/toolkit";
import { msgThunk, msgThunk2 } from "./msg.thunk.js";
const initialState = {
  response: null,
};

export const msgSlice = createSlice({
  name: "msg",
  initialState,
  reducers: {
    setnewmsg: (state, action) => {
      const oldmessage = state.response ?? [];
      state.response = [...oldmessage, action.payload];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(msgThunk.pending, (state, action) => {});
    builder.addCase(msgThunk.fulfilled, (state, action) => {
      let oldmessage = state.response ?? [];
      let allmsg = action?.payload?.data?.newMessage;
      state.response = [...oldmessage, allmsg];
    });

    builder.addCase(msgThunk.rejected, (state, action) => {});
    /***
     * getmsg
     */
    builder.addCase(msgThunk2.pending, (state, action) => {});
    builder.addCase(msgThunk2.fulfilled, (state, action) => {
      let allmsg = action?.payload?.data?.convo.participantsMsg;
      state.response = allmsg;
    });

    builder.addCase(msgThunk2.rejected, (state, action) => {});
  },
});

export const { setnewmsg } = msgSlice.actions; // to be use the useDispatch fx and useSelector
export default msgSlice.reducer; // to be exported in only store
