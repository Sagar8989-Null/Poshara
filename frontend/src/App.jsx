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
import Addresslatlong from "./components/Addresslatlong";
import RestoDash from "./pages/RestoDash";
import OCRImageExtractor from "./components/OCR";

function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      <div className="content">
        <Routes>
          {/* <Route path="/" element={<Addresslatlong/>}/> This line only for testing Addresslatlong component there is no need of this component on Homepage */}
          <Route path="/" element={<Home />}/>
          {/*<Route path="/" element={<><RestoDash /></>}/>*/}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard/restaurant" element={<RestoDash/>} />
          <Route path="/dashboard/ngo" element={<NgoDash />} />
          <Route path="/dashboard/volunteer" element={<VolDash />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
