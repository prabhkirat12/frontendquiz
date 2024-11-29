import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [token, setToken] = useState(""); // State to hold the token input
  const [message, setMessage] = useState("");
  const { state } = useLocation(); // Retrieve the passed state (token) if available
  const navigate = useNavigate();

  // If the token is passed via state (from the forgot password page)
  const defaultToken = state?.token || "";

  // Use the token passed in the URL state if it exists
  const [currentToken, setCurrentToken] = useState(defaultToken);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // If neither the current token nor the manually entered token is available
    if (!currentToken) {
      setMessage("Invalid or expired token.");
      return;
    }

    try {
      // Making the POST request with both token and newPassword
      const response = await axios.post(
        "http://localhost:8080/users/reset-password",
        {
          token: currentToken,
          newPassword,
        }
      );

      setMessage(response.data.message || "Password reset successful!");
      alert("Password reset successfully. Redirecting to login...");
      navigate("/"); // Redirect to login page after successful reset
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage(error.response?.data || "An error occurred. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Reset Password</h2>
      <form onSubmit={handleResetPassword}>
        {/* Token input field */}
        <div style={{ marginBottom: "15px" }}>
          <label>Token:</label>
          <input
            type="text"
            value={currentToken}
            onChange={(e) => setCurrentToken(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              margin: "5px 0",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        {/* New Password input field */}
        <div style={{ marginBottom: "15px" }}>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              margin: "5px 0",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Reset Password
        </button>
      </form>

      {/* Message displaying error or success */}
      {message && <p style={{ marginTop: "15px", color: "red" }}>{message}</p>}
    </div>
  );
};

export default ResetPassword;
