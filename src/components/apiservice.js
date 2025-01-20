import axios from "axios";

const API_URL = "http://localhost:5000"; // Backend URL

// Fetch all meetings
export const getMeetings = async () => {
  try {
    const response = await axios.get(`${API_URL}/meetings`);
    return response.data;
  } catch (error) {
    console.error("Error fetching meetings:", error);
    throw error;
  }
};

// Create a new meeting
export const createMeeting = async (meeting) => {
  try {
    const response = await axios.post(`${API_URL}/meetings`, meeting, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } 
  catch (error) {
    console.error("API error creating meeting:", error.response || error);
    throw error;
  }

};
