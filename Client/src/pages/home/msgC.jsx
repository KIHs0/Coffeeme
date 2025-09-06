import React, { useRef, useState } from "react";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { BsSendFill } from "react-icons/bs";
import User from "./user";
import { useDispatch, useSelector } from "react-redux";
import { msgThunk, msgThunk2 } from "../../store2/msg/msg.thunk";
import { useEffect } from "react";
import icon from "../../assests/icon.png"
import { selectedUserfx } from "../../store2/user/user.slice";
import { socketSlice } from "../../store2/socket/socket.slice";
import { setnewmsg } from '../../store2/msg/msg.slice'
const Msgcontainer = () => {
  const msgref = useRef(null)
  const dispatch = useDispatch()
  const { otheruser, selectedUser, userProfile } = useSelector(state => state.userReducers);
  const { socket } = useSelector(state => state.socketReducers);
  const { response } = useSelector(state => state.msgReducers);
  const [text, settext] = useState("");


  const handleChange = (e) => {
    settext(e.target.value);
  };
  const sendingMessage = async (text) => {
    (async () => {
      dispatch(
        msgThunk({ selectedUser, msg: text })
      )
      settext("")
    })()
  }

  useEffect(() => {
    if (msgref.current) {
      msgref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [response])
  return (
    <div className="w-full" >
      {selectedUser === null ? (
        <>
          <div className=" justify-center md:my-[10rem]  md:flex p-10 md:p-0 ">
            <div role="alert" className="alert alert-info  hidden md-flex ">
              <h1 className="text-2xl md:text-4xl"> 👈 To Chat</h1>

              <img src={icon} alt="" className="w-100 h-100" />

            </div>
            <div className="md:hidden  flex flex-col justify-center   fixed top-50 left-20">
              <img src={icon} alt="icon" className="w-50 h-50 " />
              <h1 className="text-1xl"> 👈 Find Someone To Chat </h1>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* header */}
          <div className="headerchat  p-5 border-b-1 border-indigo-500 h-[5rem]">
            <div className="flex  justify-between cursor-not-allowed" >
              <User otheruser={selectedUser} />
              <h1 disabled className=" md:text-4xl text-3xl ">
                <HiOutlineInformationCircle />
              </h1>
            </div>

          </div>
          {/* scrollable */}
          <div className="  h-[75vh] overflow-y-scroll" >
            {response && (
              response?.map(e =>
                <div ref={msgref}
                  className={
                    e?.senderId === userProfile?._id ?
                      "chat chat-end     flex flex-col gap-[1rem] mx-[1rem]" :
                      "chat chat-start     flex flex-col gap-[1rem] mx-[1rem] "
                  }
                >

                  <div className="chat-header text-md capitalize">
                    <time className="text-[10px] opacity-50">2 hours ago</time>
                  </div>
                  <>
                    <div className="chat-bubble text-1xl ">{e ? e.message : 'msg is not here'}</div>
                    <div className="chat-footer opacity-50">Seen</div>
                  </>
                </div>
              )
            )}
          </div>

          {/* <div className="headerchat  p-3 border-b-1 border-indigo-500 h-[5rem] "> */}
          <div className="relative bottom-0 md:left-3 w-full flex items-center justify-between px-3 py-3 md:px-5 md:py-1">
            <div className="flex-1">
              <legend className="fieldset-legend text-white text-xs mb-1">
                Type Your Message
              </legend>
              <input
                type="text"
                name="text"
                value={text}
                onChange={handleChange}
                className="w-full rounded-lg border border-indigo-500 bg-gray-800 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Type here"
              />
            </div>
            <button
              onClick={() => sendingMessage(text)}
              className="ml-3  mt-7  flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700   p-3 text-white shadow-md transition"
            >
              <BsSendFill size={20} />
            </button>
          </div>




        </>)
      }
    </div >
  );
};

export default Msgcontainer;
<script src="/socket.io/socket.io.js"></script>