import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    api.get(`/courses/${id}`).then(res => setCourse(res.data));
  }, [id]);

  const buy = async () => {
    const secret = prompt("Enter bank PIN");
    await api.post(`/purchase/buy/${id}`, { secret });
    alert("Purchased!");
  };

  if (!course) return null;

  return (
    <div>
      <h2>{course.title}</h2>
      <p>{course.description}</p>

      <button onClick={buy}>Buy Course</button>

      <h3>Materials</h3>
      {course.CourseMaterials?.map(m => (
        <p key={m.id}>{m.content}</p>
      ))}
    </div>
  );
}
