import Course from "../models/Course.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.models.js";


/* =========================================================
   UPDATE ROLE TO EDUCATOR
   ========================================================= */

export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "educator") {
      return res.status(400).json({
        success: false,
        message: "User is already an educator",
      });
    }

    if (user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can become educators",
      });
    }

    user.role = "educator";
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User role updated to educator",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error updating user role:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


/* =========================================================
   ADD NEW COURSE
   ========================================================= */

export const addCourse = async (req, res) => {
  try {
    const educatorId = req.userId;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Course thumbnail not attached",
      });
    }

    if (!req.body.courseData) {
      return res.status(400).json({
        success: false,
        message: "Course data missing",
      });
    }

    let parsedCourseData;

    try {
      parsedCourseData = JSON.parse(req.body.courseData);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid course data format",
      });
    }

    parsedCourseData.educator = educatorId;

    /* =====================================================
       CLOUDINARY IMAGE UPLOAD
       ===================================================== */

    const imageUpload = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString(
        "base64"
      )}`,
      {
        folder: "courses",
      }
    );

    /* =====================================================
       CREATE COURSE
       ===================================================== */

    const newCourse = await Course.create({
      ...parsedCourseData,
      courseThumbnail: imageUpload.secure_url,
    });

    return res.status(201).json({
      success: true,
      message: "New course added successfully",
      courseId: newCourse._id,
    });
  } catch (error) {
    console.error("ADD COURSE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


/* =========================================================
   GET EDUCATOR COURSES
   ========================================================= */

export const getEducatorCourses = async (req, res) => {
  try {
    const educatorId = req.userId;

    const courses = await Course.find({
      educator: educatorId,
    });

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Get educator courses error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


/* =========================================================
   EDUCATOR DASHBOARD DATA
   ========================================================= */

export const educatorDashboardData = async (req, res) => {
  try {
    const educatorId = req.userId;

    const courses = await Course.find({
      educator: educatorId,
    });

    const totalCourses = courses.length;

    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: {
        $in: courseIds,
      },
      status: "completed",
    });

    const totalEarnings = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0
    );

    const enrolledStudentsData = [];

    for (const course of courses) {
      const students = await User.find(
        {
          _id: {
            $in: course.enrolledStudents,
          },
        },
        "name imageUrl"
      );

      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }

    res.status(200).json({
      success: true,
      dashboardData: {
        totalCourses,
        totalEarnings,
        enrolledStudentsData,
      },
    });
  } catch (error) {
    console.error("Educator dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


/* =========================================================
   GET ENROLLED STUDENTS
   ========================================================= */

export const getEnrolledStudentsData = async (req, res) => {
  try {
    const educatorId = req.userId;

    const courses = await Course.find({
      educator: educatorId,
    });

    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: {
        $in: courseIds,
      },
      status: "completed",
    })
      .populate("userId", "name email imageUrl")
      .populate("courseId", "courseTitle");

    const enrolledStudents = purchases.map((purchase) => ({
      courseTitle: purchase.courseId.courseTitle,
      student: purchase.userId,
      purchaseDate: purchase.createdAt,
      amountPaid: purchase.amount,
    }));

    res.status(200).json({
      success: true,
      enrolledStudents,
    });
  } catch (error) {
    console.error("Get enrolled students error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};