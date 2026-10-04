import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const {
    navigate,
    isEducator,
    backendUrl,
    setIsEducator,
    isLoggedin,
    logout,
  } = useContext(AppContext);

  const isCourseListPage =
    window.location.pathname.includes("/course-list");

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate("/educator");
        return;
      }

      const { data } = await axios.get(
        `${backendUrl}/api/educator/update-role`
      );

      if (data.success) {
        setIsEducator(true);
        toast.success(data.message);
        navigate("/educator");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to update role"
      );
    }
  };

  return (
    <div
      className={`flex justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${
        isCourseListPage
          ? "bg-white"
          : "bg-cyan-100/70"
      }`}
    >
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="w-20 lg:w-32 cursor-pointer"
      />

      {/* Desktop */}
      <div className="hidden md:flex flex-wrap items-center gap-5 text-gray-500">
        <div className="flex justify-end gap-3 text-gray-900 px-5 py-2">
          {isLoggedin && (
            <>
              <button onClick={becomeEducator}>
                {isEducator
                  ? "Educator Dashboard"
                  : "Become Educator"}
              </button>

              <Link to="/my-enrollments">
                My Enrollments
              </Link>
            </>
          )}
        </div>

        {isLoggedin ? (
          <button
            onClick={logout}
            className="bg-red-500 text-white px-5 py-2 rounded-full"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-5 py-2 rounded-full"
          >
            Create Account
          </button>
        )}
      </div>

      {/* Mobile */}
      <div className="md:hidden flex items-center gap-2 sm:gap-5 text-[15px] font-semibold text-gray-500">
        {isLoggedin && (
          <div className="flex items-center gap-2 sm:gap-5 text-gray-500">
            <button onClick={becomeEducator}>
              {isEducator
                ? "Educator"
                : "Become Educator"}
            </button>

            <Link to="/my-enrollments">
              My Enrollments
            </Link>

            <button
              onClick={logout}
              className="text-red-500"
            >
              Logout
            </button>
          </div>
        )}

        {!isLoggedin && (
          <button onClick={() => navigate("/login")}>
            <img
              src={assets.user_icon}
              alt="User"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;