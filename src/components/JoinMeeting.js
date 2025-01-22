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
  const [stream, setStream] = useState(null);

  useEffect(() => {
    if (!socket) {
      console.error("Socket not initialized");
      return;
    }

    // Join the meeting room
    socket.emit("joinRoom", id);

    // Listen for updates on room participants
    socket.on("roomParticipants", (updatedParticipants) => {
      setParticipants(updatedParticipants);
    });

    // Start user media (camera + microphone)
    const startUserMedia = async () => {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(userStream);
      } catch (error) {
        console.error("Error accessing user media:", error);
      }
    };

    startUserMedia();

    return () => {
      // Leave the meeting room on cleanup
      socket.emit("leaveRoom", id);
      socket.disconnect();
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [id, socket, stream]);

  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) audioTrack.enabled = !isMicOn;
      setIsMicOn(!isMicOn);
    }
  };

  const toggleCamera = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) videoTrack.enabled = !isCameraOn;
      setIsCameraOn(!isCameraOn);
    }
  };

  const handleScreenShare = async () => {
    if (isScreenSharing) {
      setIsScreenSharing(false);
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        setStream(screenStream);
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

  const handleExit = () => {
    navigate("/");
  };

  return (
    <div className="join-meeting-page">
      <h1>Meeting ID: {id}</h1>
      <div className="video-container">
        {/* Display participants */}
        <div className="participants-list">
          <h2>Participants ({participants.length})</h2>
          <ul>
            {participants.map((participant) => (
              <li key={participant.id}>{participant.name}</li>
            ))}
          </ul>
        </div>

        {/* User video stream */}
        <div className="user-video">
          {stream && isCameraOn && <Webcam audio={isMicOn} />}
        </div>

        {/* Meeting controls */}
        <div className="controls-container">
          {/* Microphone toggle */}
          <button onClick={toggleMic} className="control-button">
            <i className={`fa ${isMicOn ? "fa-microphone" : "fa-microphone-slash"}`} />
          </button>

          {/* Camera toggle */}
          <button onClick={toggleCamera} className="control-button">
            <i className={`fa ${isCameraOn ? "fa-video" : "fa-video-slash"}`} />
          </button>

          {/* Screen share */}
          <button onClick={handleScreenShare} className="control-button">
            <i className={`fa ${isScreenSharing ? "fa-stop" : "fa-desktop"}`} />
          </button>

          {/* Hand raise */}
          <button onClick={toggleHandRaise} className="control-button">
            <i className={`fa ${isHandRaised ? "fa-hand-paper" : "fa-hand-rock"}`} />
          </button>

          {/* Exit meeting */}
          <button onClick={handleExit} className="control-button">
            <i className="fa fa-sign-out" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default JoinMeeting;
