import { useEffect, useState } from "react";
import { getMyCourses } from "../../api/learnerApi";
import { Link } from "react-router-dom";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getMyCourses().then(res => setCourses(res.data));
  }, []);

  if (!courses.length) return <p>No courses purchased yet</p>;

  return (
    <div>
      <h3>My Courses</h3>
      {courses.map(c => (
        <div key={c.id} style={{ border: "1px solid #ccc", margin: 10 }}>
          <h4>{c.title}</h4>
          <p>Status: {c.completed ? "Completed" : "In progress"}</p>

          <Link to={`/learner/course/${c.id}`}>Open Course</Link>

          {c.completed && (
            <Link to={`/learner/certificate/${c.id}`}>
              🎓 Download Certificate
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
