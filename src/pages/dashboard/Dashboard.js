import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    
    if (!userId) {
      navigate("/login");
      return;
    }
    
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user data", err);
        setError("Failed to fetch user data");
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

  if (loading) return <div className="loading cool-loading">Loading...</div>;
  if (error) return <div className="error cool-error">{error}</div>;

  const maxCredits = 1000;
  const creditPercentage = (user?.credits / maxCredits) * 100;

  return (
    <div className="dashboard-container cool-dashboard">
      <div className="dashboard-image cool-image">
        <div className="image-overlay">
          <h1 className="dashboard-title">
            <span className="title-text">AI SKILLCONNECT</span>
            <div className="title-orbit">
              <span className="orbit-particle particle-1"></span>
              <span className="orbit-particle particle-2"></span>
              <span className="orbit-particle particle-3"></span>
              <span className="orbit-particle particle-4"></span>
              <span className="orbit-particle particle-5"></span>
            </div>
          </h1>
        </div>
      </div>

      <div className="dashboard-details cool-details">
        <button className="logout-btn cool-logout" onClick={handleLogout} title="Logout">
          <span className="logout-icon">✨</span>
          <span className="logout-text">Logout</span>
        </button>

        <div className="welcome-section">
          <h2 className="welcome-text">Hey {user?.name}! 👋</h2>
          <div className="credits-circle">
            <svg className="progress-ring" width="120" height="120">
              <circle className="progress-ring__circle-bg" stroke="#e0e0e0" cx="60" cy="60" r="54" />
              <circle
                className="progress-ring__circle"
                stroke="#00d4ff"
                cx="60"
                cy="60"
                r="54"
                style={{ strokeDasharray: 339.292, strokeDashoffset: 339.292 - (339.292 * creditPercentage) / 100 }}
              />
            </svg>
            <div className="credits-text">
              <span>{user?.credits}</span>
              <small>Credits</small>
            </div>
          </div>
        </div>

        <div className="user-info cool-info">
          <div className="info-card"><span className="info-label">Email</span><span className="info-value">{user?.email}</span></div>
          <div className="info-card"><span className="info-label">Mobile</span><span className="info-value">{user?.mobile}</span></div>
          <div className="info-card"><span className="info-label">Title</span><span className="info-value">{user?.title}</span></div>
          <div className="info-card"><span className="info-label">Address</span><span className="info-value">{user?.address}</span></div>
        </div>

        <div className="skills-section cool-skills">
          <h3>Your Skills:</h3>
          {user?.skills && user.skills.length > 0 ? (
            <div className="skills-grid">
              {user.skills.map((skill, index) => (
                <span key={index} className="skill-badge cool-badge">{skill}</span>
              ))}
            </div>
          ) : (
            <p className="no-skills">Add some skills to shine! 🌟 </p>
          )}
          <br/>
        </div>
          
        <div className="dashboard-tiles cool-tiles">
          
          <div className="tile" onClick={() => navigate("/detect-skills")}>
            
            <span className="tile-icon">⚡</span><span>Update Skills</span>
          </div>
          <div className="tile" onClick={() => navigate("/match-skills")}>
            <span className="tile-icon">🤝</span><span>Find Matches</span>
          </div>
          <div className="tile" onClick={() => navigate("/skills-validate")}>
            <span className="tile-icon">✅</span><span>Validate Skills</span>
          </div>
          <div className="tile" onClick={() => navigate("/chat")}> {/* Updated to general chat */}
            <span className="tile-icon">💬</span><span>Chat</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;