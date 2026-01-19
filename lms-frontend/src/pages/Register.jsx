import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "learner"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", form);

      alert(
        form.role === "instructor"
          ? "Registered successfully! Please wait for admin approval."
          : "Registered successfully! You can now login."
      );

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#E0E2DB" }}
    >
      <form
        onSubmit={submit}
        className="p-8 rounded-xl shadow-md w-full max-w-md"
        style={{
          backgroundColor: "#F9FAF8",
          border: "1px solid #D2D4C8"
        }}
      >
        <h2
          className="text-2xl font-bold mb-6 text-center"
          style={{ color: "#2E3532" }}
        >
          Create Account
        </h2>

        {error && (
          <p className="text-sm mb-3 text-center" style={{ color: "#B4533D" }}>
            {error}
          </p>
        )}

        <input
          className="w-full p-2 rounded mb-3"
          style={{ border: "1px solid #D2D4C8" }}
          placeholder="Full Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />

        <input
          className="w-full p-2 rounded mb-3"
          style={{ border: "1px solid #D2D4C8" }}
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          required
        />

        <input
          className="w-full p-2 rounded mb-4"
          style={{ border: "1px solid #D2D4C8" }}
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          required
        />

        <select
          className="w-full p-2 rounded mb-6"
          style={{ border: "1px solid #D2D4C8" }}
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        >
          <option value="learner">Learner</option>
          <option value="instructor">Instructor</option>
        </select>

        <button
          className="w-full py-2 rounded transition text-white"
          style={{
            backgroundColor: "#6F8F9B",
            opacity: loading ? 0.7 : 1
          }}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p
          className="text-sm text-center mt-4"
          style={{ color: "#2E3532" }}
        >
          Already have an account?{" "}
          <span
            className="cursor-pointer hover:underline"
            style={{ color: "#4E6F88" }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
