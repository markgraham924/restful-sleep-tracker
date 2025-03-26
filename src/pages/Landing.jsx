// src/pages/Landing.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import ForgottenPassword from "./ForgottenPassword"; // Updated import name
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase-config";

const Landing = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  // Redirect to home if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleShowLogin = () => setShowLogin(true);
  const handleCloseLogin = () => setShowLogin(false);

  const handleShowRegister = () => setShowRegister(true);
  const handleCloseRegister = () => setShowRegister(false);
  
  const handleShowForgotPassword = () => setShowForgotPassword(true);
  const handleCloseForgotPassword = () => setShowForgotPassword(false);

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Restful Sleep Tracker</h1>
      <p>Track your sleep patterns and improve your rest quality.</p>
      <div className="section">
        <button className="button button-blue" onClick={handleShowLogin}>
          Login
        </button>
        <button className="button button-green" onClick={handleShowRegister}>
          Register
        </button>
      </div>
      {showLogin && <Login closeModal={handleCloseLogin} showForgotPassword={handleShowForgotPassword} />}
      {showRegister && <Register closeModal={handleCloseRegister} />}
      {showForgotPassword && <ForgottenPassword closeModal={handleCloseForgotPassword} />}
    </div>
  );
};

export default Landing;
