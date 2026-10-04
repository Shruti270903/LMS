import express from "express";

import {
  getAdminDashboard,
  getStudents,
  getStudentById,
  getEducators,
  getEducatorById,
  getCourses,
} from "../controllers/adminController.js";

import { protectAdmin } from "../../middlewares/authMiddleware.js";

const adminRouter = express.Router();


/* =========================================================
   DASHBOARD
   ========================================================= */

adminRouter.get(
  "/dashboard",
  protectAdmin,
  getAdminDashboard
);


/* =========================================================
   STUDENTS
   ========================================================= */

// Get all students
adminRouter.get(
  "/students",
  protectAdmin,
  getStudents
);

// Get one student
adminRouter.get(
  "/students/:id",
  protectAdmin,
  getStudentById
);


/* =========================================================
   EDUCATORS
   ========================================================= */

// Get all educators
adminRouter.get(
  "/educators",
  protectAdmin,
  getEducators
);

// Get one educator
adminRouter.get(
  "/educators/:id",
  protectAdmin,
  getEducatorById
);


/* =========================================================
   COURSES
   ========================================================= */

adminRouter.get(
  "/courses",
  protectAdmin,
  getCourses
);


export default adminRouter;