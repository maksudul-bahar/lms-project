import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_LMS_API_URL, // ✅ must be a STRING
  withCredentials: false, // JWT-based auth (not cookies) 
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
