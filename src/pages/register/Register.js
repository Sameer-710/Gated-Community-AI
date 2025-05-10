import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './Register.css';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [credits] = useState(10);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/register`, {
        name,
        email,
        password,
        mobile,
        title,
        address,
        credits,
      });

      if (res.status === 201) {
        setMessage("Registration successful! Warping to login...");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
      console.error("Error during registration:", err);
    }
  };

  return (
    <div className="register-container cool-register">
      {/* Animated Background Particles */}
      <div className="particles"></div>

      {/* Platform Explanation Section */}
      <div className="platform-explanation cool-explanation">
        <h1 className="platform-title">
          <span className="ai-gradient">AI</span> SKILLCONNECT
        </h1>
        <p>
          AI SkillConnect is a revolutionary web and mobile application designed to foster collaboration within gated communities.
           Our platform allows users to exchange skills, helping each other complete tasks efficiently. Whether you need a handyman,
           a tutor, or a designer, AI SkillConnect connects you with skilled individuals nearby. 
         </p>
         <p>
           Register now to join a community where your skills are valued and your needs are met.
         </p>
        <div className="feature-bubbles">
          <div className="bubble">Skill Exchange</div>
          <div className="bubble">Community Bonding</div>
          <div className="bubble">AI-Powered Matches</div>
        </div>
      </div>

      {/* Registration Form Section */}
      <div className="register-box cool-box">
        <h2 className="register-title">Join the Network</h2>
        {message && <p className={`message ${message.includes("successful") ? "success" : "error"}`}>{message}</p>}
        
        <form onSubmit={handleRegister} className="cool-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="cool-input"
            />
            <span className="input-icon">👤</span>
          </div>
          
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="cool-input"
            />
            <span className="input-icon">✉️</span>
          </div>
          
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="cool-input"
            />
            <span className="input-icon">🔒</span>
          </div>
          
          <div className="input-group">
            <input
              type="text"
              placeholder="Mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="cool-input"
            />
            <span className="input-icon">📱</span>
          </div>
          
          <div className="input-group">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="cool-input"
            />
            <span className="input-icon">🏷️</span>
          </div>
          
          <div className="input-group">
            <textarea
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="cool-textarea"
            />
            <span className="input-icon">📍</span>
          </div>

          <button type="submit" className="cool-button">
            <span>Launch Profile</span>
            <span className="button-effect"></span>
          </button>
        </form>

        <p className="login-link">
          Already connected? <Link to="/login" className="cool-link">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

