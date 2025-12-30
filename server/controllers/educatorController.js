import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.models.js";
//update role to educator
export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth().userId;

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role: "educator" },
    });

    return res
      .status(200)
      .json({ success: true, message: "User role updated to educator" });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//Add New Course

export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const image = req.file;
    console.log(imageFile);
    const educatorId = req.auth().userId;

    if (!imageFile) {
      return res.json({
        success: false,
        message: "Course thumbnail not attached ",
      });
    }
    const parsedCourseData = await JSON.parse(courseData);

    parsedCourseData.educator = educatorId;
    const newCourse = await Course.create(parsedCourseData);
    //upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path)
    console.log("educator controller",imageUpload);
    newCourse.courseThumbnail = imageUpload.secure_url
    await newCourse.save();

    return res
      .status(200)
      .json({
        success: true,
        message: "New course added successfully",
        courseId: newCourse._id,
      });
  } catch (error) {
    console.error("Error adding new course:", error);
    return res.status(500).json({ error: "Internal server error add cources" });
  }
};


//Get Educator Courses
export const getEducatorCourses = async (req, res) => {
    try {
        const educator= req.auth.userId;
        const courses = await Course.find({educator})
        res.status(200).json({success: true, courses})
    }catch(error){
        res.status(500).json({success: false, error: "Internal server error"})
    }
}

//Get Educator Dashboard Data(Total Earning, Enrolled students, no. of courses)
export const educatorDashboardData=async(req, res)=>{
    try{
        const educator = req.auth.userId;
        const courses = await Course.find({educator});
        const totalCourses= courses.length;

        const courseIds = courses.map(course=> course._id);

        //calculate total earnings from purchases
        const purchases = await Purchase.find({
            courseId: {$in: courseIds},
            status: 'completed'
        });

        const totalEarnings = purchases.reduce((sum, purchase)=> sum + purchase.amount, 0);
        //collect unique enrolled students IDs with their course titles
        const enrolledStudentsData = [];
        for(const course of courses){
            const students = await User.find({
                _id: {$in: course.enrolledStudents}
            }, 'name imageUrl');

            students.forEach(student=>{
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                });
            });
        }
        res.json({
            success: true,
            dashboardData: {
                totalCourses,
                totalEarnings,
                enrolledStudentsData
            }
        })
    }catch(error){
res.status(500).json({success: false, error: "Internal server error"});
    }
}


//Get Enrolled Stuendents data with purchase data

export const getEnrolledStudentsData = async (req, res) => {
    try {   
        const educator = req.auth().userId;
        const courses = await Course.find({ educator });
        const courseIds = courses.map((course) => course._id);
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: "completed",
        }).populate("userId", "name email imageUrl").populate("courseId", "courseTitle");

        const enrolledStudents= purchases.map(purchase => ({
            courseTitle: purchase.courseId.courseTitle,
            student: purchase.userId,
            purchaseDate: purchase.createdAt,
            amountPaid: purchase.amount,
        }));
res.status(200).json({ success: true, enrolledStudents });

    } catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
}