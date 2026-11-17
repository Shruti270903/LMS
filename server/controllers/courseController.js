import Course from "../models/Course.js";
import User from "../models/User.models.js";

// Getting all published courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select(["-courseContent", "-enrolledStudents"])
      .populate({
        path: "educator",
      });

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("GET ALL COURSES ERROR:");
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Getting course by ID
export const getCourseId = async (req, res) => {
  const { id } = req.params;

  try {
    const courseData = await Course.findById(id).populate({
      path: "educator",
    });

    if (!courseData) {
      return res.status(404).json({
        success: false,
        error: "Course not found",
      });
    }

    // Remove lecture URL if preview is false
    courseData.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        if (!lecture.isPreview) {
          lecture.lectureUrl = "";
        }
      });
    });

    res.status(200).json({
      success: true,
      courseData,
    });
  } catch (error) {
    console.error("GET COURSE BY ID ERROR:");
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};