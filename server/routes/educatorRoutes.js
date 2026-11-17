
import express from "express";

import {
  addCourse,
  getEducatorCourses,
  updateRoleToEducator,
  educatorDashboardData,
  getEnrolledStudentsData,
} from "../controllers/educatorController.js";

import upload from "../configs/multer.js";

import {
  protectUser,
  protectEducator,
} from "../middlewares/authMiddleware.js";

const educatorRouter = express.Router();

// Update student role to educator
educatorRouter.post(
  "/update-role",
  protectUser,
  updateRoleToEducator
);

// Add new course (educator only)
educatorRouter.post(
  "/add-course",
  protectEducator,
  upload.single("image"),
  addCourse
);

// Get educator courses
educatorRouter.get(
  "/courses",
  protectEducator,
  getEducatorCourses
);

// Get educator dashboard data
educatorRouter.get(
  "/dashboard",
  protectEducator,
  educatorDashboardData
);

// Get enrolled students
educatorRouter.get(
  "/enrolled-students",
  protectEducator,
  getEnrolledStudentsData
);

export default educatorRouter;
