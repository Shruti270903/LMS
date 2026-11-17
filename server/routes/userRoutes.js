import express from "express";
import {
  addUserRating,
  getUserCourseProgress,
  getUserData,
  purchaseCourse,
  updateUserCourseProgress,
  userEnrolledCourses,
    updateUserProfile,
     deleteAccount,
} from "../controllers/userController.js";

import { protectUser } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/data", protectUser, getUserData);

userRouter.patch(
  "/profile",
  protectUser,
  updateUserProfile
);

userRouter.get(
  "/enrolled-courses",
  protectUser,
  userEnrolledCourses
);

userRouter.post(
  "/purchase",
  protectUser,
  purchaseCourse
);

userRouter.post(
  "/update-course-progress",
  protectUser,
  updateUserCourseProgress
);

userRouter.post(
  "/get-course-progress",
  protectUser,
  getUserCourseProgress
);

userRouter.post(
  "/add-rating",
  protectUser,
  addUserRating
);

userRouter.delete(
  "/account",
  protectUser,
  deleteAccount
);

export default userRouter;