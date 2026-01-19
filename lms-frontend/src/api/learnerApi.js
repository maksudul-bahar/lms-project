// src/api/learnerApi.js
import api from "./axios";

/* ================= PROFILE ================= */
export const getLearnerProfile = () => api.get("/user/profile");

/* ================= COURSES ================= */
export const getMyCourses = () => api.get("/learner/my-courses");
export const getAllCourses = () => api.get("/courses");

/* ================= PURCHASE ================= */
export const purchaseCourse = (courseId, secret) =>
  api.post(`/purchase/buy/${courseId}`, { secret });

/* ================= COURSE PROGRESS ================= */
export const markCompleted = (courseId) =>
  api.post(`/completion/complete/${courseId}`);

/* ================= CERTIFICATE ================= */
export const getCertificate = (courseId) =>
  api.get(`/certificate/${courseId}`, { responseType: "blob" });
