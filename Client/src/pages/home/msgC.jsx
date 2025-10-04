import React, { useRef, useState } from "react";
import { HiPhoneOutgoing, HiVideoCamera } from "react-icons/hi";
import { BsArrowReturnRight, BsSendFill } from "react-icons/bs";
import { PiHeartThin, PiHeartFill } from "react-icons/pi";
import { BsPhone } from "react-icons/bs";
import User from "./user";
import { useDispatch, useSelector } from "react-redux";
import { msgThunk, msgThunk2 } from "../../store2/msg/msg.thunk";
import { useEffect } from "react";
import VideoPage from '../../utils/video'
import { selectedUserfx } from "../../store2/user/user.slice";
import { setonlineusers, socketSlice } from "../../store2/socket/socket.slice";
import { setnewmsg } from '../../store2/msg/msg.slice'
import { DeleteIcon, Heart, SendToBack, Weight } from "lucide-react";
import OfferCame from "../../utils/offercame";

const Msgcontainer = () => {
  const sounds = [
    {
      name: "Ringing",
      path: "/phoneRing.mp3"
    },
    {
      name: "Hangup",
      path: "/endCall.wav"
    }
  ]




  const dispatch = useDispatch()
  const music = useRef(null)
  const selectedUserRef = useRef()
  const localRef = useRef(null);
  const remoteRef = useRef(null)
  const msgref = useRef(null)
  const [showref, setShowRef] = useState(false)
  const [offerCame, setofferCame] = useState(false)
  const [localpc, setLocalpc] = useState(null)
  const [remotepc, setRemotepc] = useState(null)
  const [HeartColor, setHeartColor] = useState({})
  const [bufferHeart, setBufferHeart] = useState({})

  const [remotePendingCandidate, setRemotePendingCandidate] = useState([])
  const [LocalPendingCandidate, setLocalPendingCandidate] = useState([])
  const [localPendingAnswer, setlocalPendingAnswer] = useState([])
  const [remotePendingOffer, setremotePendingOffer] = useState([])
  const [acordc, setacordc] = useState(false)
  // const [RTCFORHANGUP, setRTCFORHANGUP] = useState([])


  const { otheruser, selectedUser, userProfile, isAuthenticate } = useSelector(state => state.userReducers);
  // auto fetch msg
  useEffect(() => {
    if (!selectedUser) return
    dispatch(msgThunk2(selectedUser._id));
  }, [selectedUser])

  const { socket } = useSelector(state => state.socketReducers);
  const { response } = useSelector(state => state.msgReducers);
  const [text, settext] = useState("");

  const playSounds = (name) => {
    const play = sounds.find(e => e.name === name);
    music.current = new Audio(play.path);
    music.current.play();
    if (name != 'Hangup') {
      music.current.loop = true;
    }
    return;
  }
  const stopsounds = () => {
    if (!music.current) {
      return;
    }
    music.current.pause();
    music.current = null;
    return;
  }

  const hangup = () => {
    stopsounds()
    playSounds("Hangup")
    if (localpc) {
      console.log("caller hanging up")
      localpc.getSenders().forEach(e => e.track?.stop())                            // caller hangup
      localpc.close()
      localRef.current = null
      setLocalpc(null)
      setlocalPendingAnswer([])
      setLocalPendingCandidate([])
      setShowRef(false)
      console.log(localpc)
      socket.emit('hangup', { to: selectedUser._id })
    }
    else {
      console.log("callee hangingup")
      remotepc.getSenders().forEach(e => e.track?.stop())                           // callee hangup
      remotepc.close()
      remoteRef.current = null
      setRemotePendingCandidate([])
      setremotePendingOffer([])
      setShowRef(false)
      setRemotepc(null)
      setacordc(false)
      console.log(remotepc)
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
          'CALLER  ONTRACK RUNNING'
        )
        if (remoteRef && remoteRef.current) {
          remoteRef.current.srcObject = event.streams[0];
        }

      };

      //  ICE candidates
      pc1.onicecandidate = (event) => {
        console.log('sending candidate to calleee onicecandidate running')
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
  // ANSWER LISTENING BUFFER CREATION
  useEffect(() => {
    if (!socket) return;
    socket.on("ice-stop", () => {
      setTimeout(() => {
        socket.emit("hangup", ({}))
      }, 7000)
      return;
    })
    //  receive answer and BUFFER CREATIN
    socket.on("answer", async ({ sdp }) => {
      if (localpc) {
        await localpc.setRemoteDescription(new RTCSessionDescription(sdp)).then(e => console.log("PING !!!"))
      }
      else {
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
    if (localPendingAnswer.length === 0 || !localpc) return
    (async () => {
      await localpc.setRemoteDescription(new RTCSessionDescription(localPendingAnswer[0])).then(e => console.log("BUFFER : PING !!!"));
      stopsounds()
    })();
    setlocalPendingAnswer([])
  }, [localpc, localPendingAnswer])

  // ICE and HANGUP listening 📞❌
  useEffect(() => {
    if (!socket && !localpc) return
    socket.on('hangup', () => {
      console.log('the caller is listening for auto hangup')
      if (!localpc) return

      stopsounds()
      localpc.getSenders().forEach(e => e.track?.stop())
      localpc.close()
      localRef.current = null
      setlocalPendingAnswer([])
      setLocalPendingCandidate([])
      setLocalpc(null)
      setShowRef(false)
      console.log(localpc)
    })
    const handleCandidate = async ({ candidate, from }) => {
      if (localpc) {
        await localpc.addIceCandidate(new RTCIceCandidate(candidate)).then(e => console.log('candidate exchanged at first  from +++callee to caller')).catch(e => console.log('failed to add ICE from +++calleee to caller' + e))
        return;
      } else if (!localpc || !remotepc) {
        return;
      }
      else {
        setLocalPendingCandidate((e) => [...e, candidate])
        return;
      }
    }
    socket.on("ice-candidate", handleCandidate);
    return () => socket.off("ice-candidate");
  }, [socket, localpc])

  // BUFFER ICE ==>solving  
  useEffect(() => {
    if (!localpc || LocalPendingCandidate.length === 0) return
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
      if (event.candidate) {
        console.log("icecandidate sending from peer 2 onicecandidaterunning  from calleee")
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
  const acceptingcall = async () => {
    setacordc(true);
    setShowRef(true)
    return;
  }

  const dickliningcall = async () => {
    setacordc(false)
    setofferCame(false);
    setremotePendingOffer([])
    socket.emit("hangup", ({ to: selectedUser._id }))
  }
  // BUFFER ANSWER Clearing ==> BASIS is ACCEPT ✅ or DECLINE ❌
  useEffect(() => {
    if (acordc) {
      setofferCame(false)
      const { sdp, from } = remotePendingOffer[0]
      remotePendingOffer.forEach(async (e) => await accept({ sdp, from }))
    }
  }, [acordc])

  // OFFER LISTENING & BUFFER CREATION 
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
          console.log('setting remotepending offer')
          setremotePendingOffer(e => [...e, { sdp, from }])
        }
      } catch (err) {
        console.error("Failed to accept offer and emit answer: CALLEE", err);
      }
    }
    socket.on("offer", handleOffer)
    return () => socket.off('offer');
  }, [socket])

  // ICE LISTENING and AUTO HANGUP  📞❌
  useEffect(() => {
    if (!socket && !remotepc) return
    socket.on('hangup', () => {
      console.log("the callee is listening for auto hangup")
      if (!remotepc) return
      remotepc.getSenders().forEach(e => e.track.stop())
      remotepc.close()
      remoteRef.current = null
      setRemotePendingCandidate([])
      setremotePendingOffer([])
      setRemotepc(null)
      setacordc(false)
      setShowRef(false)
      console.log(remotepc)
    })
    const handleCandidate = async ({ candidate }) => {
      if (!remotepc || !localpc) {
        console.log('buffer ice candidate creating callee')
        setRemotePendingCandidate(pv => [...pv, candidate])   // buffer creation
        return
      } else {
        if (candidate) await remotepc.addIceCandidate(new RTCIceCandidate(candidate)).then(e => console.log('candidate exchanged at first from ---caller to callee')).catch(e => console.log('failed to add ICE from ----caller  to callee' + e))
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


  // emitting normalsending likes
  const toggleHeart = (e) => {
    socket.emit("likeSending", ({ keys: e, to: selectedUser?._id }))

    setHeartColor((p) => {
      const newheartcolor = {
        ...p,
        [e]: !p[e],
      }
      setBufferHeart((p) => ({
        ...p,
        [e]: p[e] !== undefined ? !p[e] : newheartcolor[e],
      }));
      return newheartcolor
    })
  }
  // listening normalsending likes   
  useEffect(() => {
    if (!socket) return
    socket.on("likeSending", ({ keys, from }) => {
      setHeartColor((p) => ({
        ...p,
        [keys]: !p[keys]
      }));
      setBufferHeart((p) => ({
        ...p,
        [keys]: !p[keys]
      }));            // yo mildehna cause xaina bufferheart  // its needed to exchange data from both user to backend
    })
    return
  }, [socket])

  // emitting dbsending likes
  useEffect(() => {
    const prevSelectedUserRef = selectedUserRef.current;
    selectedUserRef.current = selectedUser;

    if (!socket || (Object.keys(bufferHeart).length === 0)) return
    if (!userProfile || !prevSelectedUserRef) return
    console.log(bufferHeart)
    socket.emit("likeSendingDB", {
      keys: bufferHeart,
      receiverid: prevSelectedUserRef._id,
      senderid: userProfile._id
    });
    setBufferHeart({})
    setHeartColor({})
    return;
  }, [selectedUser, userProfile])

  useEffect(() => {
    if (msgref.current) {
      msgref.current.scrollIntoView({ behavior: "smooth" });
    }
    response?.forEach(e => {
      setHeartColor(pv => (
        {
          ...pv,
          [e._id]: e.like ?? false
        }));

    });
  }, [response])

  const handleChange = (e) => {
    settext(e.target.value);
  };
  const sendingMessage = async (text) => {
    if (!text) return
    (async () => {
      dispatch(
        msgThunk({ selectedUser, msg: text })
      )
      settext("")
    })()
  }



  return <>
    <div className="w-full  bgimg  " >
      {offerCame ? (    // this will be shown for callee
        <OfferCame acceptingcall={acceptingcall} name={selectedUser?.fullName} avatar={selectedUser?.avatar} dickliningcall={dickliningcall} />
      ) : (<></>)}
      {acordc ? (    // this will be shown for callee
        <VideoPage localRef={localRef} remoteRef={remoteRef} hangup={hangup} toggleCamera={toggleCamera} toggleMic={toggleMic} />
      ) : (<></>)}

      {!selectedUser && (
        <div className=" justify-center md:my-[10rem] p-10 md:p-0 items-center  select-none bgimg1 h-full md:hidden">
          <div role="alert" className="alert alert-info  hidden md-flex ">
            <img src="./icon.png" alt="" className="w-100 h-100" />
            <h1 className="text-2xl md:text-4xl"> 👈 Find Someone To Chat</h1>
          </div>

          <div className="md:hidden  flex flex-col items-center translate-y-43">
            <img src="./icon.png" alt="" className="w-50 h-50 " />
            <h1 className="text-2xl "> 👈 Find Someone To Chat </h1>
          </div>
        </div>
      )
      }
      {selectedUser && (
        <>
          {showref ? (
            <VideoPage localRef={localRef} remoteRef={remoteRef} hangup={hangup} toggleCamera={toggleCamera} toggleMic={toggleMic} />
          )
            : (
              <>
                <div className="headerchat z-10 p-7 border-b-1 border-indigo-500 h-[5rem] ">
                  <div className="flex  justify-between crsour-pointer" >
                    <User otheruser={selectedUser} />
                    <h1 className=" md:text-3xl text-2xl flex  space-x-7 py-3 md:py-0  ">
                      <HiPhoneOutgoing size={22} />
                      <HiVideoCamera onClick={e => { callUser(); playSounds("Ringing") }} />
                    </h1>
                  </div>
                </div>
                <div className=" z-10 h-[75vh] overflow-y-scroll overflow-x-hidden " >
                  {!response || (
                    <h1 className="text-center md:text-sm text-xs font-extrabold bg-gradient-to-r from-[#FFAC1C] via-[#800080] to-[#c55521] bg-clip-text text-transparent drop-shadow-md tracking-tighter p-5 -translate-y-5">
                      <span className="text-gray-400">🌸</span>   This is the Beginning of your Special & Cozy Chats with <span className=" bg-clip-text bg-gradient-to-r from-[#C71585] to-[#DB7093]">{selectedUser?.fullName}💝</span> — Welcome to <span className="bg-gradient-to-r from-[#FF00FF] to-[#1E90FF] bg-clip-text text-transparent italic">
                        CoffeeMe
                      </span>{" "}
                      <span className="text-gray-400">☕</span>
                    </h1>
                  )}

                  {response && (
                    response?.map(e =>
                      <div ref={msgref}
                        className={
                          e?.senderId === userProfile?._id ?
                            "chat chat-end flex flex-col gap-[0.5rem] mx-[0.4rem] relative" :
                            "chat chat-start flex flex-col gap-[0.5rem] mx-[0.4rem] relative "
                        }
                      >
                        <div className="chat-header text-md capitalize text-center absolute left-1/2 -translate-x-1/2 -translate-y-7  ">
                          <span className="text-[10px] opacity-50">
                            {e?.time || ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-2  ">
                          <div
                            className={
                              e?.senderId === userProfile?._id
                                ? "bg-[#374646] chat-bubble text-sm"
                                : "chat-bubble text-sm bg-none "
                            }
                          >
                            {e.message}
                          </div>
                          <span className={e?.senderId === userProfile?._id ? "absolute -translate-x-7.5 cursor-pointer touch-manipulation" : "cursor-pointer touch-manipulation"} key={e.id} >
                            {!HeartColor[e._id] && <div className="relative flex justify-center text-center cursor-pointer touch-manipulation">
                              <PiHeartThin
                                size={20}
                                fill="#FFE6EC"
                                onClick={() => toggleHeart(e._id)}
                              />
                            </div>}
                            {HeartColor[e._id] && (
                              <PiHeartFill
                                size={20}
                                color="#FF00FF"
                                onClick={() => toggleHeart(e._id)}
                              />
                            )}
                          </span>
                        </div>

                        <div className="chat-footer opacity-50">Seen</div>
                      </div>
                    )
                  )}
                </div>
                <div className=" md:bottom-1 md:left-60    bottom-2 flex   items-center justify-between   px-3 py-0 md:px-5 md:py-1 fixed ">
                  <div className="flex-1    ">
                    <legend className="fieldset-legend text-white text-xs mb-0">
                      Type Your Message
                    </legend>
                    <input
                      type="text"
                      name="text"
                      value={text}
                      onChange={handleChange}
                      className="w-[79vw]  rounded-lg border border-indigo-500 bg-gray-800 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
              </>
            )}
        </>
      )}
    </div>
  </>

};

export default Msgcontainer;