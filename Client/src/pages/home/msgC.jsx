import React, { useRef, useState } from "react";
import { HiOutlineInformationCircle, HiPhone, HiPhoneIncoming, HiPhoneOutgoing, HiVideoCamera } from "react-icons/hi";
import { BsArrowReturnRight, BsSendFill } from "react-icons/bs";
import { BsPhone } from "react-icons/bs";
import User from "./user";
import { useDispatch, useSelector } from "react-redux";
import { msgThunk, msgThunk2 } from "../../store2/msg/msg.thunk";
import { useEffect } from "react";
import icon from "../../assests/icon.png"
import VideoPage from '../../utils/video'
import { selectedUserfx } from "../../store2/user/user.slice";
import { setonlineusers, socketSlice } from "../../store2/socket/socket.slice";
import { setnewmsg } from '../../store2/msg/msg.slice'
import { DeleteIcon, SendToBack } from "lucide-react";
import OfferCame from "../../utils/offercame";
const Msgcontainer = () => {
  const dispatch = useDispatch()
  const localRef = useRef(null);
  const remoteRef = useRef(null)
  const msgref = useRef(null)
  const [showref, setShowRef] = useState(false)
  const [offerCame, setofferCame] = useState(false)
  const [localpc, setLocalpc] = useState(null)
  const [remotepc, setRemotepc] = useState(null)
  const [remotePendingCandidate, setRemotePendingCandidate] = useState([])
  const [LocalPendingCandidate, setLocalPendingCandidate] = useState([])
  const [localPendingAnswer, setlocalPendingAnswer] = useState([])
  const [remotePendingOffer, setremotePendingOffer] = useState([])
  const [acordc, setacordc] = useState(false)
  // const [RTCFORHANGUP, setRTCFORHANGUP] = useState([])

  const { otheruser, selectedUser, userProfile } = useSelector(state => state.userReducers);
  const { socket } = useSelector(state => state.socketReducers);
  const { response } = useSelector(state => state.msgReducers);
  const [text, settext] = useState("");
  //1 caller will have sound
  //2 then callee have to receive
  //3 then answer should be sent onn ==> click of calleee 





  const hangup = () => {

    if (!localpc) {
      // console.log("callee hangingup")
      remotepc.getSenders().forEach(e => e.track?.stop())                           // callee hangup
      remotepc.close()
      remoteRef.current = null
      setRemotepc(null)
      setacordc(false)
      socket.emit('hangup', { to: selectedUser._id })
    }
    else {
      // console.log("caller hanging up")
      localpc.getSenders().forEach(e => e.track?.stop())                            // caller hangup
      localpc.close()
      localRef.current = null
      setLocalpc(null)
      setShowRef(false)
      socket.emit('hangup', { to: selectedUser._id })
    }
  }
  const toggleMic = async () => {
    if (localpc) {
      const sender = localpc?.getSenders().find(e => e.track.kind === 'audio');
      sender.track.enabled = sender.track.enabled ? false : true
    } else {
      const sender = remotepc?.getSenders().find(e => e.track.kind === 'audio');
      sender.track.enabled = sender.track.enabled ? false : true
    }
  }
  const toggleCamera = async () => {
    if (localpc) {
      const sender = localpc?.getSenders().find(e => e.track.kind === 'video');
      sender.track.enabled = sender.track.enabled ? false : true
    } else {
      const sender = remotepc?.getSenders().find(e => e.track.kind === 'video');
      sender.track.enabled = sender.track.enabled ? false : true
    }
  }

  // ----------------------------------------------------------------------------------------------Caller
  //EMITTING OFFER , ICE
  const callUser = () => {
    if (localpc) {
      return;
    }
    (async () => {
      setShowRef(true)
      const pc1 = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStream.getTracks().forEach(track => pc1.addTrack(track, localStream));

      //  remote media 
      pc1.ontrack = (event) => {//runs once PING happens that means the remotedescription is added
        console.log(
          'CALLER  ONTRACK'
        )
        if (remoteRef && remoteRef.current) {
          remoteRef.current.srcObject = event.streams[0];
        }

      };

      //  ICE candidates
      pc1.onicecandidate = (event) => {
        // console.log('sending candidate to calle')
        if (event.candidate) {
          socket?.emit("ice-candidate", { candidate: event.candidate, to: selectedUser?._id });
        }
        // console.log(pc1)
      };
      if (localRef && localRef.current) {
        localRef.current.srcObject = localStream;  // mine camera show
      }

      //  create and send offer
      const offerSDP = await pc1.createOffer();
      await pc1.setLocalDescription(offerSDP);
      setLocalpc(pc1)
      socket?.emit("offer", { sdp: offerSDP, to: selectedUser?._id });

      return
    })()
  };
  // Answer LISTENING
  useEffect(() => {
    if (!socket) return;

    socket.on("ice-stop", () => {
      console.log("inside ice-stop 68")
      localpc.onicecandidate = null;
      return;
    })
    //  receive answer
    socket.on("answer", async ({ sdp }) => {
      if (localpc) {
        await localpc.setRemoteDescription(new RTCSessionDescription(sdp)).then(e => console.log("PING !!!"))
      } else {
        setlocalPendingAnswer(e => [...e, sdp])   // buffer creation
      }
    });

    return () => {
      socket.off('answer')
      socket.off("ice-stop")
    }
  }, [socket])
  // BUFFER OFFER ==> Solving
  useEffect(() => {
    if (localPendingAnswer.length === 0) return
    (async () => {
      if (localPendingAnswer.length === 0 || !localpc) return
      await localpc.setRemoteDescription(new RTCSessionDescription(localPendingAnswer[0])).then(e => console.log("BUFFER : PING !!!"));
    })();
    setlocalPendingAnswer([])
  }, [localpc, localPendingAnswer])
  // ICE and HANGUP listening 📞❌
  useEffect(() => {
    if (!socket && !localpc) return
    socket.on('hangup', () => {
      if (!localpc) return
      // console.log('the caller is listening for auto hangup')
      localpc.getSenders().forEach(e => e.track.stop())
      localpc.close()
      localRef.current = null
      setLocalpc(null)
      setShowRef(false)

    })
    const handleCandidate = async ({ candidate }) => {
      if (!localpc) {
        setLocalPendingCandidate(pv => [...pv, candidate])
      } else {
        if (candidate) await localpc.addIceCandidate(new RTCIceCandidate(candidate)).then(e => console.log('candidate exchanged at first  from +++callee')).catch(e => console.log('failed to add ICE from +++calleee' + e))
      }
    }
    socket.on("ice-candidate", handleCandidate);
    return () => socket.off("ice-candidate");
  }, [socket, localpc])
  // BUFFER ICE ==>solving
  useEffect(() => {
    if (!localpc || LocalPendingCandidate.length === 0) return;
    LocalPendingCandidate.forEach(async (candidate) => {
      try {
        await localpc.addIceCandidate(new RTCIceCandidate(candidate)).then(e => console.log('CALLER BUFFER : icecandidate resolved received from callee')).catch(e => console.log(' BUFFER : failed to add ICE from +++callee' + e));
      } catch (error) {
        console.error(" BUFFER : failed to add pending candidate at caller", err);
      }
    })
    console.log('caller' + localpc.iceGatheringState)
    setLocalPendingCandidate([])
  }, [LocalPendingCandidate, localpc])



  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ callee

  const acceptingcall = async () => {
    setacordc(!acordc);
    return;
  }
  const dickliningcall = async () => {
    setofferCame(false);
  }


  // EMITTING ANSWER , ICE
  const accept = async ({ sdp, from }) => {
    const pc2 = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localStream.getTracks().forEach(track => pc2.addTrack(track, localStream));

    // handle remote media
    pc2.ontrack = (event) => {
      console.log('CALLEE ONTRACK: hi from ++calleee')
      if (remoteRef && remoteRef.current) {
        remoteRef.current.srcObject = event.streams[0];
      }

    };
    // handle ICE
    pc2.onicecandidate = (event) => {
      // console.log("icecandidate sending from peer 2")
      if (event.candidate) {
        socket.emit("ice-candidate", { candidate: event.candidate, to: from });
      }
    };
    if (localRef && localRef.current) {
      localRef.current.srcObject = localStream;
    }
    await pc2.setRemoteDescription(new RTCSessionDescription(sdp));
    const answerSDP = await pc2.createAnswer();
    await pc2.setLocalDescription(answerSDP);
    setRemotepc(pc2);
    socket.emit("answer", { sdp: answerSDP, to: from });


    return;

  }
  // OFFER LISTENING
  useEffect(() => {
    if (!socket) return;
    const handleOffer = async ({ sdp, from }) => {
      setofferCame(true);
      try {
        // await acceptingcall({ sdp, from })
        if (acordc) {
          console.log('call directly accpeted')
          await accept({ sdp, from });
        }
        else {
          setremotePendingOffer(e => [...e, { sdp, from }])
        }
      } catch (err) {
        console.error("Failed to accept offer and emit answer: CALLEE", err);
      }
    }
    socket.on("offer", handleOffer)
    return () => socket.off('offer');
  }, [socket])

  // BUFFER ANSWER Clearing ==> BASIS is ACCEPT ✅ or DECLINE ❌
  useEffect(() => {
    if (acordc) {
      setofferCame(false)
      const { sdp, from } = remotePendingOffer[0]
      remotePendingOffer.forEach(async (e) => await accept({ sdp, from }))
    }
  }, [acordc])


  // ICE LISTENING and AUTO HANGUP  📞❌
  useEffect(() => {
    if (!socket && !remotepc) return
    socket.on('hangup', () => {
      if (!remotepc) return
      // console.log("the callee is listening for auto hangup")
      remotepc.getSenders().forEach(e => e.track.stop())
      remotepc.close()
      remoteRef.current = null
      setRemotepc(null)
      setacordc(false)
    })
    const handleCandidate = async ({ candidate }) => {
      if (!remotepc) {
        setRemotePendingCandidate(pv => [...pv, candidate])   // buffer creation
      } else {

        if (candidate) await remotepc.addIceCandidate(new RTCIceCandidate(candidate)).then(e => console.log('candidate exchanged at first from ---caller')).catch(e => console.log('failed to add ICE from ----caller' + e))
      }
    }
    socket.on("ice-candidate", handleCandidate);
    return () => socket.off("ice-candidate");
  }, [socket, remotepc])
  // BUFFER ICE ==> solving
  useEffect(() => {
    if (!remotepc || remotePendingCandidate.length === 0) return;
    remotePendingCandidate.forEach(async (candidate) => {
      try {
        await remotepc.addIceCandidate(new RTCIceCandidate(candidate)).then(e => console.log('CALLEE BUFFER : icecandidate resolved received from --caller')).catch(e => console.log(' CALLEE BUFFER : failed to add ICE from ----caller' + e))

      } catch (error) {
        console.error("CALLEE BUFFER:failed to add pending candidate", err);
      }
    })
    // console.log('calle ' + remotepc.iceGatheringState)
    setRemotePendingCandidate([])
  }, [remotepc, remotePendingCandidate])




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
          {offerCame ? (    // this will be shown for callee
            <OfferCame acceptingcall={acceptingcall} name={selectedUser?.fullName} avatar={selectedUser?.avatar} dickliningcall={dickliningcall} />
          ) : (<></>)}
          {acordc ? (    // this will be shown for callee
            <VideoPage localRef={localRef} remoteRef={remoteRef} hangup={hangup} toggleCamera={toggleCamera} toggleMic={toggleMic} />
          ) : (<></>)}
          {showref ? (  // this will be shown for caller
            <VideoPage localRef={localRef} remoteRef={remoteRef} hangup={hangup} toggleCamera={toggleCamera} toggleMic={toggleMic} />
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
                      <time className="text-[10px] opacity-50"><p>{new Date().getHours()}</p></time>
                    </div>
                    <>
                      <div className="chat-bubble text-1xl ">{e.message}</div>
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