import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { markCompleted } from "../../api/learnerApi";
import { motion } from "framer-motion";

export default function CoursePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/courses/${id}`).then(res => setCourse(res.data));
  }, [id]);

  useEffect(() => {
    api.get(`/certificate/${id}`).then(
      () => setCompleted(true),
      () => setCompleted(false)
    );
  }, [id]);

  const handleComplete = async () => {
    setLoading(true);
    await markCompleted(id);
    navigate(`/learner/certificate/${id}`);
  };

  if (!course) return null;

  return (
    <div className="min-h-screen p-10" style={{ backgroundColor: "#E0E2DB" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto p-8 rounded-2xl shadow-xl"
        style={{ backgroundColor: "#F9FAF8" }}
      >
        <h2 className="text-3xl font-bold mb-2" style={{ color: "#4E6F88" }}>
          {course.title}
        </h2>
        <p className="mb-6">{course.description}</p>

        {course.CourseMaterials.map(m => (
          <div
            key={m.id}
            className="p-4 rounded-xl mb-3"
            style={{ backgroundColor: "#D2D4C8" }}
          >
            <strong>{m.type}</strong>
            <p>{m.content}</p>
          </div>
        ))}

        <button
          onClick={handleComplete}
          className="mt-6 px-6 py-3 rounded-xl text-white"
          style={{ backgroundColor: "#6F8F9B" }}
        >
          Complete Course
        </button>
      </motion.div>
    </div>
  );
}
