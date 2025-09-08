import React, { useEffect } from "react";
import Sidebar from "./sideBar";
import Msgcontainer from "./msgC";
import { useDispatch, useSelector } from "react-redux";
import { initializeSocket, setonlineusers } from "../../store2/socket/socket.slice";
import { setnewmsg } from "../../store2/msg/msg.slice";
const Home = () => {
  const dispatch = useDispatch()
  const { isAuthenticate, userProfile } = useSelector(state => state.userReducers)
  const { socket } = useSelector(state => state.socketReducers)
  useEffect(() => {
    if (!isAuthenticate || !userProfile?.id) return;
    console.log("Auth true, from home.jsx", userProfile?._id);
    dispatch(initializeSocket(userProfile?._id)).catch(console.log(`socket not connected:${userProfile?._id}`));
  }, [isAuthenticate]);


  useEffect(() => {
    if (!socket) {
      // console.log("socket returned not found");
      return;
    };

    socket.on('onlineusers', (onlineusers) => { // it apparently listens from backend
      dispatch(setonlineusers(onlineusers))
    });

    socket.on('newMessage', (newmsg) => { // it apparently listens from backend 
      dispatch(setnewmsg(newmsg))
    });

    return () => {   // to clear things like onlineusers 
      socket.close() // this will call socket.disconnect of socket.js
    };
  }, [socket])

  return (
    <div className="flex ">
      <Sidebar />
      <Msgcontainer />
    </div>
  );
};

export default Home;
