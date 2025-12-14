import { useState } from "react";
import { uploadMaterial } from "../api/instructor";
import { useParams, useNavigate } from "react-router-dom";

export default function UploadMaterial() {
  const { courseId } = useParams();
  const [type, setType] = useState("video");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    await uploadMaterial(courseId, { type, content });
    alert("Material uploaded");
    navigate("/instructor");
  };

  return (
    <form onSubmit={submit} style={{ padding: 20 }}>
      <h2>Upload Material</h2>

      <select onChange={e => setType(e.target.value)}>
        <option value="video">Video</option>
        <option value="pdf">PDF</option>
        <option value="text">Text</option>
      </select>

      <br />
      <textarea placeholder="Content / URL" onChange={e => setContent(e.target.value)} />
      <br />

      <button type="submit">Upload</button>
    </form>
  );
}