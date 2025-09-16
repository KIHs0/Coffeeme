import React, { useRef, useState } from "react";
import { HiOutlineInformationCircle, HiPhone, HiPhoneIncoming, HiPhoneOutgoing, HiVideoCamera } from "react-icons/hi";
import { BsSendFill } from "react-icons/bs";
import { BsPhone } from "react-icons/bs";
import User from "./user";
import { useDispatch, useSelector } from "react-redux";
import { callThunk1, msgThunk, msgThunk2 } from "../../store2/msg/msg.thunk";
import { useEffect } from "react";
import icon from "../../assests/icon.png"
import VideoPage from '../../utils/video'
import { selectedUserfx } from "../../store2/user/user.slice";
import { socketSlice } from "../../store2/socket/socket.slice";
import { setnewmsg } from '../../store2/msg/msg.slice'
const Msgcontainer = () => {
  const localRef = useRef(null);
  const remoteRef = useRef(null)
  const msgref = useRef(null)
  const dispatch = useDispatch()
  const [localrefstate, setlocalrefstate] = useState(false)
  const { otheruser, selectedUser, userProfile } = useSelector(state => state.userReducers);
  const { socket } = useSelector(state => state.socketReducers);
  const { response } = useSelector(state => state.msgReducers);
  const [text, settext] = useState("");
  const callUser = () => {
    if (localrefstate) {
      setlocalrefstate(null);
      return;
    }
    setlocalrefstate(true); // triggers useEffect
  };


  // Caller
  useEffect(() => {
    if (!socket) { console.log("sokcet nf"); return }
    (async () => {
      const pc1 = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });

      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localRef && localRef.current) {
        localRef.current.srcObject = localStream;
      }


      // 2️⃣ add local tracks to peer connection
      localStream.getTracks().forEach(track => pc1.addTrack(track, localStream));

      // 3️⃣ handle remote media
      pc1.ontrack = (event) => {
        if (remoteRef && remoteRef.current) {
          remoteRef.current.srcObject = event.streams[0];
        }

      };

      // 4️⃣ handle ICE candidates
      pc1.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", { candidate: event.candidate, to: selectedUser });
        }
      };

      // 5️⃣ create and send offer
      const offerSDP = await pc1.createOffer();
      await pc1.setLocalDescription(offerSDP);
      socket.emit("offer", { sdp: offerSDP, to: selectedUser });

      // 6️⃣ receive answer
      socket.on("answer", async ({ sdp }) => {
        await pc1.setRemoteDescription(new RTCSessionDescription(sdp));
      });
      socket.on("ice-candidate", async ({ candidate }) => {
        if (candidate) await pc1.addIceCandidate(new RTCIceCandidate(candidate)).then(e => console.log('ice candidate' + pc1.iceGatheringState));
      });
    })()
  }, [localrefstate])
  // calle
  useEffect(() => {
    if (!socket) { console.log("sokcet nf"); return }
    (async () => {
      const pc2 = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });

      // get local media
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localRef && localRef.current) {
        localRef.current.srcObject = localStream;
      }


      // add tracks
      localStream.getTracks().forEach(track => pc2.addTrack(track, localStream));

      // handle remote media
      pc2.ontrack = (event) => {
        if (remoteRef && remoteRef.current) {
          remoteRef.current.srcObject = event.streams[0];
        }

      };

      // handle ICE
      pc2.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", { candidate: event.candidate, to: fromCallerId });
        }
      };

      // receive offer, create answer
      socket.on("offer", async ({ sdp, from }) => {
        fromCallerId = from;
        await pc2.setRemoteDescription(new RTCSessionDescription(sdp));
        const answerSDP = await pc2.createAnswer();
        await pc2.setLocalDescription(answerSDP);
        socket.emit("answer", { sdp: answerSDP, to: from });
      });

      // receive ICE candidates from caller
      socket.on("ice-candidate", async ({ candidate }) => {
        if (candidate) await pc2.addIceCandidate(new RTCIceCandidate(candidate)).then(e => console.log('icecandidate added'));
      });

    })()
  }, [localrefstate])

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
            <div className="flex  justify-between cursor-pointer" >
              <User otheruser={selectedUser} />
              <h1 className=" md:text-3xl text-2xl flex  space-x-5 py-3 md:py-0  ">
                <HiPhoneOutgoing onClick={e => callUser()} />
                <HiVideoCamera />
              </h1>
            </div>

          </div>
          {/* scrollable */}
          {localrefstate ? (
            <VideoPage localRef={localRef} remoteRef={remoteRef} />
          ) : (
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
          )}

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