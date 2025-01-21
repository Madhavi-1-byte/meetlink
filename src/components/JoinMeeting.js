<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import "font-awesome/css/font-awesome.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./JoinMeeting.css";

function JoinMeeting({ socket }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (!socket) {
      console.error("Socket not initialized");
      return;
    }

    // Join the room
    socket.emit("joinRoom", id);

    // Listen for updates from the server
    socket.on("roomParticipants", (updatedParticipants) => {
      setParticipants(updatedParticipants);
    });

    return () => {
      socket.emit("leaveRoom", id);
      socket.disconnect();
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
      setIsScreenSharing(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setIsScreenSharing(true);
      } catch (error) {
        console.error("Error starting screen share:", error);
      }
    }
  };

  const toggleHandRaise = () => {
    const newStatus = !isHandRaised;
    setIsHandRaised(newStatus);
    socket.emit("handRaise", { raised: newStatus });
  };

  return (
    <div className="join-meeting-page">
      <h1>Meeting ID: {id}</h1>

      <div className="video-container">
        <div className="controls-container">
          {/* Participants Icon */}
          <button className="control-button participants-button">
            <i className="fa fa-users"></i>
            <span className="participants-count">{participants.length}</span>
          </button>

          {/* Microphone Toggle */}
          <button onClick={toggleMic} className="control-button">
            <i className={`fa ${isMicOn ? "fa-microphone" : "fa-microphone-slash"}`}></i>
          </button>

          {/* Camera Toggle */}
          <button onClick={toggleCamera} className="control-button">
            <i className={`fa ${isCameraOn ? "fa-video" : "fa-video-slash"}`}></i>
          </button>

          {/* Screen Share */}
          <button onClick={handleScreenShare} className="control-button">
            <i className="fa fa-desktop"></i>
          </button>

          {/* Hand Raise */}
          <button onClick={toggleHandRaise} className="control-button">
            <i className={`fa ${isHandRaised ? "fa-hand-paper" : "fa-hand-rock"}`}></i>
          </button>

          {/* Exit Meeting */}
          <button onClick={handleExit} className="control-button">
            <i className="fa fa-sign-out"></i>
          </button>
        </div>

        {/* Video Stream */}
        {isCameraOn && <Webcam audio={isMicOn} />}
      </div>
    </div>
  );
}

export default JoinMeeting;
=======
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import "font-awesome/css/font-awesome.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./JoinMeeting.css";

function JoinMeeting({ socket }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (!socket) {
      console.error("Socket not initialized");
      return;
    }

    // Join the room
    socket.emit("joinRoom", id);

    // Listen for updates from the server
    socket.on("roomParticipants", (updatedParticipants) => {
      setParticipants(updatedParticipants);
    });

    return () => {
      socket.emit("leaveRoom", id);
      socket.disconnect();
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
      setIsScreenSharing(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setIsScreenSharing(true);
      } catch (error) {
        console.error("Error starting screen share:", error);
      }
    }
  };

  const toggleHandRaise = () => {
    const newStatus = !isHandRaised;
    setIsHandRaised(newStatus);
    socket.emit("handRaise", { raised: newStatus });
  };

  return (
    <div className="join-meeting-page">
      <h1>Meeting ID: {id}</h1>

      <div className="video-container">
        <div className="controls-container">
          {/* Participants Icon */}
          <button className="control-button participants-button">
            <i className="fa fa-users"></i>
            <span className="participants-count">{participants.length}</span>
          </button>

          {/* Microphone Toggle */}
          <button onClick={toggleMic} className="control-button">
            <i className={`fa ${isMicOn ? "fa-microphone" : "fa-microphone-slash"}`}></i>
          </button>

          {/* Camera Toggle */}
          <button onClick={toggleCamera} className="control-button">
            <i className={`fa ${isCameraOn ? "fa-video" : "fa-video-slash"}`}></i>
          </button>

          {/* Screen Share */}
          <button onClick={handleScreenShare} className="control-button">
            <i className="fa fa-desktop"></i>
          </button>

          {/* Hand Raise */}
          <button onClick={toggleHandRaise} className="control-button">
            <i className={`fa ${isHandRaised ? "fa-hand-paper" : "fa-hand-rock"}`}></i>
          </button>

          {/* Exit Meeting */}
          <button onClick={handleExit} className="control-button">
            <i className="fa fa-sign-out"></i>
          </button>
        </div>

        {/* Video Stream */}
        {isCameraOn && <Webcam audio={isMicOn} />}
      </div>
    </div>
  );
}

export default JoinMeeting;
>>>>>>> 212cead2c884b7b83920a3fc34bfdf4b7399f59e
