import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Home() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api.get("/courses?approved=true").then(res => setCourses(res.data));
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#E0E2DB", color: "#2E3532" }}
    >
      {/* ================= NAVBAR ================= */}
      <nav className="flex items-center justify-between px-6 md:px-20 py-6">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Edu<span style={{ color: "#6F8F9B" }}>LMS</span>
        </h1>

        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-5 py-2 rounded-full border font-medium transition"
            style={{
              borderColor: "#6F8F9B",
              color: "#6F8F9B",
            }}
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-5 py-2 rounded-full font-medium transition text-white"
            style={{
              backgroundColor: "#6F8F9B",
            }}
          >
            Register
          </Link>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="text-center px-6 md:px-20 py-20">
        <h2 className="text-5xl md:text-6xl font-extrabold leading-tight">
          Learn <span style={{ color: "#6F8F9B" }}>Anything</span>,<br />
          Build Your <span style={{ color: "#4E6F88" }}>Future</span>
        </h2>

        {/* <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto opacity-90">
          Explore industry-ready courses from verified instructors.
          Learn at your pace, earn certificates, and grow your career.
        </p> */}

        <div className="mt-10 flex justify-center gap-6 flex-wrap">
          <Link
            to="/register"
            className="px-8 py-4 rounded-full text-lg font-semibold transition text-white shadow-md"
            style={{ backgroundColor: "#6F8F9B" }}
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="px-8 py-4 rounded-full text-lg font-semibold transition border"
            style={{
              borderColor: "#6F8F9B",
              color: "#6F8F9B",
              backgroundColor: "#F9FAF8",
            }}
          >
            Login
          </Link>
        </div>
      </section>

      {/* ================= COURSES ================= */}
      <section className="px-6 md:px-20 pb-24">
        <h3 className="text-3xl font-bold mb-10 text-center">
          Available Courses
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {courses.map(course => (
            <div
              key={course.id}
              className="rounded-3xl p-7 shadow-lg transition hover:shadow-xl"
              style={{
                backgroundColor: "#F9FAF8",
                border: "1px solid #D2D4C8",
              }}
            >
              <h4
                className="text-2xl font-semibold mb-3"
                style={{ color: "#4E6F88" }}
              >
                {course.title}
              </h4>

              <p className="text-base leading-relaxed opacity-90">
                {course.description}
              </p>

              <div className="mt-6 text-sm italic opacity-70">
                Purchase to access full course materials
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer
        className="text-center py-10 text-sm"
        style={{ backgroundColor: "#D2D4C8" }}
      >
        © {new Date().getFullYear()} EduLMS · Learn · Grow · Succeed
      </footer>
    </div>
  );
}
