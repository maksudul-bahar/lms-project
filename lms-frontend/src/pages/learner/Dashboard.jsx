import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  getLearnerProfile,
  getMyCourses,
  getAllCourses,
  purchaseCourse
} from "../../api/learnerApi";

import { linkBankAccount, getBankBalance } from "../../api/userApi"; // <-- add balance

import { logout } from "../../utils/logout";

export default function LearnerDashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);

  const [activeTab, setActiveTab] = useState("my");
  const [showBankForm, setShowBankForm] = useState(false);
  const [bank, setBank] = useState({ accountNumber: "", secret: "" });

  const [purchaseCourseId, setPurchaseCourseId] = useState(null);
  const [purchaseSecret, setPurchaseSecret] = useState("");

  const [bankBalance, setBankBalance] = useState(null); // <-- new state

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const profileRes = await getLearnerProfile();
    const myRes = await getMyCourses();
    const allRes = await getAllCourses();
    const balanceRes = await getBankBalance(); // <-- fetch balance

    setProfile(profileRes.data);
    setMyCourses(myRes.data);
    setAllCourses(allRes.data);
    setBankBalance(balanceRes.data?.balance ?? null); // <-- set balance
  };

  /* ================= BANK LINK ================= */
  const handleBankLink = async () => {
    await linkBankAccount(bank);
    setShowBankForm(false);
    setBank({ accountNumber: "", secret: "" });
    loadData(); // refresh profile + balance
  };

  /* ================= PURCHASE ================= */
  const handlePurchase = async () => {
    await purchaseCourse(purchaseCourseId, purchaseSecret);
    setPurchaseCourseId(null);
    setPurchaseSecret("");
    loadData();
  };

  if (!profile) return <div className="p-10">Loading...</div>;

  const purchasedIds = myCourses.map(c => c.id);
  const availableCourses = allCourses.filter(
    c => !purchasedIds.includes(c.id)
  );

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#E0E2DB" }}>
      {/* ================= SIDEBAR ================= */}
      <aside
        className="w-64 p-6 flex flex-col"
        style={{ backgroundColor: "#2E3532", color: "#F9FAF8" }}
      >
        <h1 className="text-2xl font-bold mb-1">🎓 EduLMS</h1>
        <p className="text-sm opacity-80 mb-10">{profile.email}</p>

        <nav className="space-y-2">
          {["my", "available"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="w-full text-left px-4 py-3 rounded-lg transition"
              style={{
                backgroundColor:
                  activeTab === tab ? "#6F8F9B" : "transparent"
              }}
            >
              {tab === "my" ? "📘 My Courses" : "🛒 Available Courses"}
            </button>
          ))}
        </nav>

        <button
          onClick={logout}
          className="mt-auto px-4 py-2 rounded-lg text-white"
          style={{ backgroundColor: "#4E6F88" }}
        >
          Logout
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-6" style={{ color: "#2E3532" }}>
          Welcome, {profile.name}
        </h2>

        {/* ================= BANK WARNING ================= */}
        {!profile.bankAccountNumber && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-5 rounded-xl"
            style={{
              backgroundColor: "#D2D4C8",
              border: "1px solid #6F8F9B"
            }}
          >
            <h3 className="font-bold mb-2">🔗 Bank account required</h3>
            <button
              onClick={() => setShowBankForm(true)}
              className="px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: "#6F8F9B" }}
            >
              Link Bank Account
            </button>
          </motion.div>
        )}

        {/* ================= MY COURSES ================= */}
        {activeTab === "my" && (
          <Section title="📘 My Courses">
            {myCourses.length === 0 ? (
              <Empty text="You have not purchased any courses yet." />
            ) : (
              myCourses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  showPrice={false}
                  actionLabel="Open"
                  onAction={() =>
                    navigate(`/learner/course/${course.id}`)
                  }
                />
              ))
            )}
          </Section>
        )}

        {/* ================= AVAILABLE COURSES ================= */}
        {activeTab === "available" && (
          <Section title="🛒 Available Courses">

            {/* <-- NEW: Show bank balance here */}
            <div className="mb-4 p-4 rounded-xl bg-white">
              <h3 className="font-bold">
                💰 Bank Balance:
              </h3>
              <p className="text-sm">
                {profile.bankAccountNumber
                  ? `৳${bankBalance ?? 0}`
                  : "No bank linked yet"}
              </p>
            </div>

            {availableCourses.length === 0 ? (
              <Empty text="No new courses available." />
            ) : (
              availableCourses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  showPrice={true}
                  actionLabel={
                    profile.bankAccountNumber
                      ? "Purchase"
                      : "Link Bank Account"
                  }
                  onAction={() => {
                    if (!profile.bankAccountNumber) {
                      setShowBankForm(true);
                      return;
                    }
                    setPurchaseCourseId(course.id);
                  }}
                />
              ))
            )}
          </Section>
        )}
      </main>

      {/* ================= BANK MODAL ================= */}
      {showBankForm && (
        <Modal onClose={() => setShowBankForm(false)}>
          <h3 className="text-xl font-bold mb-3">🔗 Link Bank Account</h3>

          <input
            className="w-full p-2 rounded"
            placeholder="Account Number"
            value={bank.accountNumber}
            onChange={e =>
              setBank({ ...bank, accountNumber: e.target.value })
            }
          />

          <input
            type="password"
            className="w-full p-2 rounded"
            placeholder="Secret PIN"
            value={bank.secret}
            onChange={e =>
              setBank({ ...bank, secret: e.target.value })
            }
          />

          <button
            onClick={handleBankLink}
            className="w-full py-2 rounded text-white"
            style={{ backgroundColor: "#6F8F9B" }}
          >
            Link Account
          </button>
        </Modal>
      )}

      {/* ================= PURCHASE MODAL ================= */}
      {purchaseCourseId && (
        <Modal onClose={() => setPurchaseCourseId(null)}>
          <h3 className="text-xl font-bold mb-3">💳 Confirm Purchase</h3>

          <input
            type="password"
            className="w-full p-2 rounded"
            placeholder="Enter Bank PIN"
            value={purchaseSecret}
            onChange={e => setPurchaseSecret(e.target.value)}
          />

          <button
            onClick={handlePurchase}
            className="w-full py-2 rounded text-white"
            style={{ backgroundColor: "#6F8F9B" }}
          >
            Confirm Purchase
          </button>
        </Modal>
      )}
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <div className="grid gap-4">{children}</div>
    </div>
  );
}

function CourseCard({ course, actionLabel, onAction, showPrice }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-xl p-5 shadow-md"
      style={{ backgroundColor: "#F9FAF8" }}
    >
      <h4 className="text-lg font-bold mb-1">{course.title}</h4>

      {showPrice && (
        <p className="font-semibold mb-2 text-green-700">
          💰 Price: {course.price} taka
        </p>
      )}

      <p className="text-sm mb-4">{course.description}</p>

      <button
        onClick={onAction}
        className="px-4 py-2 rounded-lg text-white"
        style={{ backgroundColor: "#6F8F9B" }}
      >
        {actionLabel}
      </button>
    </motion.div>
  );
}

function Empty({ text }) {
  return (
    <div className="p-6 rounded-xl bg-white">
      {text}
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="p-6 rounded-xl w-full max-w-md space-y-3 bg-white">
        {children}
        <button
          onClick={onClose}
          className="w-full py-2 rounded bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
