import React from "react";
import { Route, Routes, useLocation, useMatch } from "react-router-dom";

import Home from "./pages/student/Home";
import CoursesList from "./pages/student/CoursesList";
import CourseDetails from "./pages/student/CourseDetails";
import MyEnrollments from "./pages/student/MyEnrollments";
import Player from "./pages/student/Player";
import Loading from "./components/student/Loading";

import Educator from "./pages/educator/Educator";
import Dashboard from "./pages/educator/Dashboard";
import AddCourse from "./pages/educator/AddCourse";
import MyCourses from "./pages/educator/MyCourses";
import StudentsEnrolled from "./pages/educator/StudentsEnrolled";

import Navbar from "./components/student/Navbar";

import Login from "./auth/Login";
import Register from "./auth/Register";
import EmailVerify from "./auth/EmailVerify";
import ResetPassword from "./auth/ResetPassword";

import "quill/dist/quill.snow.css";
import { ToastContainer } from "react-toastify";
import EditProfile from './pages/student/EditProfile' // <--- 1. Import EditProfile
const App = () => {
  const location = useLocation();
  const isEducatorRoute = useMatch("/educator/*");

  // Hide the normal LMS Navbar on authentication pages
  const isAuthRoute =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/email-verify" ||
    location.pathname === "/reset-password";

  return (
    <div className="text-default min-h-screen bg-white">
      <ToastContainer />

      {!isEducatorRoute && !isAuthRoute && <Navbar />}

      <Routes>
        {/* ==================== AUTH ROUTES ==================== */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ==================== STUDENT ROUTES ==================== */}
        <Route path="/" element={<Home />} />

        <Route path="/course-list" element={<CoursesList />} />
        <Route path="/course-list/:input" element={<CoursesList />} />

        <Route path="/course/:id" element={<CourseDetails />} />

        <Route path="/my-enrollments" element={<MyEnrollments />} />

        <Route path="/player/:courseId" element={<Player />} />

        <Route path="/loading/:path" element={<Loading />} />
        <Route path='/edit-profile' element={<EditProfile />} /> {/* <--- 2. Add Route */}

        {/* ==================== EDUCATOR ROUTES ==================== */}
        <Route path="/educator" element={<Educator />}>
          <Route index element={<Dashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="student-enrolled" element={<StudentsEnrolled />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;