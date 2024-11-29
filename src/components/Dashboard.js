import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import "../css/Dashboard.css"; // Use the updated CSS file

const Dashboard = ({ handleLogout, userRole }) => {
  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <ul className="navbar-links">
          <li>
            <NavLink to="quizzes" className="nav-link" activeClassName="active-link">
              Quizzes
            </NavLink>
          </li>
          <li>
            <NavLink to="profile" className="nav-link" activeClassName="active-link">
              Profile
            </NavLink>
          </li>
          {userRole === "ROLE_ADMIN" && (
            <li>
              <NavLink to="/admin" className="nav-link" activeClassName="active-link">
                Admin Panel
              </NavLink>
            </li>
          )}
        </ul>
        <div className="logout-button">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <div className="welcome-section">
        <p className="welcome-message">Welcome, {localStorage.getItem("authUsername") || "User"}!</p>
      </div>
      <Outlet />
    </div>
  );
};

export default Dashboard;
