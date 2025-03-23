// src/pages/Register.jsx
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

const Register = ({ closeModal }) => {
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [sleepGoal, setSleepGoal] = useState(""); // e.g., target hours of sleep
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  // Redirect to home if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Password validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Simple password strength check
    if (password.length < 6) {
      setError("Password should be at least 6 characters long.");
      return;
    }

    try {
      // Create user with email and password
      const res = await createUserWithEmailAndPassword(auth, email, password);
      // Store additional user details in Firestore
      await setDoc(doc(db, "users", res.user.uid), {
        fullName,
        age: Number(age),
        sleepGoal: Number(sleepGoal),
        email,
        createdAt: new Date(),
      });
      // Navigation will happen automatically through useEffect
      if (closeModal) closeModal();
    } catch (err) {
      let errorMessage = "";
      switch (err.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email is already in use.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak.";
          break;
        default:
          errorMessage = "Registration failed. Please try again.";
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content themed-card">
        <h2 className="themed-heading">Register</h2>
        <form onSubmit={handleRegister}>
          <div className="form section">
            <label className="themed-label">Full Name:</label>
            <input
              className="input themed-input"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="form section">
            <label className="themed-label">Age:</label>
            <input
              className="input themed-input"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>
          <div className="form section">
            <label className="themed-label">Sleep Goal (hours):</label>
            <input
              className="input themed-input"
              type="number"
              value={sleepGoal}
              onChange={(e) => setSleepGoal(e.target.value)}
              required
            />
          </div>
          <div className="form section">
            <label className="themed-label">Email:</label>
            <input
              className="input themed-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form section">
            <label className="themed-label">Password:</label>
            <input
              className="input themed-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form section">
            <label className="themed-label">Confirm Password:</label>
            <input
              className="input themed-input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message themed-error">{error}</p>}
          <div className="button-group">
            <button className="button button-blue" type="submit">
              Register
            </button>
            {closeModal && (
              <button
                className="button button-red"
                type="button"
                onClick={closeModal}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
