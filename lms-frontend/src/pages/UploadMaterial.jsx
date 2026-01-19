import { useState } from "react";
import { uploadMaterial } from "../api/instructor";
import { useParams, useNavigate } from "react-router-dom";

export default function UploadMaterial() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [type, setType] = useState("video");
  const [content, setContent] = useState("");

  const submit = async e => {
    e.preventDefault();
    await uploadMaterial(courseId, { type, content });
    alert("Material uploaded");
    navigate("/instructor/course/" + courseId);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#E0E2DB", color: "#2E3532" }}
    >
      <form
        onSubmit={submit}
        className="w-full max-w-md p-8 rounded-3xl shadow-lg"
        style={{
          backgroundColor: "#F9FAF8",
          border: "1px solid #D2D4C8"
        }}
      >
        <h2
          className="text-3xl font-extrabold mb-6"
          style={{ color: "#4E6F88" }}
        >
          Upload Material
        </h2>

        <select
          className="w-full p-3 rounded-lg mb-4 outline-none"
          style={{
            border: "1px solid #D2D4C8",
            backgroundColor: "#FFFFFF"
          }}
          value={type}
          onChange={e => setType(e.target.value)}
        >
          <option value="video">Video</option>
          <option value="pdf">PDF</option>
          <option value="text">Text</option>
        </select>

        <textarea
          className="w-full p-3 rounded-lg mb-4 outline-none resize-none"
          rows={4}
          placeholder="Content or URL"
          style={{
            border: "1px solid #D2D4C8",
            backgroundColor: "#FFFFFF"
          }}
          value={content}
          onChange={e => setContent(e.target.value)}
        />

        <button
          className="w-full py-3 rounded-xl font-semibold text-white transition shadow-md"
          style={{ backgroundColor: "#6F8F9B" }}
        >
          Upload Material
        </button>
      </form>
    </div>
  );
}
