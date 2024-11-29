import React, { useState, useEffect } from "react";
import axios from "axios";
import QuizPlay from "./QuizPlay"; // Component for playing the quiz
import { authHeader } from "../App";
import "../css/Quizzes.css"
import logo from "../components/quiz.jpg"

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]); // Store all quizzes
  const [selectedQuiz, setSelectedQuiz] = useState(null); // Store the selected quiz
  const [error, setError] = useState(""); // Store error messages
  const [loading, setLoading] = useState(false); // Show loader during data fetching
  const [quizCompleted, setQuizCompleted] = useState(false); // Flag for completed quiz
  const [scoreDetails, setScoreDetails] = useState(null); // Store score details
  const [likeStatus, setLikeStatus] = useState(null);
  const [notification, setNotification] = useState(""); // For notification message
  const [showNotification, setShowNotification] = useState(false); // Control visibility of the notification
  const [userScores, setUserScores] = useState([]);
  // Fetch quizzes when the component mounts
  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/quiz/all-with-status", {
          headers: { Authorization: authHeader() },
        });
    
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error("User is not authenticated.");
        }
    
        // Add `completed` status to each quiz
        const quizzesWithCompletionStatus = await Promise.all(
          response.data.map(async (quiz) => {
            try {
              const completionResponse = await axios.get(
                `http://localhost:8080/users/${quiz.id}/check-completion`,
                {
                  params: { userId },
                  headers: { Authorization: authHeader() },
                }
              );
              return { ...quiz, completed: completionResponse.data.completed };
            } catch (error) {
              console.error(`Error checking completion for quiz ${quiz.id}:`, error);
              return { ...quiz, completed: false }; // Default to false if error occurs
            }
          })
        );
    
        setQuizzes(quizzesWithCompletionStatus);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        setError("Failed to load quizzes. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    
    fetchQuizzes();
  }, []);

  // Handle quiz selection
  const handlePlayQuiz = async (quiz) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("User is not authenticated.");
        return;
      }
  
      // Check if the user has already completed the quiz
      const response = await axios.get(
        `http://localhost:8080/users/${quiz.id}/check-completion`,
        {
          params: { userId: userId },
          headers: { Authorization: authHeader() },
        }
      );
  
      if (response.data.completed) {
        setNotification(`You have already completed the quiz: ${quiz.title}`);
      } else {
        setSelectedQuiz(quiz); // Set the selected quiz if not completed
        setError(""); // Clear any previous errors
      }
     
    } catch (error) {
      console.error("Error checking quiz completion:", error);
      alert("An error occurred while checking quiz status. Please try again.");
    }
  };
  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      // Fetch all quizzes
      const response = await axios.get("http://localhost:8080/quiz/all-with-status", {
        headers: { Authorization: authHeader() },
      });
  
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User is not authenticated.");
      }
  
      // Fetch user's scores
      const scoresResponse = await axios.get(`http://localhost:8080/quiz/user/${userId}/scores`, {
        headers: { Authorization: authHeader() },
      });
  
      // Map scores to quiz IDs for easy lookup
      const scoresMap = scoresResponse.data.reduce((map, score) => {
        map[score.quiz.id] = score; // Use quiz ID as the key
        return map;
      }, {});
  
      // Combine quizzes with their completion and score data
      const quizzesWithCompletionStatus = await Promise.all(
        response.data.map(async (quiz) => {
          try {
            const completionResponse = await axios.get(
              `http://localhost:8080/users/${quiz.id}/check-completion`,
              {
                params: { userId },
                headers: { Authorization: authHeader() },
              }
            );
  
            return {
              ...quiz,
              completed: completionResponse.data.completed,
              score: scoresMap[quiz.id] || null, // Attach score if available
            };
          } catch (error) {
            console.error(`Error checking completion for quiz ${quiz.id}:`, error);
            return {
              ...quiz,
              completed: false, // Default to false if error occurs
              score: scoresMap[quiz.id] || null, // Attach score if available
            };
          }
        })
      );
  
      setQuizzes(quizzesWithCompletionStatus);
    } catch (error) {
      console.error("Error fetching quizzes or scores:", error);
      setError("Failed to load quizzes or scores. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchQuizzes();
  }, []);
  

  // Handle back to quizzes list
  const handleBackToQuizzes = () => {
    setSelectedQuiz(null); // Deselect the quiz
    setQuizCompleted(false); // Reset completion state
    setScoreDetails(null); // Reset score details
  };

  // Handle quiz completion
  const handleQuizComplete = (score, totalQuestions) => {
    setScoreDetails({ score, totalQuestions }); // Store score details
    setQuizCompleted(true); // Mark quiz as completed

    // Record the score in the database
    const recordScore = async () => {
      try {
        // Get the userId from localStorage
        const userId = localStorage.getItem("userId");
    
        if (!userId) {
          throw new Error("User is not authenticated. Cannot record score.");
        }
    
        // Send the score to the backend
        const response = await axios.post(
          `http://localhost:8080/quiz/${selectedQuiz.id}/score`,
          null,
          {
            params: {
              userId: userId, // Pass the userId correctly
              correctAnswers: score,
              totalQuestions: totalQuestions, // Use the variable passed from onComplete
            },
            headers: {
              Authorization: `Basic ${btoa(
                localStorage.getItem("authUsername") +
                  ":" +
                  localStorage.getItem("authPassword")
              )}`,
            },
          }
        );
    
        // Add a success message or callback for further actions
        console.log("Score recorded successfully:", response.data);
        alert("Your score has been recorded successfully!");
      } catch (error) {
        if (error.response?.status === 409) {
          // Handle the "User already completed this quiz!" error
          alert("You have already completed this quiz. You cannot play it again.");
        } else {
          // General error handling
          console.error("Error recording score:", error.response?.data || error.message);
          alert("An error occurred while recording your score. Please try again.");
        }
      }
    };
    recordScore();
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error("User is not authenticated.");
        }
  
        // Fetch quizzes and user scores in parallel
        const [quizzesResponse, scoresResponse] = await Promise.all([
          axios.get("http://localhost:8080/quiz/all-with-status", {
            headers: { Authorization: authHeader() },
          }),
          axios.get(`http://localhost:8080/quiz/user/${userId}/scores`, {
            headers: { Authorization: authHeader() },
          }),
        ]);
  
        // Map scores by quiz ID for easy merging
        const scoresMap = scoresResponse.data.reduce((map, score) => {
          map[score.quiz.id] = score;
          return map;
        }, {});
  
        // Merge scores into quizzes
        const quizzesWithScores = quizzesResponse.data.map((quiz) => ({
          ...quiz,
          score: scoresMap[quiz.id] || null, // Attach score or null if no score exists
          completed: !!scoresMap[quiz.id], // Mark as completed if a score exists
        }));
  
        setQuizzes(quizzesWithScores);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        setError("Failed to load quizzes. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchQuizzes();
  }, []);
  

  const handleFeedback = async (type) => {
    try {
      const endpoint =
        type === "like"
          ? `http://localhost:8080/quiz/${selectedQuiz.id}/like`
          : `http://localhost:8080/quiz/${selectedQuiz.id}/unlike`;
  
      const userId = localStorage.getItem("userId");
  
      if (!userId) {
        throw new Error("User is not authenticated.");
      }
  
      await axios.post(endpoint, null, {
        params: { userId: userId },
        headers: {
          Authorization: `Basic ${btoa(
            localStorage.getItem("authUsername") + ":" + localStorage.getItem("authPassword")
          )}`,
        },
      });
  
      setLikeStatus(type); // Update the like/unlike status
      alert(`Quiz ${type === "like" ? "liked" : "unliked"} successfully!`);
    } catch (error) {
      console.error(`Error submitting ${type} feedback:`, error.response?.data || error.message);
      alert(`Error submitting ${type} feedback.`);
    }
  };
  

 

  return (
    <div style={{ padding: "20px" }}>
      {/* If no quiz is selected and the quiz is not completed */}
      {!selectedQuiz && !quizCompleted && (
        <>
           <div className="quiz-header">
               <img
               src={logo}
               alt="Available Quizzes"
               className="quiz-logo"
             />
           </div>
         
  
           {loading && <p>Loading quizzes...</p>}
  
           {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
  
          {!loading && quizzes.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th >Difficulty</th>
                    <th >Status</th>
                    <th >Actions</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.map((quiz) => (
                    <tr key={quiz.id}>
                      <td style={{ border: "1px solid black", padding: "10px" }}>{quiz.title}</td>
                      <td style={{ border: "1px solid black", padding: "10px" }}>{quiz.category}</td>
                      <td style={{ border: "1px solid black", padding: "10px" }}>{quiz.difficulty}</td>
                      <td style={{ border: "1px solid black", padding: "10px", textAlign: "center" }}>
                        {quiz.status}
                      </td><td style={{ border: "1px solid black", padding: "10px", textAlign: "center" }}>
  {quiz.status === "ACTIVE" ? (
    <button
      onClick={() => handlePlayQuiz(quiz)}
      disabled={quiz.completed} // Disable button if completed
      style={{
        backgroundColor: quiz.completed ? "red" : "#4CAF50", // Red for completed, green for play
        color: "white",
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        cursor: quiz.completed ? "not-allowed" : "pointer", // Not-allowed cursor for disabled
        fontWeight: "bold",
        transition: "background-color 0.3s ease", // Smooth transition for background color
      }}
    >
      {quiz.completed ? "Quiz Completed" : "Play Quiz"}
    </button>
  ) : (
    <span style={{ color: "#888" }}>Not Available</span>
  )}
</td>
<td style={{ border: "1px solid black", padding: "10px", textAlign: "center" }}>
  {quiz.score ? `${quiz.score.correctAnswers}/${quiz.score.totalQuestions}` : "Not Attempted"}
</td>



                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !loading && <p>No quizzes available at the moment.</p>
          )}
        </>
      )}           

      {/* If a quiz is selected and is being played */}
      {selectedQuiz && !quizCompleted && (
        <>
          <button
            onClick={handleBackToQuizzes}
            style={{
              margin: "10px 0",
              backgroundColor: "#008CBA",
              color: "white",
              border: "none",
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            Back to Quizzes
          </button>
          <QuizPlay
            quizId={selectedQuiz.id}
            onComplete={handleQuizComplete} // Pass the completion handler
          />
        </>
      )}  {notification && (
        <div
          style={{
            position: "fixed",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "10px 20px",
            border: "1px solid #f5c6cb",
            borderRadius: "5px",
            zIndex: 1000,
            textAlign: "center", // Center the text within the notification
          }} >
          {notification}
          <button
            style={{
              marginLeft: "10px",
              background: "none",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={() => setNotification("")}
          >
            &times;
          </button>
        </div>
      )}
      
                
  
      {/* If the quiz is completed */}
      {quizCompleted && (
        <div>
          <h2>Quiz Completed!</h2>
          <p>Your final score: {scoreDetails.score}/{scoreDetails.totalQuestions} ({((scoreDetails.score / scoreDetails.totalQuestions) * 100).toFixed(2)}%)</p>
          <div style={{ marginTop: "20px" }}>
            <h3>Did you like this quiz?</h3>
            {!likeStatus ? (
              <div>
                <button
                  onClick={() => handleFeedback("like")}
                  style={{
                    margin: "5px",
                    padding: "10px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Like
                </button>
                <button
                  onClick={() => handleFeedback("unlike")}
                  style={{
                    margin: "5px",
                    padding: "10px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Unlike
                </button>
              </div>
            ) : (
              <p>
                Thank you for your feedback! You {likeStatus === "like" ? "liked" : "disliked"} this quiz.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
  
};

export default Quizzes;
