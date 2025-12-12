import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.models.js";
import Course from "../models/Course.js";
import { courseProgress } from "../models/CourseProgress.js";
//Get User Data
export const getUserData = async (req, res) => {
  try {
    const userId = req.auth().userId;
    const user = await User.findById(userId);

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
//Users Enrolled Course With Lecture Links
export const userEnrolledCourses = async (req, res) => {
  try {
    const userId = req.auth().userId;
    const user = await User.findById(userId).populate("enrolledCourses");

    res
      .status(200)
      .json({ success: true, enrolledCourses: getUserData.enrolledCourses });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "user enrolled course issue" });
  }
};

//Purchase course
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const userId = req.auth().userId;
    const userData = await User.findById(userId);
    const courseData = await Course.findById(courseId);
    console.log("origin", origin);
    console.log("courseId", courseId);
    console.log("userId", userId);
    console.log("UserData", userData);
    console.log("courseData", courseData);

    if (!userData || !courseData) {
      return res
        .status(404)
        .json({ success: false, message: "Data Not Found from purchase" });
    }

    const purchaseData = {
      courseId: courseData._id,
      userId,
      amount:
        courseData.coursePrice -
        (courseData.discount * courseData.coursePrice) / 100,
    };
    const newPurchase = await Purchase.create(purchaseData);
    //Stripe Gateway Initialize
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const currency = process.env.CURRENCY.toLowerCase();

    //creating line items to for Stripe

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
    res.status(200).json({ success: true, session_url: session.url });
  } catch (error) {
    res.status(500).json({ success: false, message: "stripe purchase error" });
  }
};

//Update User Course Progress
export const updateUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId, lectureId } = req.body;
    const progressData = await courseProgress.findOne({ userId, courseId });

    if (progressData) {
      if (progressData.lectureCompleted.includes(lectureId)) {
        return res.json({
          success: true,
          message: "Lecture Already Completed",
        });
      }
      progressData.lectureCompleted.push(lectureId);
      await courseProgress.create({
        userId,
        courseId,
        lectureCompleted: [lectureId],
      });
    }

    res.json({ success: true, message: "Progress Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//get User Course Progress
export const getUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId } = req.body;
    const progressData = await courseProgress.findOne({ userId, courseId });
    res.json({ success: true, progressData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Add User Ratings to course
export const addUserRating = async (req, res) => {
  const userId = req.auth.userId;
  const { courseId, rating } = req.body;

  if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
    return res.json({ success: false, message: "Invalid Details" });
  }
  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.json({ success: false, message: "Course Not Found" });
    }
    const user = await User.findById(userId);

    if (!user || !user.enrolledCourses.includes(courseId)) {
      return res.json({
        success: false,
        message: "User has not purchased this course.",
      });
    }
    const existingRatingIndex = course.courseRatings.findIndex(
      (r) => r.userId === userId
    );

    if (existingRatingIndex > -1) {
      course.courseRatings[existingRatingIndex].rating = rating;
    } else {
      course.courseRatings.push({ userId, rating });
    }
    await course.save();

    return res.json({ success: true, message: "Rating Added" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
