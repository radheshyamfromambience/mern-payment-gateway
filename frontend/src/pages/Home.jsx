import CourseCard from "../components/CourseCard";

function Home() {
  return (
    <main className="home-page">
      <section className="hero">
        <span className="hero-badge">LEARN • BUILD • GROW</span>

        <h1>
          Learn Technology.
          <br />
          <span>Build Your Future.</span>
        </h1>

        <p>
          Explore practical technology courses at
          Ambience Computer Education.
        </p>

        <div className="hero-points">
          <span>✓ Practical Learning</span>
          <span>✓ Industry Skills</span>
          <span>✓ Real Projects</span>
        </div>
      </section>

      <section className="courses-section">
        <div className="section-heading">
          <span className="course-label">OUR COURSE</span>
          <h2>Start Learning Today</h2>
        </div>

        <CourseCard />
      </section>
    </main>
  );
}

export default Home;