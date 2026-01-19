import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

/* Public pages */
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";

/* Learner pages */
import LearnerDashboard from "./pages/learner/Dashboard";
import CoursePlayer from "./pages/learner/CoursePlayer";
import Certificate from "./pages/learner/Certificate";

/* Instructor pages */
import InstructorDashboard from "./pages/InstructorDashboard";
import UploadCourse from "./pages/UploadCourse";
import UploadMaterial from "./pages/UploadMaterial";
import InstructorCourseDetails from "./pages/InstructorCourseDetails";

/* Admin page */
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ================= PUBLIC ================= */}
          <Route path="/" element={<Courses />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses/:id" element={<CourseDetails />} />

          {/* ================= LEARNER ================= */}
          <Route
            path="/learner"
            element={
              <ProtectedRoute role="learner">
                <LearnerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/learner/course/:id"
            element={
              <ProtectedRoute role="learner">
                <CoursePlayer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/learner/certificate/:id"
            element={
              <ProtectedRoute role="learner">
                <Certificate />
              </ProtectedRoute>
            }
          />

          {/* ================= INSTRUCTOR ================= */}
          <Route
            path="/instructor"
            element={
              <ProtectedRoute role="instructor">
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/instructor/upload"
            element={
              <ProtectedRoute role="instructor">
                <UploadCourse />
              </ProtectedRoute>
            }
          />

          <Route
            path="/instructor/upload-material/:courseId"
            element={
              <ProtectedRoute role="instructor">
                <UploadMaterial />
              </ProtectedRoute>
            }
          />
          <Route
  path="/instructor/course/:id"
  element={
    <ProtectedRoute role="instructor">
      <InstructorCourseDetails />
    </ProtectedRoute>
  }
/>


          {/* ================= ADMIN ================= */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
