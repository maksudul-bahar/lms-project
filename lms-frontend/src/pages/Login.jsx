import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      login(res.data.token, res.data.user);

      const role = res.data.user.role;
      if (role === "learner") navigate("/learner");
      else if (role === "instructor") navigate("/instructor");
      else if (role === "admin") navigate("/admin");

    } catch (err) {
      if (err.response?.status === 403) {
        setError("Your instructor account is pending admin approval");
      } else {
        setError(err.response?.data?.error || "Login failed");
      }
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
        className="w-96 p-8 rounded-2xl shadow-xl"
        style={{
          backgroundColor: "#D2D4C8",
          color: "#2E3532",
        }}
      >
        <h2 className="text-2xl font-bold text-center mb-2">
          Login to LMS
        </h2>

        <p className="text-sm text-center mb-6 opacity-80">
          Welcome back! Please login
        </p>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center font-medium">
            {error}
          </p>
        )}

        <input
          className="w-full p-2 mb-3 rounded-lg border focus:outline-none"
          style={{
            backgroundColor: "#F9FAF8",
            borderColor: "#6F8F9B",
          }}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full p-2 mb-4 rounded-lg border focus:outline-none"
          style={{
            backgroundColor: "#F9FAF8",
            borderColor: "#6F8F9B",
          }}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg font-semibold transition"
          style={{
            backgroundColor: loading ? "#9FB7C2" : "#6F8F9B",
            color: "#F9FAF8",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Register link */}
        <div className="text-center mt-6 text-sm">
          <span className="opacity-80">Don’t have an account?</span>{" "}
          <Link
            to="/register"
            className="font-semibold"
            style={{ color: "#4E6F88" }}
          >
            Register here
          </Link>
        </div>
      </form>
    </div>
  );
}
