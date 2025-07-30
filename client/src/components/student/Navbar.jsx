import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";

const Navbar = () => {
  
  const {navigate, isEducator} = useContext(AppContext)

  const isCourseListPage = location.pathname.includes("/course-list");

  const { openSignIn } = useClerk();
  const { user } = useUser();

  return (
    <div
      className={`flex justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${
        isCourseListPage ? "bg-white" : "bg-cyan-100/70"
      }`}
    >
      <img onClick={()=>navigate('/')}
        src={assets.logo}
        alt="Logo"
        className="w-20 lg:w-32 cursor-pointer"
      />
      <div className="hidden md:flex flex-wrap sm:justify-between items-center gap-5 text-gray-500">
        <div className=" flex justify-end gap-3 text-gray-900  px-5 py-2 w-2xl">
        {   user && 
        <>
          <button  onClick={()=> {navigate('/educator')}} >{isEducator?  'Educator Dashboard' : 'Become Educator'}</button>
          <Link to="my-enrollments"> My Enrollments</Link>
          </>
            }
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()}
            className="bg-blue-600 text-white px-5 py-2 rounded-full"
          >
            Create Account
          </button>
        )}
      </div>
      {/* For phone Screen */}
      <div className="md:hidden flex items-center flex-item-center gap-2 sm:gap-5 text-[15px] font-semibold text-gray-500">
        <div className='flex items-center gap-2 sm:gap-5 text-gray-500'> 
        {   user && 
        <>
          <button  onClick={()=> {navigate('/educator')}} >{isEducator?  'Educator Dashboard' : 'Become Educator'}</button>
          <Link to="/my_enrollments"> My Enrollments</Link>
          </>
            }
        </div>
        {
          user ? <UserButton/>
        :<button onClick={()=> openSignIn()}> <img src={assets.user_icon} alt="" /></button>
        } 
      </div>
    </div>
  );
};

export default Navbar;
