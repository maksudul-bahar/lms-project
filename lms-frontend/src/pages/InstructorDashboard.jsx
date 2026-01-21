import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  getInstructorCourses,
  getInstructorSummary,
  requestWithdrawal,
  getInstructorWithdrawals
} from "../api/instructor";

import {
  linkBankAccount,
  getBankBalance
} from "../api/userApi";

import api from "../api/axios";
import { logout } from "../utils/logout";

export default function InstructorDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("courses");
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);

  const [summary, setSummary] = useState({
    totalEarned: 0,
    totalWithdrawn: 0,
    availableBalance: 0
  });

  const [bankBalance, setBankBalance] = useState(null);

  const [withdrawAmount, setWithdrawAmount] = useState("");

  const [showBankForm, setShowBankForm] = useState(false);
  const [bank, setBank] = useState({ accountNumber: "", secret: "" });

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const p = await api.get("/user/profile");
      setProfile(p.data);

      if (p.data.bankAccountNumber) {
        const b = await getBankBalance();
        setBankBalance(b.data.balance);
      }

      const c = await getInstructorCourses();
      const s = await getInstructorSummary();
      const w = await getInstructorWithdrawals();

      setCourses(c.data || []);
      setSummary(s.data);
      setWithdrawals(w.data || []);
    } finally {
      setLoading(false);
    }
  };

  /* ================= BANK LINK ================= */
  const handleBankLink = async () => {
    await linkBankAccount(bank);
    alert("Bank linked successfully");

    setShowBankForm(false);
    setBank({ accountNumber: "", secret: "" });
    loadData();
  };

  /* ================= WITHDRAW ================= */
  const handleWithdraw = async () => {
    await requestWithdrawal(withdrawAmount);
    alert("Withdrawal requested");
    setWithdrawAmount("");
    loadData();
  };

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="min-h-screen flex bg-[#E0E2DB] text-[#2E3532]">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 h-screen flex flex-col bg-[#D2D4C8] shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-extrabold">Instructor</h1>
          <p className="text-sm opacity-70 truncate">{profile.email}</p>
        </div>

        <div className="flex-1 p-4 space-y-2">
          {["courses", "overview", "withdraw"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-2 rounded-lg ${
                activeTab === tab ? "bg-white" : ""
              }`}
            >
              {tab === "courses"
                ? "My Courses"
                : tab === "overview"
                ? "Overview"
                : "Withdraw"}
            </button>
          ))}
        </div>

        <div className="p-4 border-t">
          <button
            onClick={logout}
            className="w-full py-2 rounded-lg bg-[#6F8F9B] text-white"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-10 overflow-y-auto bg-gradient-to-b from-[#F9FAF8] to-[#E0E2DB]">

        {/* ================= COURSES ================= */}
        {activeTab === "courses" && (
          <>
            {!profile.bankAccountNumber && (
              <Warning onClick={() => setShowBankForm(true)} />
            )}

            <button
              onClick={() => navigate("/instructor/upload")}
              className="mb-8 px-6 py-3 rounded-xl bg-[#6F8F9B] text-white"
            >
              + Upload New Course
            </button>

            <div className="grid md:grid-cols-2 gap-8">
              {courses.map(c => (
                <motion.div
                  key={c.id}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => navigate(`/instructor/course/${c.id}`)}
                  className="cursor-pointer rounded-3xl p-7 shadow-lg bg-white"
                >
                  <h3 className="text-2xl font-semibold mb-2 text-[#4E6F88]">
                    {c.title}
                  </h3>
                  <p>Status: <b>{c.status}</b></p>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* ================= OVERVIEW ================= */}
        {activeTab === "overview" && (
          <>
            {!profile.bankAccountNumber && (
              <Warning onClick={() => setShowBankForm(true)} />
            )}

            <div className="grid md:grid-cols-4 gap-8">
              <Stat title="Total Earned" value={`৳${summary.totalEarned}`} />
              <Stat title="Withdrawn" value={`৳${summary.totalWithdrawn}`} />
              <Stat title="Available (LMS)" value={`৳${summary.availableBalance}`} />
              {bankBalance !== null && (
                <Stat title="Bank Balance" value={`৳${bankBalance}`} />
              )}
            </div>
          </>
        )}

        {/* ================= WITHDRAW ================= */}
        {activeTab === "withdraw" && (
          <>
            {!profile.bankAccountNumber && (
              <Warning onClick={() => setShowBankForm(true)} />
            )}

            <div className="max-w-lg">
              <BalanceCard value={summary.availableBalance} />

              <input
                type="number"
                value={withdrawAmount}
                onChange={e => setWithdrawAmount(e.target.value)}
                placeholder="Withdraw amount"
                className="w-full p-3 rounded-lg mb-4 border"
              />

              <button
                onClick={handleWithdraw}
                className="w-full py-3 rounded-lg bg-[#6F8F9B] text-white"
              >
                Request Withdrawal
              </button>

              <h3 className="font-bold mt-8 mb-4">Withdrawal History</h3>
              {withdrawals.map(w => (
                <div key={w.id} className="p-4 bg-white rounded-lg mb-2">
                  <p>৳{w.amount}</p>
                  <p className="text-sm opacity-70">{w.status}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* ================= BANK MODAL ================= */}
      {showBankForm && (
        <Modal onClose={() => setShowBankForm(false)}>
          <h3 className="text-xl font-bold mb-3">🔗 Link Bank Account</h3>

          <input
            placeholder="Account Number"
            className="input"
            value={bank.accountNumber}
            onChange={e =>
              setBank({ ...bank, accountNumber: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Secret PIN"
            className="input"
            value={bank.secret}
            onChange={e =>
              setBank({ ...bank, secret: e.target.value })
            }
          />

          <button onClick={handleBankLink} className="btn">
            Link Account
          </button>
        </Modal>
      )}
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Warning({ onClick }) {
  return (
    <div className="mb-6 p-5 rounded-xl bg-[#D2D4C8] border">
      <h3 className="font-bold mb-2">🔗 Bank account required</h3>
      <button onClick={onClick} className="btn">
        Link Bank Account
      </button>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="p-6 bg-white rounded-3xl shadow">
      <p className="text-sm opacity-70">{title}</p>
      <h2 className="text-3xl font-extrabold mt-1 text-[#4E6F88]">
        {value}
      </h2>
    </div>
  );
}

function BalanceCard({ value }) {
  return (
    <div className="p-6 bg-white rounded-3xl shadow mb-6">
      <p className="text-sm opacity-70">Available Balance</p>
      <h2 className="text-4xl font-extrabold mt-1 text-[#4E6F88]">
        ৳{value}
      </h2>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="p-6 rounded-xl w-full max-w-md bg-white space-y-3">
        {children}
        <button onClick={onClose} className="w-full py-2 rounded bg-gray-200">
          Cancel
        </button>
      </div>
    </div>
  );
}
