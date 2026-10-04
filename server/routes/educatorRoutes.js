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


/* =========================================================
   UPDATE ROLE TO EDUCATOR
   Logged-in student can request educator role
   ========================================================= */

educatorRouter.get(
  "/update-role",
  protectUser,
  updateRoleToEducator
);


/* =========================================================
   ADD COURSE
   Educator only
   ========================================================= */

educatorRouter.post(
  "/add-course",
  upload.single("image"),
  protectEducator,
  addCourse
);


/* =========================================================
   GET EDUCATOR COURSES
   Educator only
   ========================================================= */

educatorRouter.get(
  "/courses",
  protectEducator,
  getEducatorCourses
);


/* =========================================================
   EDUCATOR DASHBOARD
   Educator only
   ========================================================= */

educatorRouter.get(
  "/dashboard",
  protectEducator,
  educatorDashboardData
);


/* =========================================================
   ENROLLED STUDENTS
   Educator only
   ========================================================= */

educatorRouter.get(
  "/enrolled-students",
  protectEducator,
  getEnrolledStudentsData
);


export default educatorRouter;