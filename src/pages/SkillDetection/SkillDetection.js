import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import './SkillDetection.css';

const SkillDetection = () => {
  const [paragraph, setParagraph] = useState("");
  const [skills, setSkills] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    if (!storedUserId) {
      alert("User not logged in");
    } else {
      setUserId(storedUserId);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("User not logged in");
      return;
    }

    setLoading(true);
    try {
      console.log("Sending request with:", { userId, paragraph });

      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/skills/detect`,
        { userId, paragraph }
      );

      console.log("Response received:", res.data);

      if (res.data.success) {
        setSkills(res.data.skills);
      } else {
        alert("Failed to detect skills. Try again.");
      }
    } catch (error) {
      console.error("Skill detection error:", error.response?.data || error.message);
      alert("Error detecting skills. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Navigate to Dashboard
  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="skill-container skill-cool">
      {/* Animated Background Particles */}
      <div className="skill-particles"></div>

      {/* Navigation Bar */}
      <nav className="skill-nav">
        <button className="skill-nav-button" onClick={handleDashboardClick}>
          Dashboard
        </button>
      </nav>

      {/* Main Content */}
      <div className="skill-box skill-cool-box">
        <h2 className="skill-title">
          <span className="skill-ai-gradient">Skill</span> Detection
        </h2>
        <p className="skill-subtitle">Unleash your talents with AI analysis</p>

        <form onSubmit={handleSubmit} className="skill-cool-form">
          <div className="skill-input-group">
            <textarea
              placeholder="Enter a description of your skills..."
              value={paragraph}
              onChange={(e) => setParagraph(e.target.value)}
              required
              className="skill-cool-textarea"
            />
            <span className="skill-input-icon">✍️</span>
          </div>

          <button type="submit" className="skill-cool-button" disabled={loading}>
            <span>{loading ? "Scanning..." : "Detect Skills"}</span>
            <span className="skill-button-effect"></span>
          </button>
        </form>

        {skills.length > 0 && (
          <div className="skill-results">
            <h3 className="skill-results-title">Detected Skills:</h3>
            <ul className="skill-results-list">
              {skills.map((skill, index) => (
                <li key={index} className="skill-result-item">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Decorative Orbit Rings */}
        <div className="skill-decor">
          <div className="skill-orbit-ring"></div>
          <div className="skill-orbit-ring skill-ring-2"></div>
        </div>
      </div>
    </div>
  );
};

export default SkillDetection;