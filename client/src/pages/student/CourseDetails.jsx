import axios from "axios";
import { toast } from "react-toastify";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import Footer from "../../components/student/Footer";
import YouTube from "react-youtube";
import Loading from "../../components/student/Loading";

const CourseDetails = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  
  const {
    calculateRating,
    calculateNoOfLectures,
    calculateCourseDuration,
    calculateChapterTime,
    currency,
    backendUrl,
    userData,
  } = useContext(AppContext);

  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/course/" + id);
      if (data.success) {
        setCourseData(data.courseData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const enrollCourse = async () => {
    try {
      if (!userData) {
        return toast.warn("Login to Enroll");
      }

      if (isAlreadyEnrolled) {
        return toast.warn("Already Enrolled");
      }

      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        backendUrl + "/api/user/purchase",
        { courseId: courseData._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        window.location.replace(data.session_url);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    setCourseData(null);
    fetchCourseData();
  }, [id]);

  useEffect(() => {
    if (userData && courseData) {
      setIsAlreadyEnrolled((userData.enrolledCourses || []).includes(courseData._id));
    }
  }, [userData, courseData]);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Helper to extract YouTube ID safely from standard URLs or embeds
  const getYouTubeId = (url) => {
    if (!url) return "";
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : url.split("/").pop();
    } catch {
      return url.split("/").pop();
    }
  };

  return courseData ? (
    <>
      {/* Main container with clean responsive flex spacing */}
      <div className="relative min-h-[70vh] flex flex-col-reverse md:flex-row items-start justify-between gap-8 px-8 md:px-36 pt-16 md:pt-24 pb-12 text-left">
        
        {/* Top Gradient Background Banner */}
        <div className="absolute top-0 left-0 w-full h-[400px] -z-1 bg-gradient-to-b from-cyan-100/70"></div>

        {/* Left Column: Course Info & Structure */}
        <div className="w-full md:max-w-2xl z-10 text-gray-500">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {courseData.courseTitle}
          </h1>
          <p
            className="pt-4 text-sm md:text-base leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: courseData.courseDescription ? courseData.courseDescription.slice(0, 200) : "",
            }}
          ></p>

          {/* Ratings & Students */}
          <div className="flex flex-wrap items-center space-x-2 pt-3 pb-1 text-sm">
            <span className="font-semibold text-gray-800">{calculateRating(courseData)}</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={
                    i < Math.floor(calculateRating(courseData))
                      ? assets.star
                      : assets.star_blank
                  }
                  alt=""
                  className="w-3.5 h-3.5"
                />
              ))}
            </div>
            <span className="text-blue-600">
              ({courseData.courseRatings?.length || 0} {courseData.courseRatings?.length === 1 ? "rating" : "ratings"})
            </span>
            <span className="text-gray-600">
              {courseData.enrolledStudents?.length || 0} {courseData.enrolledStudents?.length === 1 ? "student" : "students"}
            </span>
          </div>

          <p className="text-sm pt-1">
            Course by{" "}
            <span className="text-blue-600 underline font-medium">
              {courseData.educator?.name || "Instructor"}
            </span>
          </p>

          {/* Course Structure Section */}
          <div className="pt-8 text-gray-800">
            <h2 className="text-xl font-semibold">Course Structure</h2>
            <p className="text-sm text-gray-500 pt-1">
              {courseData.courseContent?.length || 0} sections • {calculateNoOfLectures(courseData)} lectures • {calculateCourseDuration(courseData)} total length
            </p>

            <div className="pt-4 space-y-2">
              {courseData.courseContent?.map((chapter, index) => (
                <div
                  key={index}
                  className="border border-gray-300 bg-white rounded-md overflow-hidden shadow-sm"
                >
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer select-none bg-gray-50 hover:bg-gray-100 transition-colors"
                    onClick={() => toggleSection(index)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        className={`w-3.5 h-3.5 transform transition-transform ${
                          openSections[index] ? "rotate-180" : ""
                        }`}
                        src={assets.down_arrow_icon}
                        alt="arrow icon"
                      />
                      <p className="font-medium text-sm md:text-base text-gray-800">
                        {chapter.chapterTitle}
                      </p>
                    </div>
                    <p className="text-xs md:text-sm text-gray-500 font-medium">
                      {chapter.chapterContent?.length || 0} lectures - {calculateChapterTime(chapter)}
                    </p>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 bg-white ${
                      openSections[index] ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <ul className="list-none divide-y divide-gray-100 px-4 md:px-8 py-2 text-gray-600">
  {chapter.chapterContent?.map((lecture, i) => (
    <li key={i} className="flex items-center justify-between py-2.5 text-sm">
      <div className="flex items-center gap-2.5">
        <img
          src={assets.play_icon}
          alt="play icon"
          className="w-4 h-4 text-gray-400"
        />
        <span className="text-gray-800 font-medium">{lecture.lectureTitle}</span>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Render Preview button if lecture.isPreviewFree is true */}
        {lecture.isPreviewFree && (
          <button
            onClick={() =>
              setPlayerData({
                videoId: getYouTubeId(lecture.lectureUrl),
              })
            }
            className="text-blue-600 hover:text-blue-800 font-semibold text-xs bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded transition-colors cursor-pointer"
          >
            Preview
          </button>
        )}
        <span className="text-xs text-gray-400">
          {humanizeDuration(
            (lecture.lectureDuration || 0) * 60 * 1000,
            { units: ["h", "m"] }
          )}
        </span>
      </div>
    </li>
  ))}
</ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Full Course Description */}
          <div className="py-12 text-sm md:text-base">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Description
            </h3>
            <div
              className="rich-text text-gray-600 space-y-2 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: courseData.courseDescription,
              }}
            ></div>
          </div>
        </div>

        {/* Right Column: Sticky Pricing & Preview Card */}
        <div className="w-full md:w-[400px] z-20 bg-white shadow-xl rounded-lg overflow-hidden border border-gray-100 shrink-0">
          <div className="relative aspect-video bg-gray-900 flex items-center justify-center">
            {playerData ? (
              <YouTube
                videoId={playerData.videoId}
                opts={{ playerVars: { autoplay: 1 } }}
                className="w-full h-full absolute inset-0"
                iframeClassName="w-full h-full"
              />
            ) : (
              <img src={courseData.courseThumbnail} alt="" className="w-full h-full object-cover" />
            )}
          </div>

          <div className="p-6">
            <div className="flex items-center gap-2 text-red-500 text-sm font-medium pb-4">
              <img className="w-4 h-4" src={assets.time_left_clock_icon} alt="" />
              <span><strong className="font-semibold">5 days</strong> left at this price!</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                {currency}
                {(
                  courseData.coursePrice -
                  (courseData.discount * courseData.coursePrice) / 100
                ).toFixed(2)}
              </span>
              <span className="text-lg text-gray-400 line-through">
                {currency}{courseData.coursePrice}
              </span>
              <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                {courseData.discount}% off
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 py-6 border-b border-gray-100 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <img src={assets.time_clock_icon} alt="" className="w-4 h-4" />
                <span>{calculateCourseDuration(courseData)}</span>
              </div>
              <div className="flex items-center gap-2">
                <img src={assets.lesson_icon} alt="" className="w-4 h-4" />
                <span>{calculateNoOfLectures(courseData)} lessons</span>
              </div>
            </div>

            <button
              onClick={enrollCourse}
              className="w-full mt-6 py-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-sm"
            >
              {isAlreadyEnrolled ? "Already Enrolled" : "Enroll Now"}
            </button>

            <div className="pt-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                This course includes:
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">✓ Lifetime access with free updates</li>
                <li className="flex items-center gap-2">✓ Step-by-step hands-on guidance</li>
                <li className="flex items-center gap-2">✓ Downloadable resources & source code</li>
                <li className="flex items-center gap-2">✓ Certificate of completion</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default CourseDetails;