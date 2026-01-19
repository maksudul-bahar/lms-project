import api from "./axios";

/* ================= COURSES ================= */
export const getInstructorCourses = () =>
  api.get("/instructor/my-courses");

export const uploadCourse = (data) =>
  api.post("/instructor/upload-course", data);

export const uploadMaterial = (courseId, data) =>
  api.post(`/instructor/upload-material/${courseId}`, data);

/* ================= SUMMARY ================= */
export const getInstructorSummary = () =>
  api.get("/instructor/summary");

/* ================= WITHDRAW ================= */
export const requestWithdrawal = (amount) =>
  api.post("/instructor/withdraw", { amount });

export const getInstructorWithdrawals = () =>
  api.get("/instructor/withdrawals");

