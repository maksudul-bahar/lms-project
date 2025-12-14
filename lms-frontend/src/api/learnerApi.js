import api from "./axios";

export const getMyCourses = () => api.get("/learner/my-courses");
export const markCompleted = (courseId) =>
  api.post(`/completion/complete/${courseId}`);
export const getCertificate = (courseId) =>
  api.get(`/certificate/${courseId}`, { responseType: "blob" });
