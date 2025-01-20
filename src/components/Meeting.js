import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import io from "socket.io-client";
import JoinMeeting from "../components/JoinMeeting"; // Update path
import "./Meeting.css";

function App() {
  const [meetings, setMeetings] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [showMeetings, setShowMeetings] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5001/meetings")
      .then((response) => setMeetings(response.data))
      .catch((error) => console.error("Error fetching meetings:", error));

    const socketConnection = io("http://localhost:5001");
    setSocket(socketConnection);

    return () => {
      if (socketConnection) socketConnection.disconnect();
    };
  }, []);

  const createMeeting = (e) => {
  e.preventDefault();
  axios
    .post("http://localhost:5001/meetings", { title, date })
    .then((response) => {
      setMeetings([...meetings, response.data.meeting]);
      setTitle("");
      setDate("");
      setMessage(`Meeting created successfully. Share this link: ${response.data.meetingLink}`);
    })
    .catch((error) => console.error("Error creating meeting:", error));
};


  const removeMeeting = (id) => {
    axios
      .delete(`http://localhost:5001/meetings/${id}`)
      .then(() => {
        setMeetings(meetings.filter((meeting) => meeting._id !== id));
        setMessage("Meeting removed successfully");
      })
      .catch((error) => console.error("Error removing meeting:", error));
  };

  const toggleMeetingsVisibility = () => {
    setShowMeetings(!showMeetings);
  };

  return (
    <Router>
      <div>
        <h1>Quick Connect</h1>
        <h2>Create a Meeting</h2>
        <form onSubmit={createMeeting}>
          <input
            type="text"
            placeholder="Meeting Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <button type="submit">Create Meeting</button>
        </form>
        {message && <p>{message}</p>}

        <button onClick={toggleMeetingsVisibility}>
          {showMeetings ? "Hide All Meetings" : "Show All Meetings"}
        </button>

        {showMeetings && (
          <div>
            <h2>All Meetings</h2>
            <ul>
              {meetings.map((meeting) => (
                <li key={meeting._id}>
                  <strong>{meeting.title}</strong> - {new Date(meeting.date).toLocaleString()}
                  <Link to={`/join-meeting/${meeting._id}`}>
                    <button>Join Meeting</button>
                  </Link>
                  <button onClick={() => removeMeeting(meeting._id)}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Routes>
          <Route path="/join-meeting/:id" element={<JoinMeeting socket={socket} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
