import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  getInstructorCourses,
  getInstructorSummary,
  requestWithdrawal,
  getInstructorWithdrawals
} from "../api/instructor";

import api from "../api/axios";
import { logout } from "../utils/logout";

export default function InstructorDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("courses");
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({});
  const [courses, setCourses] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);

  const [summary, setSummary] = useState({
    totalEarned: 0,
    totalWithdrawn: 0,
    availableBalance: 0
  });

  const [withdrawAmount, setWithdrawAmount] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const p = await api.get("/user/profile");
        const c = await getInstructorCourses();
        const s = await getInstructorSummary();
        const w = await getInstructorWithdrawals();

        setProfile(p.data);
        setCourses(c.data || []);
        setSummary(s.data);
        setWithdrawals(w.data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleWithdraw = async () => {
    await requestWithdrawal(withdrawAmount);
    alert("Withdrawal requested");
    setWithdrawAmount("");
  };

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#E0E2DB", color: "#2E3532" }}>

      {/* ========== SIDEBAR (FIXED HEIGHT) ========== */}
      <aside
        className="w-64 h-screen flex flex-col shadow-lg"
        style={{ backgroundColor: "#D2D4C8" }}
      >
        {/* TOP */}
        <div className="p-6 border-b" style={{ borderColor: "#E0E2DB" }}>
          <h1 className="text-2xl font-extrabold">Instructor</h1>
          <p className="text-sm opacity-70 mt-1 truncate">
            {profile.email}
          </p>
        </div>

        {/* MENU (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {["courses", "overview", "withdraw"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="w-full text-left px-4 py-2 rounded-lg font-medium transition"
              style={{
                backgroundColor:
                  activeTab === tab ? "#F9FAF8" : "transparent"
              }}
            >
              {tab === "courses"
                ? "My Courses"
                : tab === "overview"
                ? "Overview"
                : "Withdraw"}
            </button>
          ))}
        </div>

        {/* LOGOUT (ALWAYS VISIBLE) */}
        <div className="p-4 border-t" style={{ borderColor: "#E0E2DB" }}>
          <button
            onClick={logout}
            className="w-full py-2 rounded-lg font-semibold text-white transition"
            style={{ backgroundColor: "#6F8F9B" }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ========== MAIN (SOFT GRADIENT) ========== */}
      <main
        className="flex-1 p-10 overflow-y-auto"
        style={{
          background: "linear-gradient(180deg, #F9FAF8 0%, #E0E2DB 100%)"
        }}
      >

        {/* COURSES */}
        {activeTab === "courses" && (
          <>
            <button
              onClick={() => navigate("/instructor/upload")}
              className="mb-8 px-6 py-3 rounded-xl font-semibold text-white shadow-md transition"
              style={{ backgroundColor: "#6F8F9B" }}
            >
              + Upload New Course
            </button>

            <div className="grid md:grid-cols-2 gap-8">
              {courses.map(c => (
                <motion.div
                  key={c.id}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => navigate(`/instructor/course/${c.id}`)}
                  className="cursor-pointer rounded-3xl p-7 shadow-lg transition"
                  style={{
                    backgroundColor: "#F9FAF8",
                    border: "1px solid #D2D4C8"
                  }}
                >
                  <h3
                    className="text-2xl font-semibold mb-2"
                    style={{ color: "#4E6F88" }}
                  >
                    {c.title}
                  </h3>
                  <p className="text-sm">
                    Status: <b>{c.status}</b>
                  </p>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid md:grid-cols-3 gap-8">
            <Stat title="Total Earned" value={`৳${summary.totalEarned}`} />
            <Stat title="Withdrawn" value={`৳${summary.totalWithdrawn}`} />
            <Stat title="Available Balance" value={`৳${summary.availableBalance}`} />
          </div>
        )}

        {/* WITHDRAW */}
        {activeTab === "withdraw" && (
          <div className="max-w-lg">

            <BalanceCard value={summary.availableBalance} />

            <div className="card mb-8">
              <input
                type="number"
                value={withdrawAmount}
                onChange={e => setWithdrawAmount(e.target.value)}
                placeholder="Withdraw amount"
                className="w-full p-3 rounded-lg mb-4 border"
                style={{ borderColor: "#6F8F9B" }}
              />

              <button
                onClick={handleWithdraw}
                className="w-full py-3 rounded-lg font-semibold text-white transition"
                style={{ backgroundColor: "#6F8F9B" }}
              >
                Request Withdrawal
              </button>
            </div>

            <h3 className="font-bold mb-4">Withdrawal History</h3>

            {withdrawals.map(w => (
              <div key={w.id} className="card mb-3">
                <p className="font-semibold">৳{w.amount}</p>
                <p className="text-sm opacity-70">
                  Status: {w.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

/* ===== COMPONENTS ===== */

function Stat({ title, value }) {
  return (
    <div className="card">
      <p className="text-sm opacity-70">{title}</p>
      <h2 className="text-3xl font-extrabold mt-1" style={{ color: "#4E6F88" }}>
        {value}
      </h2>
    </div>
  );
}

function BalanceCard({ value }) {
  return (
    <div className="card mb-8">
      <p className="text-sm opacity-70">Available Balance</p>
      <h2 className="text-4xl font-extrabold mt-1" style={{ color: "#4E6F88" }}>
        ৳{value}
      </h2>
    </div>
  );
}

/* ===== UTILITY CARD STYLE ===== */
const cardClass =
  "p-7 rounded-3xl shadow-lg";

document.documentElement.style.setProperty(
  "--card-style",
  cardClass
);
