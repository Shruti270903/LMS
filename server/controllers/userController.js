import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.models.js";
import Course from "../models/Course.js";
import { courseProgress } from "../models/CourseProgress.js";
import { v2 as cloudinary } from "cloudinary";


export const deleteAccount = async (req, res) => {
  try {
await User.findByIdAndDelete(req.userId);
res.clearCookie("token");

return res.json({
  success: true,
  message: "Account deleted successfully",
});
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, imageBase64 } = req.body;

    if (name === undefined && imageBase64 === undefined) {
      return res.status(400).json({
        success: false,
        message: "No profile changes provided",
      });
    }

    const updates = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty",
        });
      }

      if (name.trim().length > 80) {
        return res.status(400).json({
          success: false,
          message: "Name cannot exceed 80 characters",
        });
      }

      updates.name = name.trim();
    }

    if (
      imageBase64 !== undefined &&
      imageBase64 !== null &&
      imageBase64 !== ""
    ) {
      if (
        typeof imageBase64 !== "string" ||
        imageBase64.length > 7 * 1024 * 1024 ||
        !/^data:image\/(jpeg|png|webp);base64,/i.test(imageBase64)
      ) {
        return res.status(400).json({
          success: false,
          message: "Upload a valid JPEG, PNG, or WebP image under 5 MB",
        });
      }

      const upload = await cloudinary.uploader.upload(imageBase64, {
        folder: "lms/profiles",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
      });

      updates.imageUrl = upload.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password -verifyOtp -resetOtp");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update profile",
    });
  }
};

// Get User Data
export const getUserData = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Users Enrolled Course With Lecture Links
export const userEnrolledCourses = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).populate("enrolledCourses");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }

    res.status(200).json({
      success: true,
      enrolledCourses: user.enrolledCourses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "user enrolled course issue",
    });
  }
};

// Purchase Course
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;

    const userId = req.userId;

    const userData = await User.findById(userId);
    const courseData = await Course.findById(courseId);

    console.log("origin", origin);
    console.log("courseId", courseId);
    console.log("userId", userId);
    console.log("UserData", userData);
    console.log("courseData", courseData);

    if (!userData || !courseData) {
      return res.status(404).json({
        success: false,
        message: "Data Not Found from purchase",
      });
    }

    const purchaseData = {
      courseId: courseData._id,
      userId,
      amount:
        courseData.coursePrice -
        (courseData.discount * courseData.coursePrice) / 100,
    };

    const newPurchase = await Purchase.create(purchaseData);

    // Stripe Gateway Initialize
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const currency = process.env.CURRENCY.toLowerCase();

    // Creating line items for Stripe
    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: courseData.courseTitle,
          },
          unit_amount: Math.floor(newPurchase.amount) * 100,
        },
        quantity: 1,
      },
    ];

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
      line_items: line_items,
      mode: "payment",
      metadata: {
        purchaseId: newPurchase._id.toString(),
      },
    });

    res.status(200).json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "stripe purchase error",
    });
  }
};

// Update User Course Progress
export const updateUserCourseProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const { courseId, lectureId } = req.body;

    const progressData = await courseProgress.findOne({
      userId,
      courseId,
    });

    if (progressData) {
      if (progressData.lectureCompleted.includes(lectureId)) {
        return res.json({
          success: true,
          message: "Lecture Already Completed",
        });
      }

      progressData.lectureCompleted.push(lectureId);
      await progressData.save();
    } else {
      await courseProgress.create({
        userId,
        courseId,
        lectureCompleted: [lectureId],
      });
    }

    res.json({
      success: true,
      message: "Progress Updated",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Get User Course Progress
export const getUserCourseProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const { courseId } = req.body;

    const progressData = await courseProgress.findOne({
      userId,
      courseId,
    });

    res.json({
      success: true,
      progressData,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Add User Rating to Course
export const addUserRating = async (req, res) => {
  const userId = req.userId;
  const { courseId, rating } = req.body;

  if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
    return res.json({
      success: false,
      message: "Invalid Details",
    });
  }

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.json({
        success: false,
        message: "Course Not Found",
      });
    }

    const user = await User.findById(userId);

    if (!user || !user.enrolledCourses.includes(courseId)) {
      return res.json({
        success: false,
        message: "User has not purchased this course.",
      });
    }

    const existingRatingIndex = course.courseRatings.findIndex(
      (r) => r.userId.toString() === userId.toString()
    );

    if (existingRatingIndex > -1) {
      course.courseRatings[existingRatingIndex].rating = rating;
    } else {
      course.courseRatings.push({
        userId,
        rating,
      });
    }

    await course.save();

    return res.json({
      success: true,
      message: "Rating Added",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};