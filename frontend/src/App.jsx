import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RestoDash from "./pages/RestoDash";
import NgoDash from "./pages/NgoDash";
import VolDash from "./pages/VolDash";
import Navbar from './components/Navbar'
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar/>
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard/restaurant" element={<RestoDash />} />
          <Route path="/dashboard/ngo" element={<NgoDash />} />
          <Route path="/dashboard/volunteer" element={<VolDash />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
