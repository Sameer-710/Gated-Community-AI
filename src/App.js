import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import SkillDetection from "./pages/SkillDetection/SkillDetection";
import SkillMatching from "./pages/SkillMatching/SkillMatching";
import SkillValidation from "./pages/SkillValidation/SkillValidation";
import ChatPage from "./pages/chat/Chat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} /> {}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/detect-skills" element={<SkillDetection />} />
        <Route path="/match-skills" element={<SkillMatching />} />
        <Route path="/skills-validate" element={<SkillValidation />} />
        <Route path="/chat" element={<ChatPage />} /> {}
        <Route path="/chat/:userId" element={<ChatPage />} /> {}

      </Routes>
    </Router>
  );
}

export default App;
