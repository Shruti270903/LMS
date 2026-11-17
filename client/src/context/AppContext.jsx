import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();
export const AppContent = AppContext;

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();

  // --------------------------------------------------
  // General state
  // --------------------------------------------------

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // --------------------------------------------------
  // Authentication state
  // --------------------------------------------------

  const [userData, setUserData] = useState(null);
  const [isLoggedin, setIsLoggedin] = useState(false);

  // IMPORTANT:
  // true = we are still checking the JWT cookie
  // false = authentication check has finished
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // --------------------------------------------------
  // Axios
  // --------------------------------------------------

  axios.defaults.withCredentials = true;

  // --------------------------------------------------
  // Fetch all courses
  // --------------------------------------------------

  const fetchAllCourses = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/course/all`
      );

      if (data.success) {
        setAllCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Fetch all courses error:", error);
    }
  };

  // --------------------------------------------------
  // Fetch authenticated user data
  // --------------------------------------------------

  const getUserData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/data`,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        setUserData(data.user);
        setIsLoggedin(true);

        if (data.user.role === "educator") {
          setIsEducator(true);
        } else {
          setIsEducator(false);
        }

        return data.user;
      }

      setUserData(null);
      setIsLoggedin(false);
      setIsEducator(false);

      return null;
    } catch (error) {
      setUserData(null);
      setIsLoggedin(false);
      setIsEducator(false);

      return null;
    }
  };

  // --------------------------------------------------
  // Check authentication
  // --------------------------------------------------

 
const checkAuth = async () => {
  try {
    const { data } = await axios.get(
      `${backendUrl}/api/auth/is-auth`,
      {
        withCredentials: true,
      }
    );

    if (data.success && data.user) {
      // Store authenticated user
      setUserData(data.user);
      setIsLoggedin(true);

      // Check educator role
      setIsEducator(data.user.role === "educator");
    } else {
      setUserData(null);
      setIsLoggedin(false);
      setIsEducator(false);
    }

  } catch (error) {
    console.error(
      "Authentication check error:",
      error.response?.data?.message || error.message
    );

    setUserData(null);
    setIsLoggedin(false);
    setIsEducator(false);

  } finally {
    setIsAuthChecking(false);
  }
};


  // --------------------------------------------------
  // Logout
  // --------------------------------------------------

  const logout = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        setIsLoggedin(false);
        setIsEducator(false);
        setUserData(null);
        setEnrolledCourses([]);

        toast.success(data.message);

        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Logout failed"
      );
    }
  };

  // --------------------------------------------------
  // Calculate average course rating
  // --------------------------------------------------

  const calculateRating = (course) => {
    if (
      !course.courseRatings ||
      course.courseRatings.length === 0
    ) {
      return 0;
    }

    let totalRating = 0;

    course.courseRatings.forEach((rating) => {
      totalRating += rating.rating;
    });

    return Math.floor(
      totalRating / course.courseRatings.length
    );
  };

  // --------------------------------------------------
  // Calculate chapter duration
  // --------------------------------------------------

  const calculateChapterTime = (chapter) => {
    let time = 0;

    chapter.chapterContent?.forEach((lecture) => {
      time += Number(lecture.lectureDuration) || 0;
    });

    return humanizeDuration(time * 60 * 1000, {
      units: ["h", "m"],
    });
  };

  // --------------------------------------------------
  // Calculate course duration
  // --------------------------------------------------

  const calculateCourseDuration = (course) => {
    let time = 0;

    course.courseContent?.forEach((chapter) => {
      chapter.chapterContent?.forEach((lecture) => {
        time += Number(lecture.lectureDuration) || 0;
      });
    });

    return humanizeDuration(time * 60 * 1000, {
      units: ["h", "m"],
    });
  };

  // --------------------------------------------------
  // Calculate number of lectures
  // --------------------------------------------------

  const calculateNoOfLectures = (course) => {
    let totalLectures = 0;

    course.courseContent?.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });

    return totalLectures;
  };

  // --------------------------------------------------
  // Fetch enrolled courses
  // --------------------------------------------------

  const fetchUserEnrolledCourses = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/enrolled-courses`,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        setEnrolledCourses(
          [...data.enrolledCourses].reverse()
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(
        "Fetch enrolled courses error:",
        error
      );
    }
  };

  // --------------------------------------------------
  // Initial data
  // --------------------------------------------------

  useEffect(() => {
    fetchAllCourses();
    checkAuth();
  }, []);

  // --------------------------------------------------
  // Fetch enrolled courses after login
  // --------------------------------------------------

  useEffect(() => {
    if (isLoggedin) {
      fetchUserEnrolledCourses();
    } else {
      setEnrolledCourses([]);
    }
  }, [isLoggedin]);

  // --------------------------------------------------
  // Context value
  // --------------------------------------------------

  const value = {
    // General
    currency,
    backendUrl,
    navigate,

    // Authentication
    isLoggedin,
    setIsLoggedin,
    isAuthChecking,
    userData,
    setUserData,
    getUserData,
    checkAuth,
    logout,

    // Educator
    isEducator,
    setIsEducator,

    // Courses
    allCourses,
    fetchAllCourses,
    enrolledCourses,
    fetchUserEnrolledCourses,

    // Course helpers
    calculateRating,
    calculateNoOfLectures,
    calculateCourseDuration,
    calculateChapterTime,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};