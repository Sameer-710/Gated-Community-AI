import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import './SkillValidation.css';

const SkillValidation = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState({});
  const navigate = useNavigate(); 

  const fetchQuestions = async () => {
    setLoading(true);
    setSubmitted(false);
    setScore(null);
    setFeedback({});
    
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("User not logged in");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/skills/generate`, { userId });

      if (res.data.success) {
        console.log("Generated Questions:", res.data.questions);
        setQuestions(res.data.questions || []);
        setAnswers({});
      } else {
        alert("Failed to generate questions.");
      }
    } catch (error) {
      console.error("Error fetching questions:", error.response?.data || error.message);
      alert("Error generating questions. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("User not logged in");
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/skills/validate-answers`, { userId, answers });

      if (res.data.success) {
        setScore(res.data.score);
        setSubmitted(true);
        
        
        const feedbackData = {};
        
        if (res.data.questionResults) {
          
          res.data.questionResults.forEach(result => {
            feedbackData[result.question] = {
              userAnswer: result.userAnswer,
              correctAnswer: result.correctAnswer,
              isCorrect: result.isCorrect
            };
          });
        } else {
          
          try {
            const appData = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/skills/questions/${userId}`);
            if (appData.data.success && appData.data.questions) {
              appData.data.questions.forEach(q => {
                const userAnswer = answers[q.question];
                const selectedOptionLetter = userAnswer?.split(".")[0].trim();
                feedbackData[q.question] = {
                  userAnswer: userAnswer,
                  correctAnswer: q.correct_answer,
                  isCorrect: selectedOptionLetter === q.correct_answer
                };
              });
            }
          } catch (err) {
            console.error("Error fetching question details for feedback:", err);
          }
        }
        
        setFeedback(feedbackData);
        alert(`Your score is ${res.data.score}. Credits updated.`);
      } else {
        alert("Failed to validate answers.");
      }
    } catch (error) {
      console.error("Error validating answers:", error.response?.data || error.message);
      alert("Error validating answers. Check console for details.");
    }
  };

  const getOptionClass = (question, option) => {
    if (!submitted || !feedback[question]) return "validate-option-text";
    
    const optionLetter = option.split(".")[0].trim();
    const correctAnswer = feedback[question].correctAnswer;
    const userAnswer = answers[question]?.split(".")[0].trim();
    
    if (optionLetter === correctAnswer) {
      return "validate-option-text validate-correct";
    } else if (optionLetter === userAnswer) {
      return "validate-option-text validate-incorrect";
    }
    return "validate-option-text";
  };

  // Navigate to Dashboard
  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="validate-container validate-cool">
      {/* Animated Background Particles */}
      <div className="validate-particles"></div>

      {/* Navigation Bar */}
      <nav className="validate-nav">
        <button className="validate-nav-button" onClick={handleDashboardClick}>
          Dashboard
        </button>
      </nav>

      {/* Main Content */}
      <div className="validate-box validate-cool-box">
        <h2 className="validate-title">
          <span className="validate-ai-gradient">Skill</span> Validation
        </h2>
        <p className="validate-subtitle">Prove your expertise</p>

        <button
          onClick={fetchQuestions}
          className="validate-cool-button"
          disabled={loading}
        >
          <span>{loading ? "Generating..." : "Generate Questions"}</span>
          <span className="validate-button-effect"></span>
        </button>

        {questions.length > 0 && (
          <form onSubmit={handleSubmit} className="validate-cool-form">
            {questions.map((q, index) => (
              <div key={index} className="validate-question-card">
                <p className="validate-question-text">{q.question}</p>
                <div className="validate-options">
                  {q.options.map((option, optIndex) => (
                    <label key={optIndex} className="validate-option-label">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        onChange={(e) => setAnswers({ ...answers, [q.question]: e.target.value })}
                        className="validate-radio"
                        disabled={submitted}
                      />
                      <span className={getOptionClass(q.question, option)}>
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
                {submitted && feedback[q.question] && (
                  <div className="validate-answer-feedback">
                    {feedback[q.question].isCorrect ? (
                      <p className="validate-correct-message">Correct!</p>
                    ) : (
                      <p className="validate-incorrect-message">
                        Incorrect. The correct answer is: <span>{feedback[q.question].correctAnswer} </span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
            <button 
              type="submit" 
              className="validate-cool-button validate-submit"
              disabled={submitted}
            >
              <span>Submit Answers</span>
              <span className="validate-button-effect"></span>
            </button>
          </form>
        )}

        {score !== null && (
          <div className="validate-score">
            <h3 className="validate-score-title">Your Score: {score}</h3>
          </div>
        )}

        {/* Decorative Orbit Rings */}
        <div className="validate-decor">
          <div className="validate-orbit-ring"></div>
          <div className="validate-orbit-ring validate-ring-2"></div>
        </div>
      </div>
    </div>
  );
};

export default SkillValidation;