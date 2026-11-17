import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, logout, backendUrl } = useContext(AppContext);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your educator account? This action cannot be undone.")) {
      try {
        const { data } = await axios.delete(
  `${backendUrl}/api/user/account`,
  {
    withCredentials: true,
  }
);
        if (data.success) {
          toast.success("Account deleted successfully");
          logout();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-200 px-6 md:px-12 py-3.5 flex items-center justify-between shadow-sm">
      {/* Brand Indicator */}
      <div onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
          <span className="font-bold text-xs tracking-wider">EDU</span>
        </div>
        <div>
          <h2 className="font-bold text-slate-900 text-base leading-none">Educator Dashboard</h2>
          <span className="text-xs text-slate-400 font-medium">Manage your courses & students</span>
        </div>
      </div>

      {/* Actions and Profile Menu */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/')} 
          className="text-xs font-semibold text-slate-600 hover:text-blue-600 border border-slate-200 px-3.5 py-2 rounded-xl transition-colors bg-white shadow-sm"
        >
          Exit to Student View
        </button>

        <div className="relative pl-3 border-l border-slate-200" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 hover:bg-slate-100 py-1.5 px-3 rounded-full transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase">
              {userData?.name ? userData.name[0] : 'E'}
            </div>
            <span className="text-sm font-semibold text-slate-700 hidden sm:inline">
              {userData?.name || 'Instructor'}
            </span>
            <span className="text-xs text-slate-400">▼</span>
          </button>

          {/* Educator Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 text-slate-700 text-sm">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="font-bold text-slate-900 truncate">{userData?.name || 'Instructor'}</p>
                <p className="text-xs text-slate-400 truncate">{userData?.email || 'educator@example.com'}</p>
              </div>

              <button 
                onClick={() => { setDropdownOpen(false); navigate('/edit-profile'); }} 
                className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors flex items-center gap-2 text-slate-600"
              >
                ⚙️ Edit Profile
              </button>

              <div className="h-px bg-slate-100 my-1"></div>

              <button 
                onClick={() => { setDropdownOpen(false); logout(); }} 
                className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors flex items-center gap-2 text-slate-600"
              >
                🚪 Logout
              </button>

              <button 
                onClick={handleDeleteAccount} 
                className="w-full text-left px-4 py-2 hover:bg-rose-50 transition-colors flex items-center gap-2 text-rose-600 font-medium"
              >
                ⚠️ Delete Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;