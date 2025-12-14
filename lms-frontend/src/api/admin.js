import api from "./axios";

export const getPendingInstructors = () =>
  api.get("/admin/pending-instructors");

export const approveInstructor = (id) =>
  api.post(`/admin/approve-instructor/${id}`);

export const getPendingCourses = () =>
  api.get("/admin/pending-courses");

export const approveCourse = (id) =>
  api.post(`/admin/approve-course/${id}`);

export const rejectCourse = (id, reason) =>
  api.post(`/admin/reject-course/${id}`, { reason });

export const getAllUsers = () =>
  api.get("/admin/users");

export const getTransactions = () =>
  api.get("/admin/transactions");

export const getApprovedLearners = () =>
  api.get("/admin/approved-learners");

export const getApprovedInstructors = () =>
  api.get("/admin/approved-instructors");

export const getApprovedCourses = () =>
  api.get("/admin/approved-courses");
