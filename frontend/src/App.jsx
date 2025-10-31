import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RestoDash from "./pages/RestoDash";
import NgoDash from "./pages/NgoDash";
import VolDash from "./pages/VolDash";
<<<<<<< HEAD
import Navbar from './components/Navbar';
import Addresslatlong from "./components/Addresslatlong";
=======
>>>>>>> fcbe20bb1a2a4352187f3d5667651d1f3ef783d3
import "./App.css";

function App() {
  return (
    <Router>
      <div className="content">
        <Routes>
          <Route path="/" element={<RestoDash/>} />
          {/* <Route path="/" element={<Home />} /> */}
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
