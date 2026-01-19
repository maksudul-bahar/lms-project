import api from "./axios";

/* ================= INSTRUCTORS ================= */

// pending instructors
export const getPendingInstructors = () =>
  api.get("/admin/pending-instructors");

// approve instructor
export const approveInstructor = (id) =>
  api.post(`/admin/approve-instructor/${id}`);

// approved instructors
export const getApprovedInstructors = () =>
  api.get("/admin/approved-instructors");

/* ================= COURSES ================= */

// pending courses
export const getPendingCourses = () =>
  api.get("/admin/pending-courses");

// approve course
export const approveCourse = (id) =>
  api.post(`/admin/approve-course/${id}`);

// reject course
export const rejectCourse = (id, reason) =>
  api.post(`/admin/reject-course/${id}`, { reason });

// approved courses
export const getApprovedCourses = () =>
  api.get("/admin/approved-courses");

/* ================= LEARNERS ================= */

export const getApprovedLearners = () =>
  api.get("/admin/approved-learners");

/* ================= TRANSACTIONS ================= */

export const getInstructorTransactions = () =>
  api.get("/admin/transactions");

/* ================= PAYOUTS ================= */

// view payout requests
export const getPayoutRequests = () =>
  api.get("/admin/payout-requests");

// approve payout
export const approvePayout = (id) =>
  api.post(`/admin/approve-payout/${id}`);
