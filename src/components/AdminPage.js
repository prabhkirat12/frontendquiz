import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { authHeader } from "../App"; // Import the authHeader function
import "../css/AdminPage.css"
const AdminPage = ({ handleLogout }) => {
  
  const [quizzes, setQuizzes] = useState([]);
  const [users, setUsers] = useState([]);
  const [quizId, setQuizId] = useState(""); // To store the Quiz ID input
  const [quizParticipants, setQuizParticipants] = useState([]);
  const [activeSection, setActiveSection] = useState("quizzes");
  const [notification, setNotification] = useState(""); // For notification message
const [showNotification, setShowNotification] = useState(false); // Control visibility of the notification

  const [categories, setCategories] = useState([]);
  const [newQuiz, setNewQuiz] = useState({
    title: "",
    questionCount: "",
    category: "",
    difficulty: "",
    startDate: "",
    endDate: "",
    createdBy: localStorage.getItem("authUsername") || "adminUser",
  });
  const [editQuiz, setEditQuiz] = useState(null); 
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [error, setError] = useState(""); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading spinner
  const [quizScores, setQuizScores] = useState([]); // State to store quiz scores
  const [showCreateQuizForm, setShowCreateQuizForm] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);


  const navigate = useNavigate();

  // Fetch categories on component load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const header = authHeader();
        if (!header) {
          alert("Authorization header is missing. Please log in again.");
          navigate("/");
          return;
        }

        const response = await axios.get("http://localhost:8080/quiz/categories", {
          headers: {
            Authorization: header,
          },
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        alert("Failed to load categories. Please try again.");
      }
    };

    fetchCategories();
  }, [navigate]);

  // Fetch quizzes
  const handleQuizzesClick = async () => {
    setActiveSection("quizzes"); // Set active section to "quizzes"
    resetStateExcept("quizzes");
    setActiveSection("quizzes");
    try {
      const header = authHeader();
      if (!header) {
        alert("Authorization header is missing. Please log in again.");
        navigate("/");
        return;
      }

      const response = await axios.get("http://localhost:8080/quiz/all", {
        headers: {
          Authorization: header,
        },
      });
      setQuizzes(response.data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      alert("Failed to fetch quizzes.");
    }
  };

  // Fetch users
  const handleUsersClick = async () => {
    setActiveSection("users"); // Set active section to "users"
    resetStateExcept("users");
    setActiveSection("users");
    try {
      const header = authHeader();
      if (!header) {
        alert("Authorization header is missing. Please log in again.");
        navigate("/");
        return;
      }

      const response = await axios.get("http://localhost:8080/users", {
        headers: {
          Authorization: header,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to fetch users.");
    }
  };

  // Create new quiz
  const handleCreateQuizClick = async (e) => {
    e.preventDefault();

    try {
      const header = authHeader();
      if (!header) {
        alert("Authorization header is missing. Please log in again.");
        navigate("/");
        return;
      }

      await axios.post("http://localhost:8080/quiz/create", newQuiz, {
        headers: {
          Authorization: header,
          "Content-Type": "application/json",
        },
      });

      alert("Quiz created successfully!");
      setNewQuiz({
        title: "",
        questionCount: "",
        category: "",
        difficulty: "",
        startDate: "",
        endDate: "",
        createdBy: localStorage.getItem("authUsername") || "adminUser",
      });
      handleQuizzesClick(); // Refresh quizzes
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Failed to create quiz.");
    }
  };

  // Update quiz
  const handleUpdateQuiz = async () => {
    try {
      const header = authHeader(); // Get the Authorization header
      if (!header) {
        alert("Authorization header is missing. Please log in again.");
        navigate("/");
        return;
      }
  
      console.log("Updating Quiz:", editQuiz); // Debug the quiz data
  
      // Constructing the updates as a key-value map
      const updates = {
        title: editQuiz.title, // Ensure this matches the backend field name
        questionCount: editQuiz.questionCount,
        category: editQuiz.category,
        difficulty: editQuiz.difficulty,
        startDate: editQuiz.startDate,
        endDate: editQuiz.endDate,
      };
  
      const response = await axios.put(
        `http://localhost:8080/quiz/${editQuiz.id}`, // Ensure id is correctly passed
        updates,
        {
          headers: {
            Authorization: header,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Response from backend:", response.data); // Debug response
      alert("Quiz updated successfully!");
      setEditQuiz(null); // Close the edit modal
      await handleQuizzesClick(); // Refresh the quiz list
    } catch (error) {
      console.error("Error updating quiz:", error.response?.data || error.message); // Log error details
      alert(`Failed to update quiz: ${error.response?.data?.message || error.message}`);
    }
  };
  
  // Delete quiz
  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        const header = authHeader();
        if (!header) {
          alert("Authorization header is missing. Please log in again.");
          navigate("/");
          return;
        }

        await axios.delete(`http://localhost:8080/quiz/${quizId}/delete`, {
          headers: {
            Authorization: header,
          },
        });

        alert("Quiz deleted successfully!");
        handleQuizzesClick(); // Refresh quizzes
      } catch (error) {
        console.error("Error deleting quiz:", error);
        alert("Failed to delete quiz.");
      }
    }
  };
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const header = authHeader();
        if (!header) {
          alert("Authorization header is missing. Please log in again.");
          navigate("/");
          return;
        }
  
        await axios.delete(`http://localhost:8080/users/${userId}`, {
          headers: {
            Authorization: header,
          },
        });
  
        alert("User deleted successfully.");
        handleUsersClick(); // Refresh the user list after deletion
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user.");
      }
    }
  };
  
  const fetchQuizParticipants = async (quizId) => {
    try {
      const header = authHeader();
      if (!header) {
        alert("Authorization header is missing. Please log in again.");
        navigate("/");
        return;
      }
  
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/quiz/${quizId}/participants`, {
        headers: { Authorization: header },
      });
  
      const participants = response.data || [];
      setQuizParticipants(participants);
      if (participants.length === 0) {
        setNotification(`No participants found for quiz ID: ${quizId}`);
        setShowNotification(true); // Show the notification
        setTimeout(() => setShowNotification(false), 3000); // Auto-hide after 3 seconds
      } else {
        console.log(`Participants found for quiz ID ${quizId}:`, participants);
        setNotification(""); // Clear any existing notification
      }
  
      setShowParticipantsModal(true);
  
      setError(""); // Clear any previous error
    } catch (error) {
      console.error("Error fetching quiz participants:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to load quiz participants.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  

  const handleCreateQuizFormClick = () => {
    setActiveSection("createQuiz"); // Set active section to "createQuiz"
  };
  const handleEditQuizClick = (quiz) => {
    setEditQuiz(quiz); // Set the quiz to be edited
    setActiveSection("editQuiz"); // Change the active section to 'editQuiz'
  };
  
  const resetStateExcept = (section) => {
    if (section !== "quizzes") setQuizzes([]);
    if (section !== "users") setUsers([]);
    
  };
  
  const handleQuizIdChange = (e) => {
    setQuizId(e.target.value); // Update the input value
  }; 
  const handleCloseModal = () => {
    setShowParticipantsModal(false); // Hide modal
  };
  



  return (
    <div className="container">
      <nav className="navbar">
      <ul className="navbar-links">
  <li>
    <button
      onClick={handleQuizzesClick}
      className="nav-btn quizzes-btn"
    >
      Quizzes
    </button>
  </li>
  <li>
    <button
      onClick={handleUsersClick}
      className="nav-btn users-btn"
    >
      Users
    </button>
  </li>
  <li>
    <button
      onClick={handleCreateQuizFormClick}
      className="nav-btn create-quiz-btn"
    >
      Create Quiz
    </button>
  </li>
  <li>
    <button
      onClick={() => navigate("/dashboard")}
      className="nav-btn btn-secondary"
    >
      Back to Dashboard
    </button>
  </li>
</ul>
        <button onClick={handleLogout} className="logout-btn btn-danger">
          Logout
        </button>
      </nav>
  
      {/* Conditionally render based on activeSection */}
      {activeSection === "quizzes" && (
        <div>
          <h3>Quizzes</h3>       
          <ul>
            {quizzes.map((quiz) => (
              <li key={quiz.id}>
                <strong>Title:</strong> {quiz.title} <br />
                <strong>Question Count:</strong> {quiz.questionCount} <br />
                <strong>Category:</strong> {quiz.category} <br />
                <strong>Difficulty:</strong> {quiz.difficulty} <br />
                <strong>Start Date:</strong> {new Date(quiz.startDate).toLocaleString()} <br />
                <strong>End Date:</strong> {new Date(quiz.endDate).toLocaleString()} <br />
                <strong>Created By:</strong> {quiz.createdBy} <br />
                <strong>Likes:</strong> {quiz.likes} <br />
                <strong>Dislikes:</strong> {quiz.dislikes} <br />
                <button
  onClick={() => {
    fetchQuizParticipants(quiz.id); // Fetch the participants for the quiz
    setShowParticipantsModal(true); // Open the modal after fetching
  }}
  className="btn btn-info btn-sm"
>
  View Participants
</button>

                <button
                  onClick={() => handleEditQuizClick(quiz)}
                  className="btn btn-warning btn-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteQuiz(quiz.id)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          {quizParticipants.length > 0 && showParticipantsModal && (
    <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        maxWidth: "600px",
        width: "100%",
        position: "relative",
      }}
    >
      <button
        onClick={handleCloseModal}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "none",
          border: "none",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        &times;
      </button>
      <h4>
        Participants for Quiz ID:{" "}
        {quizParticipants.length > 0 ? quizParticipants[0]?.quiz?.id || "N/A" : "N/A"}
      </h4>
      {quizParticipants.length > 0 ? (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Username</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Full Name</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Score</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Percentage</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Completion Date</th>
            </tr>
          </thead>
          <tbody>
            {quizParticipants.map((participant, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {participant.user?.username || "N/A"}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {`${participant.user?.firstName || "N/A"} ${participant.user?.lastName || "N/A"}`}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {`${participant.correctAnswers}/${participant.totalQuestions}`}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {participant.percentage}%
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {participant.completionDate
                    ? new Date(participant.completionDate).toLocaleString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No participants available</p>
      )}
    </div>
  </div>
)}


        </div>
      )}
      {showNotification && (
  <div
    style={{
      position: "fixed",
      top: "20px",
      left: "50%", // Center horizontally
      transform: "translateX(-50%)", // Offset by 50% of its width
      zIndex: 1000,
      padding: "10px 20px",
      backgroundColor: "#f8d7da",
      color: "#721c24",
      border: "1px solid #f5c6cb",
      borderRadius: "4px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
      textAlign: "center", // Center the text
    }}
  >
    {notification}
  </div>
)}


      {activeSection === "users" && (
        <div>
          <h3>Users</h3>
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                <strong>Username:</strong> {user.username} <br />
                <strong>Email:</strong> {user.email} <br />
                <strong>First Name:</strong> {user.firstName} <br />
                <strong>Last Name:</strong> {user.lastName} <br />
                <strong>Role:</strong> {user.role} <br />
                <strong>Age:</strong> {user.age} <br />
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

{activeSection === "editQuiz" && (
  <div className="edit-quiz-container">
    <h4>Edit Quiz</h4>
    <form
      onSubmit={(e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        handleUpdateQuiz(); // Call the function to update the quiz
      }}
    >
      <input
        type="text"
        placeholder="Title"
        value={editQuiz.title}
        onChange={(e) => setEditQuiz({ ...editQuiz, title: e.target.value })}
        required
        className="form-control mb-3"
      />
      <input
        type="number"
        placeholder="Question Count"
        value={editQuiz.questionCount}
        onChange={(e) =>
          setEditQuiz({ ...editQuiz, questionCount: parseInt(e.target.value) })
        }
        required
        className="form-control mb-3"
      />
      <select
        value={editQuiz.category}
        onChange={(e) => setEditQuiz({ ...editQuiz, category: parseInt(e.target.value) })}
        required
        className="form-control mb-3"
      >
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <select
        value={editQuiz.difficulty}
        onChange={(e) => setEditQuiz({ ...editQuiz, difficulty: e.target.value })}
        required
        className="form-control mb-3"
      >
        <option value="">Select Difficulty</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <input
        type="datetime-local"
        value={editQuiz.startDate}
        onChange={(e) => setEditQuiz({ ...editQuiz, startDate: e.target.value })}
        required
        className="form-control mb-3"
      />
      <input
        type="datetime-local"
        value={editQuiz.endDate}
        onChange={(e) => setEditQuiz({ ...editQuiz, endDate: e.target.value })}
        required
        className="form-control mb-3"
      />
      <button type="submit" className="btn btn-success">
        Save Changes
      </button>
      <button
        type="button"
        onClick={() => setActiveSection("quizzes")} // Go back to Quizzes
        className="btn btn-secondary"
      >
        Cancel
      </button>
    </form>
  </div>
)}
      {activeSection === "createQuiz" && (
        <div className="create-quiz-container">
          <h4>Create New Quiz</h4>
          <form onSubmit={handleCreateQuizClick}>
            <input
              type="text"
              placeholder="Title"
              value={newQuiz.title}
              onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
              required
              className="form-control mb-3"
            />
            <input
              type="number"
              placeholder="Question Count"
              value={newQuiz.questionCount}
              onChange={(e) =>
                setNewQuiz({ ...newQuiz, questionCount: parseInt(e.target.value) })
              }
              required
              className="form-control mb-3"
            />
            <select
              value={newQuiz.category}
              onChange={(e) => setNewQuiz({ ...newQuiz, category: parseInt(e.target.value) })}
              required
              className="form-control mb-3"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              value={newQuiz.difficulty}
              onChange={(e) => setNewQuiz({ ...newQuiz, difficulty: e.target.value })}
              required
              className="form-control mb-3"
            >
              <option value="">Select Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <input
              type="datetime-local"
              value={newQuiz.startDate}
              onChange={(e) => setNewQuiz({ ...newQuiz, startDate: e.target.value })}
              required
              className="form-control mb-3"
            />
            <input
              type="datetime-local"
              value={newQuiz.endDate}
              onChange={(e) => setNewQuiz({ ...newQuiz, endDate: e.target.value })}
              required
              className="form-control mb-3"
            />
            <button type="submit" className="btn btn-success">
              Create Quiz
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("quizzes")} // Go back to Quizzes
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
  
    
};

export default AdminPage;
