import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function InstructorCourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    api.get(`/instructor/course/${id}`).then(res => setCourse(res.data));
  }, [id]);

  if (!course) return <p className="p-10">Loading...</p>;

  return (
    <div
      className="min-h-screen p-10"
      style={{ backgroundColor: "#E0E2DB", color: "#2E3532" }}
    >
      {/* ================= HEADER ================= */}
      <div
        className="p-8 rounded-3xl shadow mb-8"
        style={{
          backgroundColor: "#F9FAF8",
          border: "1px solid #D2D4C8"
        }}
      >
        <h1 className="text-3xl font-extrabold mb-2">
          {course.title}
        </h1>
        <p className="text-[#4E6F88]">
          {course.description}
        </p>
      </div>

      {/* ================= UPLOAD MATERIAL BUTTON ================= */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">Course Materials</h2>

        <button
          onClick={() => navigate(`/instructor/upload-material/${id}`)}
          className="px-6 py-2 rounded-xl font-semibold text-white shadow-md transition"
          style={{ backgroundColor: "#6F8F9B" }}
        >
          + Upload Material
        </button>
      </div>

      {/* ================= MATERIAL LIST ================= */}
      <div className="space-y-4">
        {course.CourseMaterials.length === 0 && (
          <div
            className="p-6 rounded-2xl shadow text-sm"
            style={{
              backgroundColor: "#F9FAF8",
              border: "1px dashed #6F8F9B"
            }}
          >
            No materials uploaded yet.
          </div>
        )}

        {course.CourseMaterials.map(m => (
          <div
            key={m.id}
            className="p-5 rounded-2xl shadow border-l-4"
            style={{
              backgroundColor: "#F9FAF8",
              borderColor: "#6F8F9B"
            }}
          >
            <p
              className="font-semibold mb-1"
              style={{ color: "#4E6F88" }}
            >
              {m.type}
            </p>
            <p className="text-sm">
              {m.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
