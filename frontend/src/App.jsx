import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RestaurantDashboard from "./pages/RestoDash";
import NGODashboard from "./pages/NgoDash";
import VolunteerDashboard from "./pages/VolDash";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard/restaurant" element={<RestaurantDashboard />} />
          <Route path="/dashboard/ngo" element={<NGODashboard />} />
          <Route path="/dashboard/volunteer" element={<VolunteerDashboard />} />
        </Routes>
      </div>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🌱 Poshara Frontend Working!</h1>
      <p>If you can see this, your React app is running fine.</p>
    </div>
    </Router>
  );
}

export default App;
