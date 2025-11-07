import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RestoDash from "./pages/RestoDash";
import NgoDash from "./pages/NgoDash";
import VolDash from "./pages/VolDash";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/dashboard/restaurant" 
            element={
              <ProtectedRoute requiredRole="restaurant">
                <RestoDash />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/ngo" 
            element={
              <ProtectedRoute requiredRole="ngo">
                <NgoDash />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/volunteer" 
            element={
              <ProtectedRoute requiredRole="volunteer">
                <VolDash />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

