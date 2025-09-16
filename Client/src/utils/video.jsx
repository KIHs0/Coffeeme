import React, { useEffect, useRef } from "react";

export default function VideoPage({ localRef, remoteRef }) {
    useEffect(() => {
    }, [localRef]);
    return (
        <div style={{ backgroundColor: "black", minHeight: "100vh", padding: "1rem", zIndex: 999 }}>
            <video
                ref={localRef}
                autoPlay
                playsInline
                muted
                style={{ border: "2px solid white", width: "100%", maxWidth: "480px", display: "block", marginBottom: "1rem" }}
            />

            <video
                ref={remoteRef}
                autoPlay
                playsInline
                style={{ border: "2px solid white", width: "100%", maxWidth: "480px", display: "block" }}
            />
        </div>
    );
}
