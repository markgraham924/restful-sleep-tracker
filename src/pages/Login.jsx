// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { auth } from "../firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

const Login = ({ closeModal, showForgotPassword }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  // Redirect to home if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigation will happen automatically through useEffect
      if (closeModal) closeModal();
    } catch (err) {
      // Improved error handling based on Firebase error codes
      let errorMessage = "";
      switch (err.code) {
        case "auth/user-not-found":
          errorMessage = "No user found with that email.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password. Please try again.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        default:
          errorMessage = "Login failed. Please try again.";
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content themed-card">
        <h2 className="themed-heading">Login</h2>
        <form onSubmit={handleLogin}>
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
            <div className="forgot-password-link">
              <button 
                type="button" 
                className="text-button"
                onClick={() => {
                  closeModal();
                  showForgotPassword();
                }}
              >
                Forgot your password?
              </button>
            </div>
          </div>
          {error && <p className="error-message themed-error">{error}</p>}
          <div className="button-group">
            <button className="button button-blue" type="submit">
              Login
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

export default Login;
