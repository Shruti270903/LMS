
import React, { useContext, useRef, useState } from "react";
import axios from "axios";
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
    userData,
    setUserData,
  } = useContext(AppContext);

  const [showProfile, setShowProfile] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);

  const isCourseListPage = window.location.pathname.includes("/course-list");

  const profileImage = userData?.imageUrl || assets.user_icon;

  const openEditProfile = () => {
    setName(userData?.name || "");
    setImageFile(null);
    setImagePreview(userData?.imageUrl || "");
    setShowProfile(false);
    setShowEditProfile(true);
  };

  const closeEditProfile = () => {
    if (saving) return;

    setShowEditProfile(false);
    setImageFile(null);
    setImagePreview("");
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Please select a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile image must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("Name cannot be empty.");
      return;
    }

    if (trimmedName.length > 80) {
      toast.error("Name must be 80 characters or fewer.");
      return;
    }

    try {
      setSaving(true);

      let imageBase64 = null;

      if (imageFile) {
        imageBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error("Unable to read image."));

          reader.readAsDataURL(imageFile);
        });
      }

      const { data } = await axios.patch(
        `${backendUrl}/api/user/profile`,
        {
          name: trimmedName,
          imageBase64,
        },
        { withCredentials: true }
      );

      if (!data.success) {
        throw new Error(data.message || "Unable to update profile.");
      }

      if (data.user && setUserData) {
        setUserData((previousUser) => ({
          ...previousUser,
          ...data.user,
        }));
      }

      setShowEditProfile(false);
      setImageFile(null);
      setImagePreview("");
      toast.success(data.message || "Profile updated successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmed) return;

    const finalConfirmation = window.confirm(
      "Final confirmation: permanently delete your account?"
    );

    if (!finalConfirmation) return;

    try {
      setDeleting(true);

      // This endpoint must be implemented on the backend before deletion will work.
      const { data } = await axios.delete(
        `${backendUrl}/api/user/account`,
        { withCredentials: true }
      );

      if (!data.success) {
        throw new Error(data.message || "Unable to delete account.");
      }

      setShowProfile(false);
      setShowEditProfile(false);
      toast.success(data.message || "Account deleted successfully.");
      await logout();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to delete account."
      );
    } finally {
      setDeleting(false);
    }
  };

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate("/educator");
        return;
      }

     const { data } = await axios.post(
  `${backendUrl}/api/educator/update-role`,
  {},
  { withCredentials: true }
);

     if (data.success) {
  setIsEducator(true);

  setUserData((prev) => ({
    ...prev,
    role: "educator",
  }));

  toast.success(data.message);
  navigate("/educator");
}else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to update role."
      );
    }
  };

  const ProfileMenu = ({ mobile = false }) => (
    <div
      className={`absolute right-0 top-full mt-3 ${
        mobile ? "w-64" : "w-72"
      } rounded-xl border border-gray-200 bg-white p-4 shadow-xl z-50`}
    >
      <div className="flex items-center gap-3">
        <img
          src={profileImage}
          alt="Profile"
          className="h-12 w-12 rounded-full border border-gray-200 object-cover"
        />

        <div className="min-w-0">
          <p className="truncate font-semibold text-gray-800">
            {userData?.name || "User"}
          </p>
          <p className="truncate text-sm text-gray-500">
            {userData?.email || ""}
          </p>
        </div>
      </div>

      <div className="mt-4 border-t border-gray-100 pt-3">
        <p className="text-xs text-gray-500">Account role</p>
        <p className="mt-1 font-medium capitalize text-gray-800">
          {userData?.role || (isEducator ? "educator" : "student")}
        </p>
      </div>

      <button
        type="button"
        onClick={openEditProfile}
        className="mt-4 w-full rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
      >
        Edit Profile
      </button>

      <button
        type="button"
        onClick={() => {
          setShowProfile(false);
          logout();
        }}
        className="mt-2 w-full rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
      >
        Logout
      </button>

      {/* <button
        type="button"
        onClick={handleDeleteAccount}
        disabled={deleting}
        className="mt-2 w-full rounded-lg px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {deleting ? "Deleting account..." : "Delete Account"}
      </button> */}
    </div>
  );

  return (
    <>
      <nav
        className={`relative z-40 flex items-center justify-between border-b border-gray-200 px-4 py-4 sm:px-10 md:px-14 lg:px-36 ${
          isCourseListPage ? "bg-white" : "bg-cyan-100/70"
        }`}
      >
        <img
          onClick={() => navigate("/")}
          src={assets.logo}
          alt="Logo"
          className="w-20 cursor-pointer lg:w-32"
        />

        {/* Desktop navigation */}
        <div className="hidden items-center gap-5 text-gray-600 md:flex">
          {isLoggedin ? (
            <>
              <button
                type="button"
                onClick={becomeEducator}
                className="text-gray-900 transition hover:text-blue-700"
              >
                {isEducator ? "Educator Dashboard" : "Become Educator"}
              </button>

              <Link
                to="/my-enrollments"
                className="text-gray-900 transition hover:text-blue-700"
              >
                My Enrollments
              </Link>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowProfile((previous) => !previous)}
                  aria-label="Open profile menu"
                  aria-expanded={showProfile}
                  className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-10 w-10 rounded-full border border-gray-300 object-cover"
                  />
                  <span className="max-w-28 truncate text-sm font-medium text-gray-800">
                    {userData?.name || "Profile"}
                  </span>
                </button>

                {showProfile && <ProfileMenu />}
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="rounded-full bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
            >
              Create Account
            </button>
          )}
        </div>

        {/* Mobile navigation */}
        <div className="flex items-center gap-3 text-sm font-medium text-gray-700 md:hidden">
          {isLoggedin ? (
            <>
              <Link to="/my-enrollments" className="text-gray-800">
                Enrollments
              </Link>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowProfile((previous) => !previous)}
                  aria-label="Open profile menu"
                  aria-expanded={showProfile}
                  className="rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-9 w-9 rounded-full border border-gray-300 object-cover"
                  />
                </button>

                {showProfile && <ProfileMenu mobile />}
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/login")}
              aria-label="Create account or log in"
            >
              <img
                src={assets.user_icon}
                alt="User"
                className="h-7 w-7"
              />
            </button>
          )}
        </div>
      </nav>

      {/* Edit profile modal */}
      {showEditProfile && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeEditProfile();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2
                id="edit-profile-title"
                className="text-xl font-semibold text-gray-800"
              >
                Edit Profile
              </h2>

              <button
                type="button"
                onClick={closeEditProfile}
                disabled={saving}
                aria-label="Close edit profile"
                className="rounded-full px-3 py-1 text-xl text-gray-500 hover:bg-gray-100 disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className="mb-5 flex flex-col items-center">
                <img
                  src={imagePreview || assets.user_icon}
                  alt="Profile preview"
                  className="h-24 w-24 rounded-full border border-gray-200 object-cover"
                />

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Change profile picture
                </button>

                <p className="mt-1 text-xs text-gray-500">
                  JPG, PNG or WebP · Maximum 5 MB
                </p>
              </div>

              <label
                htmlFor="profile-name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Full name
              </label>

              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={80}
                required
                autoComplete="name"
                placeholder="Enter your name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <div className="mt-3 text-sm text-gray-500">
                Email: {userData?.email || "Not available"}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={closeEditProfile}
                  disabled={saving}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
