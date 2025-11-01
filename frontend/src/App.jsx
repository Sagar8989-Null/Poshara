import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RestoDash from "./pages/RestoDash";
import NgoDash from "./pages/NgoDash";
import VolDash from "./pages/VolDash";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Router>
      {/* ✅ Navbar will appear on all pages */}
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/dashboard/restaurant" 
            element={
              <ProtectedRoute>
                <RestoDash />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/ngo" 
            element={
              <ProtectedRoute>
                <NgoDash />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/volunteer" 
            element={
              <ProtectedRoute>
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

