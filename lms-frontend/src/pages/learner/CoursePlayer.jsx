import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { markCompleted } from "../../api/learnerApi";

export default function CoursePlayer() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    api.get(`/courses/${id}`).then(res => setCourse(res.data));
  }, [id]);

  const complete = async () => {
    await markCompleted(id);
    alert("Course marked as completed");
  };

  if (!course) return <p>Loading...</p>;

  return (
    <div>
      <h2>{course.title}</h2>

      {course.CourseMaterials.map(m => (
        <div key={m.id}>
          <strong>{m.type}</strong>
          <p>{m.content}</p>
        </div>
      ))}

      <button onClick={complete}>Mark as Completed</button>
    </div>
  );
}
