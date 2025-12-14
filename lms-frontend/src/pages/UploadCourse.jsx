import { useState } from "react";
import { uploadCourse } from "../api/instructor";
import { useNavigate } from "react-router-dom";

export default function UploadCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    await uploadCourse({ title, description, price });
    alert("Course uploaded, waiting for admin approval");
    navigate("/instructor");
  };

  return (
    <form onSubmit={submit} style={{ padding: 20 }}>
      <h2>Upload Course</h2>

      <input placeholder="Title" onChange={e => setTitle(e.target.value)} />
      <br />
      <textarea placeholder="Description" onChange={e => setDescription(e.target.value)} />
      <br />
      <input placeholder="Price" type="number" onChange={e => setPrice(e.target.value)} />
      <br />

      <button type="submit">Upload</button>
    </form>
  );
}
