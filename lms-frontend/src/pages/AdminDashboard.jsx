import { useEffect, useState } from "react";
import api from "../api/axios";



export default function AdminDashboard() {
  const [pendingInstructors, setPendingInstructors] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [approvedLearners, setApprovedLearners] = useState([]);
  const [approvedInstructors, setApprovedInstructors] = useState([]);
  const [approvedCourses, setApprovedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===============================
  // Fetch all admin data
  // ===============================
  const fetchAdminData = async () => {
    try {
      setLoading(true);

      const [
        pendingInstRes,
        pendingCourseRes,
        learnersRes,
        instructorsRes,
        coursesRes
      ] = await Promise.all([
        api.get("/admin/pending-instructors"),
        api.get("/admin/pending-courses"),
        api.get("/admin/approved-learners"),
        api.get("/admin/approved-instructors"),
        api.get("/admin/approved-courses")
      ]);

      setPendingInstructors(pendingInstRes.data);
      setPendingCourses(pendingCourseRes.data);
      setApprovedLearners(learnersRes.data);
      setApprovedInstructors(instructorsRes.data);
      setApprovedCourses(coursesRes.data);

      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // Approve instructor
  // ===============================
  const approveInstructor = async (id) => {
    await api.post(`/admin/approve-instructor/${id}`);
    fetchAdminData();
  };

  // ===============================
  // Approve course
  // ===============================
  const approveCourse = async (id) => {
    await api.post(`/admin/approve-course/${id}`);
    fetchAdminData();
  };

  // ===============================
  // Reject course
  // ===============================
  const rejectCourse = async (id) => {
    const reason = prompt("Enter rejection reason");
    if (!reason) return;

    await api.post(`/admin/reject-course/${id}`, { reason });
    fetchAdminData();
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading) return <p>Loading admin dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      {/* ================= Pending Instructors ================= */}
      <section>
        <h2>Pending Instructors</h2>
        {pendingInstructors.length === 0 && <p>No pending instructors</p>}
        {pendingInstructors.map((i) => (
          <div key={i.id}>
            {i.name} ({i.email})
            <button onClick={() => approveInstructor(i.id)}>Approve</button>
          </div>
        ))}
      </section>

      <hr />

      {/* ================= Pending Courses ================= */}
      <section>
        <h2>Pending Courses</h2>
        {pendingCourses.length === 0 && <p>No pending courses</p>}
        {pendingCourses.map((c) => (
          <div key={c.id}>
            <strong>{c.title}</strong> — ${c.price}
            <button onClick={() => approveCourse(c.id)}>Approve</button>
            <button onClick={() => rejectCourse(c.id)}>Reject</button>
          </div>
        ))}
      </section>

      <hr />

      {/* ================= Approved Learners ================= */}
      <section>
        <h2>Approved Learners</h2>
        {approvedLearners.map((l) => (
          <div key={l.id}>
            {l.name} ({l.email})
          </div>
        ))}
      </section>

      <hr />

      {/* ================= Approved Instructors ================= */}
      <section>
        <h2>Approved Instructors</h2>
        {approvedInstructors.map((i) => (
          <div key={i.id}>
            {i.name} ({i.email})
          </div>
        ))}
      </section>

      <hr />

      {/* ================= Approved Courses ================= */}
      <section>
        <h2>Approved Courses</h2>
        {approvedCourses.map((c) => (
          <div key={c.id} style={{ marginBottom: "10px" }}>
            <strong>{c.title}</strong> — Instructor: {c.User?.name}
            <ul>
              {c.CourseMaterials?.map((m) => (
                <li key={m.id}>
                  [{m.type}] {m.content}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
