import api from "./axios";

export const getInstructorCourses = () => api.get("/instructor/my-courses");

export const uploadCourse = (data) =>
  api.post("/instructor/upload-course", data);

export const uploadMaterial = (courseId, data) =>
  api.post(`/instructor/upload-material/${courseId}`, data);

export const getInstructorSummary = () =>
  api.get("/instructor/summary");
