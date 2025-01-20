import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import "font-awesome/css/font-awesome.min.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
// Import Font Awesome for icons
import "./JoinMeeting.css";

function JoinMeeting({ socket }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  useEffect(() => {
    if (!socket) {
      console.error("Socket not initialized");
      return;
    }

    socket.emit("joinRoom", id);
    socket.on("roomJoined", (message) => console.log(message));
    socket.on("newUserJoined", (message) => console.log(message));

    return () => {
      socket.disconnect();
      console.log("Socket disconnected.");
    };
  }, [id, socket]);

  const handleExit = () => {
    navigate("/");
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  const handleScreenShare = async () => {
    if (isScreenSharing) {
      // Stop screen sharing
      setIsScreenSharing(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        // Screen sharing logic (e.g., add the stream to a video element)
        setIsScreenSharing(true);
      } catch (error) {
        console.error("Error starting screen share:", error);
      }
    }
  };

  return (
    <div className="join-meeting-page">
      <h1>Meeting ID: {id}</h1>
      <div className="meeting-controls">
        {isCameraOn && <Webcam audio={isMicOn} />}
        <div className="controls">
          {/* Microphone Toggle */}
          <button onClick={toggleMic} className="control-button">
            <i className={`fa ${isMicOn ? "fa-microphone" : "fa-microphone-slash"}`}></i>
          </button>

          <button onClick={toggleCamera} className="control-button">
  <i className={`fa ${isCameraOn ? "fa-video" : "fa-video-slash"}`}></i>
</button>


          {/* Screen Share */}
          <button onClick={handleScreenShare} className="control-button">
            <i className={`fa ${isScreenSharing ? "fa-desktop" : "fa-desktop"}`}></i>
          </button>

          {/* Exit Meeting */}
          <button onClick={handleExit} className="control-button">
            <i className="fa fa-sign-out"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default JoinMeeting;
