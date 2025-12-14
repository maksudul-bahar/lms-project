import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";

import LearnerDashboard from "./pages/learner/Dashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import UploadCourse from "./pages/UploadCourse";
import UploadMaterial from "./pages/UploadMaterial";
import AdminDashboard from "./pages/AdminDashboard";

import Certificate from "./pages/learner/Certificate";
import CoursePlayer from "./pages/learner/CoursePlayer";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public */}
          <Route path="/" element={<Courses />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses/:id" element={<CourseDetails />} />

          {/* Learner */}
          <Route path="/learner" element={<LearnerDashboard />} />
          <Route path="/learner/course/:id" element={<CoursePlayer />} />
          <Route path="/learner/certificate/:id" element={<Certificate />} />

          {/* Instructor */}
          <Route path="/instructor" element={<InstructorDashboard />} />
          

          <Route path="/instructor/upload" element={<UploadCourse />} />
          <Route path="/instructor/upload-material/:courseId" element={<UploadMaterial />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
