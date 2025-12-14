import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getInstructorCourses, getInstructorSummary } from "../api/instructor";

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    getInstructorCourses().then(res => setCourses(res.data));
    getInstructorSummary().then(res => setSummary(res.data));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Instructor Dashboard</h2>

      {summary && (
        <div style={{ marginBottom: 20 }}>
          <p>Total Earnings: {summary.total}</p>
          <p>Pending: {summary.pending}</p>
          <p>Completed: {summary.completed}</p>
        </div>
      )}

      <Link to="/instructor/upload">
        <button>Upload New Course</button>
      </Link>

      <h3 style={{ marginTop: 20 }}>My Courses</h3>

      {courses.map(course => (
        <div key={course.id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
          <h4>{course.title}</h4>
          <p>Status: {course.status}</p>

          <Link to={`/instructor/upload-material/${course.id}`}>
            <button>Upload Material</button>
          </Link>
        </div>
      ))}
    </div>
  );
}
