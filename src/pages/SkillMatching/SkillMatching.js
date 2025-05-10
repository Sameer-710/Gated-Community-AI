import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


import "./SkillMatching.css";



const SkillMatching = () => {
  const [paragraph, setParagraph] = useState("");
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [hoveredUser, setHoveredUser] = useState(null);
  const [credits, setCredits] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  

  const findMatchingUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/skills/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paragraph }),
      });

      const data = await response.json();
      if (data.success) {
        setMatchedUsers(data.matches);
        setCredits(
          data.matches.reduce((acc, user) => ({ ...acc, [user._id]: 1 }), {}) 
        );
      } else {
        setMatchedUsers([]);
      }
    } catch (error) {
      console.error("Error finding users:", error);
      setMatchedUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const updateCredits = async (userId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/skills/update-credits/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credits: credits[userId] }),
      });
  
      if (!response.ok) throw new Error("Failed to update credits");
  
      const data = await response.json();
  
      
      setMatchedUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, credits: user.credits + credits[userId] } : user
        )
      );
  
      console.log("Credits updated successfully:", data);
    } catch (error) {
      console.error("Error updating credits:", error);
    }
  };
  

  const startChat = (user) => {
    navigate(`/chat/${user._id}`);
  };

  
  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="match-container match-cool">
      <div className="match-particles"></div>
      {/* Navigation Bar */}
      <nav className="match-nav">
        <button className="match-nav-button" onClick={handleDashboardClick}>
          Dashboard
        </button>
      </nav>
      <div className="match-box match-cool-box">
        <h3 className="match-title">
          <span className="match-ai-gradient">Skill</span> Matching
        </h3>
        <p className="match-subtitle">Discover your skill allies</p>

        <div className="match-input-section">
          <div className="match-input-group">
            <input
              type="text"
              value={paragraph}
              onChange={(e) => setParagraph(e.target.value)}
              placeholder="Enter skills or project description..."
              className="match-cool-input"
            />
            <span className="match-input-icon">🔍</span>
          </div>
          <button
            onClick={findMatchingUsers}
            className="match-cool-button"
            disabled={loading}
          >
            <span>{loading ? "Searching..." : "Find Matches"}</span>
            <span className="match-button-effect"></span>
          </button>
        </div>

        {matchedUsers.length > 0 ? (
          <div className="match-users-grid">
            {matchedUsers.map((user) => (
              <div
                key={user._id}
                className={`match-user-card ${hoveredUser === user._id ? "match-expanded" : ""}`}
                onMouseEnter={() => setHoveredUser(user._id)}
                onMouseLeave={() => setHoveredUser(null)}
              >
                <h4 className="match-user-name">{user.name}</h4>
                <p className="match-user-skills">
                  <span className="match-skills-label">Skills:</span>{" "}
                  {user.skills?.join(", ") || "N/A"}
                </p>
                {hoveredUser === user._id && (
                  <div className="match-expanded-details">
                    <p><span className="match-detail-label">Email:</span> {user.email}</p>
                    <p><span className="match-detail-label">Mobile No.:</span> {user.mobile}</p>
                    <p><span className="match-detail-label">Credits:</span> {user.credits}</p>
                    <div className="match-credits-input">
                      <select
                        value={credits[user._id]}
                        onChange={(e) =>
                          setCredits({ ...credits, [user._id]: parseInt(e.target.value, 10) })
                        }
                        className="match-credits-field"
                      >
                        {[...Array(20)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => updateCredits(user._id)}
                        className="match-action-button"
                      >
                        Update
                      </button>
                    </div>
                    <button
                      onClick={() => startChat(user)}
                      className="match-action-button match-chat-button"
                    >
                      Chat
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="match-no-results">
            {loading ? "Scanning network..." : "No matching users found."}
          </p>
        )}

        <div className="match-decor">
          <div className="match-orbit-ring"></div>
          <div className="match-orbit-ring match-ring-2"></div>
        </div>
      </div>
    </div>
  );
};

export default SkillMatching;