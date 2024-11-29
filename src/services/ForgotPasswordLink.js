import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // For navigation

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(""); // Reset any previous message

    try {
      // Send request to the password reset API
      const response = await axios.post("http://localhost:8080/users/password-reset-request", { email });

      // Set message based on the response
      setMessage(response.data || "Password reset email sent successfully.");

      // Redirect to reset password page after a successful response
      navigate("/reset-password"); // Assuming you have a route for ResetPassword page
    } catch (error) {
      setMessage(error.response?.data || "An error occurred. Please try again.");
    }

    setIsLoading(false);
  };

  const handleBackToLogin = () => {
    navigate("/"); // Navigate to the login page
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Forgot Password</h2>
      <form onSubmit={handleForgotPassword} style={styles.form}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          style={styles.input}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{
            ...styles.button,
            ...(isLoading ? styles.buttonDisabled : {}),
          }}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
      <button onClick={handleBackToLogin} style={styles.backButton}>Back to Login</button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "100px auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "14px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  buttonDisabled: {
    backgroundColor: "#aaa",
    cursor: "not-allowed",
  },
  message: {
    textAlign: "center",
    color: "red",
    fontSize: "14px",
    marginTop: "10px",
  },
  backButton: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default ForgotPasswordPage;
