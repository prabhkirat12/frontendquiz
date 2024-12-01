import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import LoginPage from "./components/Login";
import RegisterPage from "./components/Register";
import Dashboard from "./components/Dashboard";
import Quizzes from "./components/Quiz";
import Profile from "./components/Profile";
import AdminPage from "./components/AdminPage";
import ForgotPasswordPage from "./services/ForgotPasswordLink";
import "bootstrap/dist/css/bootstrap.min.css";
import ResetPassword from "./components/ResetPassword";

// Exportable authHeader function
export const authHeader = () => {
  const username = localStorage.getItem("authUsername");
  const password = localStorage.getItem("authPassword");

  if (username && password) {
    return `Basic ${btoa(`${username}:${password}`)}`;
  }
  return null;
};

const AppContent = () => {
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("authUsername"));

  // Get the current location
  const location = useLocation();

  // Store the last visited page in localStorage
  useEffect(() => {
    localStorage.setItem("lastVisitedPage", location.pathname);
  }, [location]);

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post("/users/auth/login", {
        username,
        password,
      });

      const { role, id } = response.data; // Assuming userId is part of the response

      // Save to localStorage
      localStorage.setItem("authUsername", username);
      localStorage.setItem("authPassword", password);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userId", id); // Correctly storing userId here
      setIsAuthenticated(true);
      setUserRole(role);

      return { success: true, role };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false };
    }
  };

  const handleLogout = () => {
    // Clear stored credentials
    localStorage.removeItem("authUsername");
    localStorage.removeItem("authPassword");
    localStorage.removeItem("userRole");
    localStorage.removeItem("lastVisitedPage");

    setIsAuthenticated(false);
    setUserRole(null);
  };

  const lastVisitedPage = localStorage.getItem("lastVisitedPage") || "/";

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={lastVisitedPage} />
          ) : (
            <LoginPage handleLogin={handleLogin} />
          )
        }
      />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      {/* Private Routes */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <Dashboard handleLogout={handleLogout} userRole={userRole} />
          ) : (
            <Navigate to="/" />
          )
        }
      >
        {/* Nested Routes */}
        <Route path="quizzes" element={<Quizzes />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Admin Route */}
      <Route
        path="/admin"
        element={
          isAuthenticated && userRole === "ROLE_ADMIN" ? (
            <AdminPage handleLogout={handleLogout} />
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />

      {/* Catch-All Redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
