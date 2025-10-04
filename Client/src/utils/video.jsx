import React, { useEffect, useState } from "react";
import { PhoneOff, Mic, MicOff, Video, VideoOff, Monitor } from "lucide-react";
import { BsCamera, BsCamera2, BsCameraVideoOff, BsCameraVideoOffFill, BsFillCameraVideoFill } from "react-icons/bs";

export default function VideoPage({ localRef, remoteRef, hangup, toggleCamera, toggleMic }) {
    const [mainVideo, setMainVideo] = useState("local"); // "local" or "remote"
    // control bar states
    const [muted, setMuted] = useState(false);
    const [on, setOn] = useState(false);
    const [cameraBack, setcameraBack] = useState(false);
    // control bar functions 
    const swapVideos = () => {
        console.log(mainVideo)
        setMainVideo((prev) => (prev === "remote" ? "local" : "remote"));
    };
    const hangover = () => {
        hangup()
    }

    const switchCam = async () => {
        console.log('hi sc')
        let newStream;
        const { deviceId } = (await navigator.mediaDevices.enumerateDevices()).find(e => e.kind === 'videoinput')
        try {
            newStream = await navigator.mediaDevices.getUserMedia(
                {
                    video: {
                        deviceId,
                        facingMode: {
                            exact: "environment"
                        }
                    }, audio: false
                }
            )
        } catch (error) {
            console.warn(error)
            return;
        }
        const newVideoTrack = newStream.getVideoTracks()[0];
        const sender = localpc.getSenders().find(e => e.track.kind === 'video');
        console.log(sender)
        if (sender && newVideoTrack) {
            sender.replaceTrack(newStream)
            console.log(sender)
            console.log(sender.replaceTrack(newStream))
        }
        const oldstream = localRef.current.srcObject.getVideoTracks()[0]
        if (oldstream) {
            localRef.current.srcObject.removeTrack(oldstream)
            localRef.current.srcObject.addTrack(newVideoTrack)
        }


    }

    return (
        <div className=" w-full h-screen absolute   left-0 z-100 flex justify-center items-center cursor-pointer   ">
            {/* Main video */}
            <video
                ref={mainVideo === "local" ? localRef : remoteRef}
                autoPlay
                playsInline
                muted={mainVideo === "local" || muted}
                className={`  ${mainVideo === 'local' ? " w-full h-full object-cover transition-all" : " absolute md:top-24 md:right-6 md-w-60 md-h-50  top-24 right-3  border-0 object-cover  w-39 h-39 overflow-auto  rounded-t-2xl rounded-b-2xl    "} `}
            />
            <video
                onClick={swapVideos}
                ref={mainVideo === "remote" ? localRef : remoteRef}
                autoPlay
                playsInline
                muted
                className={`  ${mainVideo === 'remote' ?
                    " w-full h-full object-cover " : " absolute md:top-24 md:right-6 md-w-60 md-h-50   top-24 right-3   border-0 object-cover w-39 h-39 overflow-auto transition   rounded-t-2xl rounded-b-2xl  "} `}  // remove border when media flow
            />

            {/* Control bar */}
            <div className="absolute md:bottom-4 bottom-1 md:w-full  flex justify-center md:gap-6 gap-3   ">
                <button
                    onClick={() => { toggleMic(); setMuted((m) => !m) }}
                    className="bg-gray-800 text-white p-4 rounded-full hover:bg-gray-700 transition"
                >
                    {muted ? <MicOff size={24} /> : <Mic size={24} />}
                </button>

                <button
                    onClick={() => { switchCam(); setcameraBack((c) => !c) }}
                    className="bg-gray-800 text-white p-4 rounded-full hover:bg-gray-700 transition"
                >
                    {cameraBack ? <BsCamera size={24} /> : <BsCamera size={24} />}
                </button>
                <button
                    onClick={() => { toggleCamera(); setOn((c) => !c) }}
                    className="bg-gray-800 text-white p-4 rounded-full hover:bg-gray-700 transition"
                >
                    {on ? <VideoOff size={24} /> : <Video size={24} />}
                </button>

                <button onClick={() => hangover()}
                    className=" bg-red-600 text-white p-4 rounded-full hover:bg-red-700 transition z-100"
                >
                    <PhoneOff size={24} />
                </button>
            </div>
        </div >
    );
}
