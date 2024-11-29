/*import React, { useState, useEffect } from "react";
import axios from "../api"; // Adjust this path based on your project structure


const MCQQuiz = ({ quizId }) => {
  const [questions, setQuestions] = useState([]); // Store quiz questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track the current question
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Track the selected answer
  const [score, setScore] = useState(0); // Track the score
  const [feedback, setFeedback] = useState(""); // Feedback for the user
  const [isQuizCompleted, setIsQuizCompleted] = useState(false); // Track if quiz is completed

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/quiz/${quizId}/play`
        );
        setQuestions(response.data.results); // Assuming "results" contains the questions
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
      }
    };

    fetchQuestions();
  }, [quizId]);

  const handleAnswerSelection = (answer) => {
    const currentQuestion = questions[currentQuestionIndex];
    setSelectedAnswer(answer);

    if (answer === currentQuestion.correct_answer) {
      setFeedback("Correct!");
      setScore(score + 1); // Increment score if correct
    } else {
      setFeedback(`Wrong! The correct answer was: ${currentQuestion.correct_answer}`);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setFeedback("");
    } else {
      setIsQuizCompleted(true);
    }
  };

  if (isQuizCompleted) {
    return (
      <div>
        <h2>Quiz Completed!</h2>
        <p>Your final score is: {score}/{questions.length}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return <p>Loading questions...</p>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <h2>MCQ Quiz</h2>
      <div>
        <h3>
          Q{currentQuestionIndex + 1}: {currentQuestion.question}
        </h3>
        <div>
          {[...currentQuestion.incorrect_answers, currentQuestion.correct_answer]
            .sort() // Shuffle the options
            .map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelection(option)}
                style={{
                  display: "block",
                  margin: "10px 0",
                  padding: "10px",
                  backgroundColor:
                    selectedAnswer === option
                      ? option === currentQuestion.correct_answer
                        ? "green"
                        : "red"
                      : "#007BFF",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
                disabled={!!selectedAnswer} // Disable buttons after selecting
              >
                {option}
              </button>
            ))}
        </div>
        {feedback && <p style={{ marginTop: "10px" }}>{feedback}</p>}
        {selectedAnswer && (
          <button onClick={handleNextQuestion} style={{ marginTop: "20px" }}>
            Next Question
          </button>
        )}
      </div>
    </div>
  );
};

export default MCQQuiz;*/
