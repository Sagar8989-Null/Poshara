// import "../CSS/Navbar.css";
import { Link } from "react-router-dom";
function Navbar() {
  return (
    <nav>
      <div className="nav-container">
        <div className="logo-container animate-slide-in-left">
          <div className="logo-circle">
            <svg className="icon icon-fill" style={{ color: '#ec4899' }} viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <span className="logo-text">POSHARA</span>
        </div>

        {/* <div className="nav-links animate-fade-in-up">
          <a href="#mission">Mission</a>
          <a href="#impact">Impact</a>
          <a href="#how">How It Works</a>
        </div> */}
        <Link to='/'>
          <button className="nav-btn animate-slide-in-right">Home</button>
        </Link>
      </div>
    </nav>
  )
}
export default Navbar;