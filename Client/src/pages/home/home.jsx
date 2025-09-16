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
    if (!isAuthenticate) return;
    dispatch(initializeSocket(userProfile?._id))
  }, [isAuthenticate]);


  useEffect(() => {
    if (!socket) return;

    socket.on('onlineusers', (onlineusers) => { // it apparently listens from backend
      dispatch(setonlineusers(onlineusers))
    });

    socket.on('newMessage', (newmsg) => { // it apparently listens from backend 
      dispatch(setnewmsg(newmsg))
    });

    return () => {   // to clear things like onlineusers 
      socket.close() // this will call socket.disconnect of socket.js // call from frotend to backend
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
