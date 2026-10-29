import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        <img src="https://ambiencecomputereducation.com/img/ambience_computer_education.webp" alt="" srcset=""  height={"50px"}/>
        <span>Ambience <small>Computer Education</small></span>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/payment-history">Payment History</Link>
      </div>
    </nav>
  );
}

export default Navbar;