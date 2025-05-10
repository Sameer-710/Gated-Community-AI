import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
        email,
        password,
      });

      console.log("Full login response:", res.data);

      if (res.data.success) {
        const userId = res.data.user?.userId;
        console.log("Extracted User ID:", userId);

        if (!userId) {
          setMessage("User ID is missing from the response.");
          return;
        }

        localStorage.setItem("userId", userId);
        localStorage.setItem("token", res.data.token);

        setMessage("Access granted! Warping to dashboard...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      } else {
        setMessage(res.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Access denied.");
    }
  };

  return (
    <div className="login-container login-cool">
      {/* Animated Background Particles */}
      <div className="login-particles"></div>

      {/* Login Box */}
      <div className="login-box login-cool-box">
        <h2 className="login-title">
          <span className="login-ai-gradient">AI</span> SKILLCONNECT
        </h2>
        <p className="login-subtitle">Enter the skill-sharing universe</p>
        
        {message && (
          <p className={`login-message ${message.includes("granted") ? "login-success" : "login-error"}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleLogin} className="login-cool-form">
          <div className="login-input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-cool-input"
            />
            <span className="login-input-icon">✉️</span>
          </div>

          <div className="login-input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-cool-input"
            />
            <span className="login-input-icon">🔒</span>
          </div>

          <button type="submit" className="login-cool-button">
            <span>Access Portal</span>
            <span className="login-button-effect"></span>
          </button>
        </form>

        <p className="login-register-link">
          New to the network? <Link to="/register" className="login-cool-link">Register here</Link>
        </p>

        {/* Decorative Elements */}
        <div className="login-decor">
          <div className="login-orbit-ring"></div>
          <div className="login-orbit-ring login-ring-2"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;