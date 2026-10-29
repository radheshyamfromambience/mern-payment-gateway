import { Link } from "react-router-dom";

function CourseCard() {
  return (
    <div className="course-card">
      <div className="course-icon">{"</>"}</div>

      <span className="course-label">FEATURED COURSE</span>

      <h2>MERN Stack Development</h2>

      <p>
        Learn React, Node.js, Express and MongoDB
        with a practical payment integration project.
      </p>

      <div className="course-price">
        <span>Course Fee</span>
        <strong>₹499</strong>
      </div>

      <Link to="/checkout" className="primary-button">
        Enroll Now →
      </Link>
    </div>
  );
}

export default CourseCard;