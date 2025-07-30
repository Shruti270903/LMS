import React from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import CourseCard from "./courseCard";
import { useContext } from "react";
const CoursesSection = () => {
  let p1 =
    "Discover our top-raated courses across various categories. From coding and Design to  <br />business and wellness, our courses are crafted to deliver results.";

  const { allCourses } = useContext(AppContext);
  return (
    <div className="py-16 md:px-40 px-8">
      <h2 className="text-3xl font-medium text-gray-800">
        Learn from the best
      </h2>
      <p>{p1}</p>
      <div className="grid sm:grid-cols-4 grid-cols-1 lg:grid-cols-4 px-4 md:px-0 md:my-16 my-10 gap-4">
        {allCourses.slice(0, 4).map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>

      <Link
        to={"/course-list"}
        onClick={() => scrollTo(0, 0)}
        className="text-gray-500 border border-gray-500/30 px-10 py-3 rounded"
      >
        Show all courses
      </Link>
    </div>
  );
};

export default CoursesSection;
