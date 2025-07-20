import { useEffect, useState } from "react";
import axios from "axios";

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/meetings/")
      .then((response) => {
        setMeetings(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching meetings:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading meetings...</p>;

  return (
    <div>
      <h1>📅 Meetings</h1>
      {meetings.length === 0 ? (
        <p>No meetings found.</p>
      ) : (
        <ul>
          {meetings.map((meeting) => (
            <li key={meeting.id}>
              <strong>{meeting.topic}</strong> —{" "}
              {new Date(meeting.date).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Meetings;
