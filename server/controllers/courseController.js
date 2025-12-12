import Course from "../models/Course.js";

import User from "../models/User.models.js";
export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({isPublished: true}).select(['-courseContent', '-enrolledStudents']).populate({path: 'educator'})

        res.status(200).json({success: true, courses});
    } catch (error) {
        console.log("running.................")
        res.status(500).json({success: falseee, error: "Internal server error"});
    }
};

//Getting course by Id
export const getCourseId = async(req, res)=>{
    const {id} = req.params

    try{
        const courseData = await Course.findById(id).populate({path: 'educator'})

        //Remove lecture url if isPreviewFree is false
        courseData.courseContent.forEach(chapter=>{
            chapter.chapterContent.forEach(lecture=>{
                if(!lecture.isPreview){
                    lecture.lectureUrl= "";
                }
            })
        })
        res.status(200).json({success: true, courseData});
    } catch(error){
        res.status(500).json({success: false, error: "Internal server error"});
    }
}
 
