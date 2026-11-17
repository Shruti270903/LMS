import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Footer from '../../components/student/Footer';


const EditProfile = () => {
  const { userData, setUserData, backendUrl } = useContext(AppContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setName(userData.name || '');
      setEmail(userData.email || '');
    }
  }, [userData]);

  const handleUpdate = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const { data } = await axios.patch(
      `${backendUrl}/api/user/profile`,
      { name },
      { withCredentials: true }
    );

    if (data.success) {
      toast.success("Profile updated successfully!");

      setUserData((prev) => ({
        ...prev,
        name,
      }));
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Unable to update profile"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-700">
      
      
      <div className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 space-y-6">
          
          <div>
            <h2 className="text-2xl font-black text-slate-900">Account Settings</h2>
            <p className="text-sm text-slate-500 mt-1">View and edit your personal profile details.</p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 font-medium text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Email Address</label>
              <input 
                type="email" 
                value={email} 
                disabled
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-400 text-sm cursor-not-allowed select-none"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Email address cannot be changed.</span>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all text-sm mt-2 disabled:opacity-50"
            >
              {loading ? "Saving Changes..." : "Save Changes"}
            </button>
          </form>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EditProfile;