import User from "../../models/User.models.js";
import Course from "../../models/Course.js";

/* =========================================================
   ADMIN DASHBOARD
   ========================================================= */

export const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalEducators,
      totalAdmins,
      totalCourses,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "educator" }),
      User.countDocuments({
        role: { $in: ["admin", "superadmin"] },
      }),
      Course.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalStudents,
        totalEducators,
        totalAdmins,
        totalCourses,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard",
    });
  }
};


/* =========================================================
   GET ALL STUDENTS
   ========================================================= */

export const getStudents = async (req, res) => {
  try {
    const students = await User.find({
      role: "student",
    })
      .select(
        "-password -verifyOtp -verifyOtpExpireAt -resetOtp -resetOtpExpireAt"
      )
      .populate("enrolledCourses", "courseTitle");

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error("Get students error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
    });
  }
};


/* =========================================================
   GET STUDENT BY ID
   ========================================================= */

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await User.findOne({
      _id: id,
      role: "student",
    })
      .select(
        "-password -verifyOtp -verifyOtpExpireAt -resetOtp -resetOtpExpireAt"
      )
      .populate("enrolledCourses", "courseTitle");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    console.error("Get student by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch student",
    });
  }
};


/* =========================================================
   GET ALL EDUCATORS
   ========================================================= */

export const getEducators = async (req, res) => {
  try {
    const educators = await User.find({
      role: "educator",
    }).select(
      "-password -verifyOtp -verifyOtpExpireAt -resetOtp -resetOtpExpireAt"
    );

    res.status(200).json({
      success: true,
      count: educators.length,
      educators,
    });
  } catch (error) {
    console.error("Get educators error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch educators",
    });
  }
};


/* =========================================================
   GET EDUCATOR BY ID
   ========================================================= */

export const getEducatorById = async (req, res) => {
  try {
    const { id } = req.params;

    const educator = await User.findOne({
      _id: id,
      role: "educator",
    }).select(
      "-password -verifyOtp -verifyOtpExpireAt -resetOtp -resetOtpExpireAt"
    );

    if (!educator) {
      return res.status(404).json({
        success: false,
        message: "Educator not found",
      });
    }

    res.status(200).json({
      success: true,
      educator,
    });
  } catch (error) {
    console.error("Get educator by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch educator",
    });
  }
};


/* =========================================================
   GET ALL COURSES
   ========================================================= */

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("Get courses error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};