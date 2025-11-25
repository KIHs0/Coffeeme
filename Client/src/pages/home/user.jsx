import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectedUserfx } from "../../store2/user/user.slice";
import { msgThunk2 } from "../../store2/msg/msg.thunk";
const User = ({ otheruser }) => {
  const dispatch = useDispatch()
  const { selectedUser } = useSelector(state => state.userReducers)
  const onlickfx = async (otheruser) => {
    let { payload } = await dispatch(selectedUserfx(otheruser));
    // Wait for Redux to update, then get the latest selectedUser from the store
    await dispatch(msgThunk2(payload._id));

  };
  return (
    <div className="avatar w-full gap-3 py-2 hover:bg-black " onClick={() => onlickfx(otheruser)} >
      <div className="ring-primary ring-offset-base-100 w-[2rem] rounded-full ring-2 ring-offset-2">
        <img src={otheruser?.avatar} alt="" />
      </div>
      <h1 className="line-clamp-1 text-white capitalize">
        {otheruser?.username}
      </h1>
    </ div >

  )
};

export default User;
