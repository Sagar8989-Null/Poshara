import React from "react";
import { Link } from "react-router-dom";
import "../CSS/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">🍴 Poshara</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/signup">Signup</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
