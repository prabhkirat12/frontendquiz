import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const { success, role } = await handleLogin(username, password);

    if (success) {
      setMessage("Login successful!");
      navigate(role === "ROLE_ADMIN" ? "/dashboard":"/admin" );
    } else {
      setMessage("Invalid login. Please try again.");
    }

    setIsLoading(false);
  };
  

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>
      <form onSubmit={onLoginSubmit} style={styles.form}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          style={styles.input}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
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
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
      <p style={styles.registerText}>
  Forgot your password?{" "}
  <Link to="/forgot-password" style={styles.registerLink}>
    Reset it here
  </Link>
</p>
      <p style={styles.registerText}>
        Don't have an account?{" "}
        <Link to="/register" style={styles.registerLink}>
          Register Now
        </Link>
      </p>

    </div>
  );
};

// CSS styles as JavaScript object
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
  registerText: {
    textAlign: "center",
    marginTop: "15px",
    fontSize: "14px",
  },
  registerLink: {
    color: "#007BFF",
    textDecoration: "underline",
    cursor: "pointer",
  },
};

export default LoginPage;
