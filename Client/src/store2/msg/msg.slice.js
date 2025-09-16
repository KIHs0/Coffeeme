import { createSlice } from "@reduxjs/toolkit";
import { callThunk1, msgThunk, msgThunk2 } from "./msg.thunk.js";
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
    // send msg
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

    // call caller

    builder.addCase(callThunk1.pending, (state, action) => {});
    builder.addCase(callThunk1.fulfilled, (state, action) => {
      console.log(action.payload);
      console.log("callthunk1 fullfilled");
    });
    builder.addCase(callThunk1.rejected, (state, action) => {
      console.log("reje");
    });
  },
});

export const { setnewmsg } = msgSlice.actions; // to be use the useDispatch fx and useSelector
export default msgSlice.reducer; // to be exported in only store
