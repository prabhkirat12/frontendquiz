import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios only once
import axiosRetry from "axios-retry"; // Import axios-retry

// Configure axios-retry to use with the axios instance
axiosRetry(axios, { retries: 3 });

const QuizPlay = ({ quizId, userId, onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [likeStatus, setLikeStatus] = useState(null); // Track like/unlike status
  const decodeHtmlEntities = (text) => {
    if (!text) return text;
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    return doc.documentElement.textContent;
};

  // Fetch questions when the component mounts
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/quiz/${quizId}/play`);
        console.log("API Response:", response.data); // Debugging API response

        if (response.data && response.data.results) {
          const formattedQuestions = response.data.results.map((question) => ({
              question: decodeHtmlEntities(question.question) || "Untitled Question", // Decode question
              correctAnswer: decodeHtmlEntities(question.correct_answer), // Decode correct answer
              options: [
                  ...question.incorrect_answers.map(decodeHtmlEntities), // Decode incorrect answers
                  decodeHtmlEntities(question.correct_answer),
              ].sort(() => Math.random() - 0.5), // Shuffle options
          }));

          setQuestions(formattedQuestions); // Store the formatted questions in state
      }
  } catch (error) {
      console.error("Error fetching quiz questions:", error);
  } finally {
      setLoading(false); // Stop loading once the request is done
  }
};

    if (quizId) {
      fetchQuestions(); // Only fetch if quizId is available
    } else {
      console.error("Quiz ID is missing");
      setLoading(false); // Stop loading if quizId is missing
    }
  }, [quizId]); // Fetch whenever quizId changes

  const handleAnswerSubmit = (answer) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    const isCorrect = answer === currentQuestion.correctAnswer;
    setSelectedAnswer(answer);

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
      setFeedback("Correct!");
    } else {
      setFeedback(`Wrong! The correct answer is: ${currentQuestion.correctAnswer}`);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedAnswer(null);
      setFeedback("");
    } else {
      setQuizCompleted(true);
      onComplete(score, questions.length); // Pass totalQuestions

    }
  };
   const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <h2>Question {currentQuestionIndex + 1}:</h2>
      <h3>{currentQuestion?.question || "No question available"}</h3>
      <div>
        {currentQuestion?.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSubmit(option)}
            style={{
              margin: "5px",
              padding: "10px",
              backgroundColor:
                selectedAnswer === option
                  ? option === currentQuestion.correctAnswer
                    ? "green"
                    : "red"
                  : "#007BFF",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
            disabled={!!selectedAnswer}
          >
            {option}
          </button>
        ))}
      </div>
      {feedback && <p>{feedback}</p>}
      {selectedAnswer && (
        <button onClick={handleNextQuestion} style={{ marginTop: "20px" }}>
          {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Complete Quiz"}
        </button>
      )}
      <p>Score: {score}</p>
    </div>
  );
};

export default QuizPlay;
