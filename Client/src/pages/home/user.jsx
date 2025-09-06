import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectedUserfx } from "../../store2/user/user.slice";
import { msgThunk2 } from "../../store2/msg/msg.thunk";

import Msgcontainer from "./msgC";
const User = ({ otheruser, setOpen }) => {
  const { onlineusers } = useSelector(state => state.socketReducers)
  const isuserOnline = onlineusers?.includes(otheruser._id)
  const dispatch = useDispatch()

  const onlickfx = async (otheruser) => {
    (async () => {
      let { payload } = await dispatch(selectedUserfx(otheruser));
      await dispatch(msgThunk2({ payload }));
      setOpen(false)

    })();
  }

  return (
    <div className="avatar cursor-pointer w-full gap-3 py-2 hover:bg-gray-700 " onClick={() => onlickfx(otheruser)} >
      <div className={`${isuserOnline ? "avatar-online" : ""} relative w-[2rem] rounded-full `}>
        <img src={otheruser?.avatar} alt="" />
      </div>
      <h1 className="line-clamp-1 text-white capitalize">
        {otheruser?.username}
      </h1>
    </ div >
  )
};


export default User
