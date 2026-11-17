
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import axios from "axios";
import { toast } from "react-toastify";

const MyCourses = () => {
  const {
    currency,
    backendUrl,
    isEducator,
    isLoggedin,
    isAuthChecking,
  } = useContext(AppContext);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEducatorCourses = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/educator/courses`,
        { withCredentials: true }
      );

      if (data.success) {
        setCourses(data.courses || []);
      } else {
        toast.error(data.message || "Unable to fetch courses");
      }
    } catch (error) {
      console.error("Fetch educator courses:", error.response?.data || error);
      toast.error(
        error.response?.data?.message || "Failed to fetch courses"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthChecking) return;

    if (isLoggedin && isEducator) {
      setLoading(true);
      fetchEducatorCourses();
    } else {
      setLoading(false);
    }
  }, [isAuthChecking, isLoggedin, isEducator]);

  if (isAuthChecking || loading) {
    return <Loading />;
  }

  if (!isEducator) {
    return <div className="p-8">Educator access required.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-start md:p-8 p-4 pt-8">
      <div className="w-full">
        <h2 className="pb-4 text-lg font-medium">My Courses</h2>

        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="md:table-auto table-fixed w-full">
            <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">All Courses</th>
                <th className="px-4 py-3 font-semibold">Earnings</th>
                <th className="px-4 py-3 font-semibold">Students</th>
                <th className="px-4 py-3 font-semibold">Published On</th>
              </tr>
            </thead>

            <tbody className="text-sm text-gray-500">
              {courses.length > 0 ? (
                courses.map((course) => {
                  const students = course.enrolledStudents || [];
                  const price =
                    course.coursePrice -
                    (course.discount * course.coursePrice) / 100;

                  return (
                    <tr key={course._id} className="border-b border-gray-500/20">
                      <td className="md:px-4 pl-2 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={course.courseThumbnail}
                            alt="Course"
                            className="w-16 object-cover"
                          />
                          <span className="truncate hidden md:block">
                            {course.courseTitle}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        {currency}
                        {Math.floor(students.length * price)}
                      </td>

                      <td className="px-4 py-3">{students.length}</td>

                      <td className="px-4 py-3">
                        {new Date(course.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-8">
                    No courses added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
