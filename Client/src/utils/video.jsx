import React, { useEffect, useState } from "react";
import { PhoneOff, Mic, MicOff, Video, VideoOff, Monitor } from "lucide-react";

export default function VideoPage({ localRef, remoteRef }) {
    const [mainVideo, setMainVideo] = useState("local"); // "local" or "remote"
    const [muted, setMuted] = useState(false);
    const [cameraOff, setCameraOff] = useState(false);

    const swapVideos = () => {
        console.log(mainVideo)
        setMainVideo((prev) => (prev === "remote" ? "local" : "remote"));
    };



    return (
        <div className=" w-full h-screen flex  justify-center items-center-safe cursor-pointer  ">
            {/* Main video */}
            <video
                ref={mainVideo === "local" ? localRef : remoteRef}
                autoPlay
                playsInline
                muted={mainVideo === "local" || muted}
                className={`  ${mainVideo === 'local' ? " w-full h-full object-cover transition-all" : " absolute md:top-24 md:right-6 md-w-60 md-h-50    top-24 right-3  border-0 object-cover  w-39 h-39 overflow-auto  rounded-t-2xl rounded-b-2xl    "} `}
            />
            <video
                onClick={swapVideos}
                ref={mainVideo === "remote" ? localRef : remoteRef}
                autoPlay
                playsInline
                muted
                className={`  ${mainVideo === 'remote' ?
                    " w-full h-full object-cover " : " absolute md:top-24 md:right-6 md-w-60 md-h-50   top-24 right-3  h-39 w-39 border-0  transition   rounded-t-2xl rounded-b-2xl  "} `}  // remove border when media flow
            />

            {/* Control bar */}
            <div className="absolute md:bottom-4 bottom-1 md:w-full  flex justify-center md:gap-6 gap-3 md:left-19  ">
                <button
                    onClick={() => setMuted((m) => !m)}
                    className="bg-gray-800 text-white p-4 rounded-full hover:bg-gray-700 transition"
                >
                    {muted ? <MicOff size={24} /> : <Mic size={24} />}
                </button>

                <button
                    onClick={() => setCameraOff((c) => !c)}
                    className="bg-gray-800 text-white p-4 rounded-full hover:bg-gray-700 transition"
                >
                    {cameraOff ? <VideoOff size={24} /> : <Video size={24} />}
                </button>

                <button
                    className="bg-gray-800 text-white p-4 rounded-full hover:bg-gray-700 transition"
                >
                    <Monitor size={24} /> {/* screen share */}
                </button>

                <button
                    className=" bg-red-600 text-white p-4 rounded-full hover:bg-red-700 transition"
                >
                    <PhoneOff size={24} /> {/* hang up */}
                </button>
            </div>
        </div >
    );
}
