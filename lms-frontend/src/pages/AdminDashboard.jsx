import { useEffect, useState } from "react";
import {
  getApprovedLearners,
  getApprovedInstructors,
  getPendingInstructors,
  approveInstructor,
  getPendingCourses,
  approveCourse,
  getApprovedCourses,
  getPayoutRequests,
  approvePayout
} from "../api/admin";

import { getBankBalance } from "../api/userApi"; // <-- use this

import { logout } from "../utils/logout";

const titleMap = {
  learners: "Learners",
  instructors: "Instructors",
  pending_instructors: "Instructor Requests",
  pending_courses: "Pending Courses",
  approved_courses: "Approved Courses",
  payouts: "Payout Requests",
};

export default function AdminDashboard() {
  const [active, setActive] = useState("learners");
  const [loading, setLoading] = useState(true);

  const [learners, setLearners] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [pendingInstructors, setPendingInstructors] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [approvedCourses, setApprovedCourses] = useState([]);
  const [payouts, setPayouts] = useState([]);

  const [bankBalance, setBankBalance] = useState(null); // <-- balance state

  const loadData = async () => {
    try {
      setLoading(true);
      const [l, i, pi, pc, ac, pr, bb] = await Promise.all([
        getApprovedLearners(),
        getApprovedInstructors(),
        getPendingInstructors(),
        getPendingCourses(),
        getApprovedCourses(),
        getPayoutRequests(),
        getBankBalance() // <-- fetch from userApi
      ]);

      setLearners(l.data || []);
      setInstructors(i.data || []);
      setPendingInstructors(pi.data || []);
      setPendingCourses(pc.data || []);
      setApprovedCourses(ac.data || []);
      setPayouts(pr.data || []);
      setBankBalance(bb.data?.balance ?? null); // <-- set balance
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-xl font-semibold"
        style={{ backgroundColor: "#E0E2DB", color: "#2E3532" }}
      >
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: "#E0E2DB", color: "#2E3532" }}
    >
      {/* ================= SIDEBAR ================= */}
      <aside
        className="w-72 p-6 flex flex-col shadow-xl"
        style={{ backgroundColor: "#D2D4C8" }}
      >
        <h1 className="text-2xl font-bold">Admin Console</h1>
        <p className="text-sm opacity-70 mb-6">
          Platform Control Center
        </p>

        <nav className="space-y-2 flex-1">
          {Object.keys(titleMap).map(key => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className="w-full text-left px-4 py-2 rounded-lg font-medium transition"
              style={{
                backgroundColor:
                  active === key ? "#F9FAF8" : "transparent",
                color: "#2E3532",
              }}
            >
              {titleMap[key]}
            </button>
          ))}
        </nav>

        <button
          onClick={logout}
          className="mt-6 py-2 rounded-lg font-semibold transition"
          style={{
            backgroundColor: "#6F8F9B",
            color: "#F9FAF8",
          }}
        >
          Logout
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main
        className="flex-1 p-8 overflow-y-auto"
        style={{ backgroundColor: "#F9FAF8" }}
      >
        <h2 className="text-3xl font-bold mb-6">
          {titleMap[active]}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {renderSection(active, {
            learners,
            instructors,
            pendingInstructors,
            pendingCourses,
            approvedCourses,
            payouts,
            bankBalance, // pass balance
            reload: loadData,
          })}
        </div>
      </main>
    </div>
  );
}

/* ================= CONTENT ================= */

function renderSection(active, data) {
  /* ===== PAYOUTS ===== */
  if (active === "payouts") {
    return (
      <>
        <Card>
          <h3 className="font-bold text-lg">Admin Bank Balance</h3>
          <p className="mt-1 text-sm">
            {data.bankBalance === null
              ? "No bank linked"
              : `৳${data.bankBalance}`}
          </p>
        </Card>

        {data.payouts.length === 0 && (
          <p className="opacity-70">No payout requests found</p>
        )}

        {data.payouts.map(payout => (
          <Card key={payout.id}>
            <h3 className="font-bold">
              {payout.User?.name || payout.name}
            </h3>

            <p className="text-sm mt-1">
              Amount: <b>৳{payout.amount}</b>
            </p>

            <ActionButton
              label="Approve Payout"
              onClick={() =>
                approvePayout(payout.id).then(data.reload)
              }
            />
          </Card>
        ))}
      </>
    );
  }

  /* ===== COURSES (Pending + Approved) ===== */
  if (active === "pending_courses" || active === "approved_courses") {
    const courses =
      active === "pending_courses"
        ? data.pendingCourses
        : data.approvedCourses;

    if (!courses.length) {
      return <p className="opacity-70">No records found</p>;
    }

    return courses.map(course => (
      <Card key={course.id}>
        <h3 className="text-lg font-bold">{course.title}</h3>

        <p className="text-sm mt-1">
          Status: <b>{course.status}</b>
        </p>

        <p className="text-sm mt-1 font-semibold text-green-700">
          💰 Price: ৳{course.price}
        </p>

        {active === "pending_courses" && (
          <ActionButton
            label="Approve Course"
            onClick={() =>
              approveCourse(course.id).then(data.reload)
            }
          />
        )}
      </Card>
    ));
  }

  /* ===== OTHER SECTIONS ===== */
  const map = {
    learners: data.learners,
    instructors: data.instructors,
    pending_instructors: data.pendingInstructors,
  }[active];

  if (!map.length) {
    return <p className="opacity-70">No records found</p>;
  }

  return map.map(item => (
    <Card key={item.id}>
      <h3 className="font-bold">
        {item.User?.name || item.name}
      </h3>

      <p className="text-sm mt-1">
        {item.email}
      </p>

      {active === "pending_instructors" && (
        <ActionButton
          label="Approve Instructor"
          onClick={() =>
            approveInstructor(item.id).then(data.reload)
          }
        />
      )}
    </Card>
  ));
}

/* ================= UI ================= */

function Card({ children }) {
  return (
    <div
      className="rounded-2xl p-6 shadow-md"
      style={{
        backgroundColor: "#D2D4C8",
        color: "#2E3532",
      }}
    >
      {children}
    </div>
  );
}

function ActionButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="mt-4 w-full py-2 rounded-lg font-semibold transition"
      style={{
        backgroundColor: "#6F8F9B",
        color: "#F9FAF8",
      }}
    >
      {label}
    </button>
  );
}
