
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import axios from "axios";
import { toast } from "react-toastify";

const StudentsEnrolled = () => {
  const {
    backendUrl,
    isEducator,
    isLoggedin,
    isAuthChecking,
  } = useContext(AppContext);

  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrolledStudents = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/educator/enrolled-students`,
        { withCredentials: true }
      );

      if (data.success) {
        setEnrolledStudents(
          [...(data.enrolledStudents || [])].reverse()
        );
      } else {
        toast.error(data.message || "Unable to fetch students");
      }
    } catch (error) {
      console.error("Enrolled students error:", error.response?.data || error);
      toast.error(
        error.response?.data?.message || "Failed to fetch students"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthChecking) return;

    if (isLoggedin && isEducator) {
      setLoading(true);
      fetchEnrolledStudents();
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
      <h2 className="text-lg font-medium mb-4">Enrolled Students</h2>

      <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
        <table className="table-fixed md:table-auto w-full">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
            <tr>
              <th className="px-4 py-3 text-center hidden sm:table-cell">#</th>
              <th className="px-4 py-3">Student Name</th>
              <th className="px-4 py-3">Course Title</th>
              <th className="px-4 py-3 hidden sm:table-cell">Date</th>
            </tr>
          </thead>

          <tbody className="text-sm text-gray-500">
            {enrolledStudents.length > 0 ? (
              enrolledStudents.map((item, index) => (
                <tr key={`${item.student?._id || index}-${index}`} className="border-b border-gray-500/20">
                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    {index + 1}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.student?.imageUrl || ""}
                        alt=""
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <span>{item.student?.name || "Unknown Student"}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3 truncate">
                    {item.courseTitle}
                  </td>

                  <td className="px-4 py-3 hidden sm:table-cell">
                    {item.purchaseDate
                      ? new Date(item.purchaseDate).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-8">
                  No enrolled students yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsEnrolled;
