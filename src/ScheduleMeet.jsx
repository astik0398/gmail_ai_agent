import React, { useState } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [meetLink, setMeetLink] = useState("");
  const [error, setError] = useState("");

  const handleAuth = () => {
    window.location.href = "http://localhost:8000/auth";
  };

  const scheduleMeeting = async () => {
    setMeetLink("");
    setError("");

    if (!email) {
      setError("Please enter an email address.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/schedule-meet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.meetLink) {
        setMeetLink(data.meetLink);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Error scheduling meeting.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Google Meet Scheduler</h2>

      <button style={styles.authButton} onClick={handleAuth}>
        Authenticate with Google
      </button>

      <input
        type="email"
        placeholder="Enter attendee email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />

      <button style={styles.scheduleButton} onClick={scheduleMeeting}>
        Schedule a Meet
      </button>

      {meetLink && (
  <div style={styles.card}>
    <h3 style={styles.cardTitle}>Meeting Scheduled ✅</h3>
    <p><strong>Title:</strong> Scheduled Meeting</p>
    <p><strong>Description:</strong> This is an auto-scheduled Google Meet.</p>
    <p><strong>Time:</strong> 1 hour from now (1-hour duration)</p>
    <button
      style={styles.joinButton}
      onClick={() => window.open(meetLink, "_blank")}
    >
      Join Meet
    </button>
  </div>
)}


      {error && <p style={styles.error}>Error: {error}</p>}
    </div>
  );
}

const styles = {
  joinButton: {
    marginTop: 15,
    padding: "10px 20px",
    backgroundColor: "#0F9D58", // Google Meet green
    color: "white",
    fontSize: 16,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out",
  },
  joinButtonHover: {
    backgroundColor: "#0c7c43",
  },
  
  container: {
    fontFamily: "sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#f4f4f4",
    minHeight: "100vh",
  },
  input: {
    padding: 10,
    fontSize: 16,
    margin: 10,
    width: 300,
  },
  authButton: {
    padding: "10px 20px",
    fontSize: 16,
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    marginBottom: 20,
    cursor: "pointer",
  },
  scheduleButton: {
    padding: "10px 20px",
    fontSize: 16,
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
  success: {
    marginTop: 20,
    color: "green",
  },
  error: {
    marginTop: 20,
    color: "red",
  },
  card: {
    marginTop: 30,
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    width: "90%",
    maxWidth: 500,
    textAlign: "left",
    color: "#333",
    lineHeight: 1.6,
  },
  
  cardTitle: {
    marginBottom: 10,
    fontSize: "1.2rem",
    color: "#007bff",
    fontWeight: "bold",
  }
  
};

export default App;
