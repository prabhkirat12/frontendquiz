import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Register.css"

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("ROLE_PLAYER");
  const [age, setAge] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/users", {
        username,
        password,
        email,
        firstName,
        lastName,
        role,
        age: parseInt(age, 10), // Convert age to integer
      });
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/"); // Navigate to the login page
      }, 2000); // Delay for user feedback
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage(error.response.data); // Display error message from backend
      } else {
        setMessage("An error occurred. Please try again.");
      }
    }
  };
  const handleBackToLogin = () => {
    navigate("/login"); // Replace "/login" with the actual path to your login page
  };

  return (
    <div className="registration-container">
    <h2>Register</h2>
    <form onSubmit={handleRegister}>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>First Name:</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div>
        <label>Last Name:</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div>
        <label>Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="PLAYER">Player</option>
        </select>
      </div>
      <div>
        <label>Age:</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
      </div>
      <button type="submit">Register</button>
    </form>
    <button onClick={handleBackToLogin} className="back-button">
    Back to Login
  </button>

    {message && <p>{message}</p>}
  </div>
  
  );
};

export default RegisterPage;
