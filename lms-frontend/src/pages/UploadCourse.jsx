import { useState } from "react";
import { uploadCourse } from "../api/instructor";
import { useNavigate } from "react-router-dom";

export default function UploadCourse() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: ""
  });

  const submit = async e => {
    e.preventDefault();
    await uploadCourse(form);
    alert("Course sent for approval");
    navigate("/instructor");
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
          Upload Course
        </h2>

        {["title", "description", "price"].map(f => (
          <input
            key={f}
            placeholder={f.toUpperCase()}
            type={f === "price" ? "number" : "text"}
            className="w-full p-3 rounded-lg mb-4 outline-none transition"
            style={{
              border: "1px solid #D2D4C8",
              backgroundColor: "#FFFFFF"
            }}
            onChange={e =>
              setForm({ ...form, [f]: e.target.value })
            }
          />
        ))}

        <button
          className="w-full py-3 rounded-xl font-semibold text-white transition shadow-md"
          style={{ backgroundColor: "#6F8F9B" }}
        >
          Submit for Approval
        </button>
      </form>
    </div>
  );
}
