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
              <h1 className="text-4xl"> 👈 To Chat</h1>

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
          <div className="flex  justify-between  fixed md:bottom-0 px-2 bottom-1 md:p-3 p-y-3">
            <div className="md:w-[80vw] w-[79vw]">
              <legend className="fieldset-legend text-white-800 text-[12px]">
                Type Your Message?
              </legend>
              <input
                type="text"
                name="text"
                value={text}
                onChange={(e) => {
                  handleChange(e);
                }}
                className="input md:w-full  border-indigo-500 "
                placeholder="Type here"
              />

            </div>
            <h1 className="md:text-2xl text-2xl  mt-6  ml-5 rounded-3xl md:border-3 p-3  ring-primary ring-1 ">
              <BsSendFill onClick={() => {
                sendingMessage(text)
              }} />
            </h1>
          </div>
          {/* </div> */}



        </>)
      }
    </div >
  );
};

export default Msgcontainer;
<script src="/socket.io/socket.io.js"></script>