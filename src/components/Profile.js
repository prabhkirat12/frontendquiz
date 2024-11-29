import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { authHeader } from "../App"; // Import the authHeader function
import "../css/Profile.css"
import logo from "../components/logo.jpeg"
const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for initial fetch
  const [showModal, setShowModal] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const username = localStorage.getItem("authUsername");
      if (!username) {
        setError("User not logged in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/users/username/${username}`
        );
        setUser(response.data);
        setUpdatedUser(response.data); // Initialize update form data
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const header = authHeader();
      if (!header) {
        alert("Authorization header is missing. Please log in again.");
        return;
      }
  
      const sanitizedUser = {
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        age: updatedUser.age,
      };
  
      const response = await axios.put(
        `http://localhost:8080/users/${user.id}`,
        sanitizedUser,
        {
          headers: {
            Authorization: header,
            "Content-Type": "application/json",
          },
        }
      );
  
      setMessage("Profile updated successfully.");
      setUser(response.data);
      setShowModal(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage("Error updating profile.");
    }
  };
  
  

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/users/${user.id}`);
      localStorage.removeItem("loggedInUser");
      window.location.href = "/";
    } catch (err) {
      console.error("Error deleting account:", err);
      setMessage("Error deleting account.");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="profile-header">
         <img
            src={logo}
           alt="Profile Logo"
           className="profile-logo"
        />
     </div>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>First Name:</strong> {user.firstName}</p>
      <p><strong>Last Name:</strong> {user.lastName}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Age:</strong> {user.age}</p>
      <Button onClick={handleShowModal} variant="primary">
        Update Profile
      </Button>
      <Button onClick={handleDelete} variant="danger" className="ms-2">
        Delete Account
      </Button>
      {message && <p>{message}</p>}

      {/* Modal for updating profile */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={updatedUser.username}
                onChange={handleInputChange}
                disabled
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={updatedUser.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formFirstName" className="mt-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={updatedUser.firstName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formLastName" className="mt-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={updatedUser.lastName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formAge" className="mt-3">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                name="age"
                value={updatedUser.age}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profile;
