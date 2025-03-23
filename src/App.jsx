// src/App.jsx
import React, { useEffect } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import SleepSession from "./pages/SleepSession";
import Alarm from "./pages/Alarm";
import IntegratedSleepClock from "./pages/Clock/IntegratedSleepClock";
import ForgottenPasswordPage from "./pages/ForgottenPasswordPage";
import { AlarmProvider } from "./contexts/AlarmContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";
import "./App.css";
import "./styles/ThemeComponents.css"; // Import shared theme components
import ProtectedRoute from "./components/ProtectedRoute";
import BottomNavigation from "./components/BottomNavigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase-config";

function App() {
  const [user, loading] = useAuthState(auth);
  const location = useLocation();
  
  // Public routes where we don't want to show the bottom navigation
  const publicRoutes = ['/login', '/register', '/landing', '/forgot-password'];
  const showBottomNav = user && !publicRoutes.includes(location.pathname);
  
  // Set the theme class on the HTML element to allow for full-page theming
  useEffect(() => {
    document.documentElement.classList.add('themed-app');
  }, []);

  if (loading) {
    return <div className="loading-container themed-loading">
      <div className="themed-spinner"></div>
      <p>Loading...</p>
    </div>;
  }

  return (
    <ThemeProvider>
      <AlarmProvider>
        <div className="App app-container page-container">
          <Routes>
            {/* Public routes */}
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgottenPasswordPage />} />
            
            {/* Protected routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/sleep-session" 
              element={
                <ProtectedRoute>
                  <SleepSession />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/alarm" 
              element={
                <ProtectedRoute>
                  <Alarm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/sleep-clock" 
              element={
                <ProtectedRoute>
                  <IntegratedSleepClock />
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect root to home if authenticated, otherwise to landing */}
            <Route 
              path="*" 
              element={user ? <Navigate to="/" /> : <Navigate to="/landing" />} 
            />
          </Routes>
          
          {showBottomNav && <BottomNavigation />}
          {(user || location.pathname === '/landing') && <ThemeToggle />}
        </div>
      </AlarmProvider>
    </ThemeProvider>
  );
}

export default App;
