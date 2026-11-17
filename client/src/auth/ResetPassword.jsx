// import React, { useState } from "react";
// import { assets } from "../assets/assets";
// import { useNavigate } from "react-router-dom";
// import { AppContent } from "../context/AppContext";
// import { useContext } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// const ResetPassword = () => {

//   const {backendUrl} = useContext(AppContent)
//   axios.defaults.withCredentials = true;
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [newPassword, setNewPassword] = useState('');
//   const [isEmailSent, setIsEmailSent] = useState('')
//   const [otp, setOtp] = useState(0)
//   const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)
//   const inputRefs = React.useRef([]);

//   const handleInput = (e, index) => {
//     if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
//       inputRefs.current[index + 1].focus();
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace" && e.target.value === "" && index > 0) {
//       inputRefs.current[index - 1].focus();
//     }
//   };

//   const handlePaste = (e) => {
//     const paste = e.clipboardData.getData("text");
//     const pasteArray = paste.split("");
//     pasteArray.forEach((char, index) => {
//       if (inputRefs.current[index]) {
//         inputRefs.current[index].value = char;
//       }
//     });
//   };

// const onSubmitEmail = async (e) => {
//   e.preventDefault();
//   try {
//     const { data } = await axios.post(
//       backendUrl + "/api/auth/send-reset-otp",
//       { email }
//     );

//     data.success
//       ? toast.success(data.message)
//       : toast.error(data.message);

//     data.success && setIsEmailSent(true);
//   } catch (error) {
//     toast.error(error.message);
//   }
// };

// const onSubmitOtp = async(e)=>{
//   e.preventDefault();
//   const otpArray = inputRefs.current.map(e=>e.value)
//   setOtp(otpArray.join(''))
//   setIsOtpSubmitted(true)
// }

// const onSubmitNewPassword = async (e) => {
//   e.preventDefault();

//   try {
//     const { data } = await axios.post(
//       backendUrl + "/api/auth/reset-password",
//       { email, otp, newPassword }
//     );

//     data.success
//       ? toast.success(data.message)
//       : toast.error(data.message);

//     data.success && navigate("/login");
//   } catch (error) {
//     toast.error(error.message);
//   }
// };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
//       <img
//         onClick={() => navigate("/")}
//         src={assets.logo}
//         alt=""
//         className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
//       />
//       {/* enter email id             */}

//       {/* enter email id */}
//       {!isEmailSent && 

//       <form onSubmit={onSubmitEmail} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
//         <h1 className="text-white text-2xl font-semibold text-center mb-4">
//           Reset password
//         </h1>
//         <p className="text-center mb-6 text-indigo-300">
//           Enter your registered email address
//         </p>
//         <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
//           <img src={assets.mail_icon} alt="" className="w-3 h-3" />
//           <input
//             type="email"
//             placeholder="Email id"
//             className="bg-transparent outline-none text-white w-full"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
//           Submit
//         </button>
//       </form>
// }

// {/* otp input form  */}
// {!isOtpSubmitted && isEmailSent && 
//       <form onSubmit={onSubmitOtp} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
//         <h1 className="text-white text-2xl font-semibold text-center mb-4">
//           Reset Password OTP
//         </h1>
//         <p className="text-center mb-6 text-indigo-300">
//           Enter the 6-digit code sent to your email id.
//         </p>
//         <div className="flex justify-between mb-8" onPaste={handlePaste}>
//           {Array(6)
//             .fill(0)
//             .map((_, index) => (
//               <input
//                 type="text"
//                 maxLength="1"
//                 key={index}
//                 required
//                 className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
//                 ref={(e) => (inputRefs.current[index] = e)}
//                 onInput={(e) => handleInput(e, index)}
//                 onKeyDown={(e) => handleKeyDown(e, index)}
//               />
//             ))}
//         </div>
//         <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
//           Submit
//         </button>
//       </form>
// }
//       {/* enter new password */}
//       {isOtpSubmitted && isEmailSent && 
//       <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
//         <h1 className="text-white text-2xl font-semibold text-center mb-4">
//           New Password
//         </h1>
//         <p className="text-center mb-6 text-indigo-300">
//           Enter the new password below
//         </p>
//         <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
//           <img src={assets.lock_icon} alt="" className="w-3 h-3" />
//           <input
//             type="password"
//             placeholder="password"
//             className="bg-transparent outline-none text-white w-full"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
//           Submit
//         </button>
//       </form>
// }
//     </div>
//   );
// };

// export default ResetPassword;

import React, { useContext, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContent);
  const navigate = useNavigate();

  const inputRefs = useRef([]);

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);

  // OTP input handling
  const handleInput = (e, index) => {
    const value = e.target.value.replace(/\D/g, "").slice(-1);

    e.target.value = value;

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Backspace handling
  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      e.target.value === "" &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Paste OTP
  const handlePaste = (e) => {
    e.preventDefault();

    const pastedOtp = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (pastedOtp.length !== 6) {
      toast.error("Please paste a valid 6-digit OTP");
      return;
    }

    pastedOtp.split("").forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });

    inputRefs.current[5]?.focus();
  };

  // Step 1: Send OTP
  const onSubmitEmail = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        {
          email: email.trim().toLowerCase(),
        },
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message || "Unable to send OTP");
      }
    } catch (error) {
      console.error("SEND RESET OTP ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to send reset OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify entered OTP locally
  const onSubmitOtp = (e) => {
    e.preventDefault();

    const otpValue = inputRefs.current
      .map((input) => input?.value || "")
      .join("");

    if (!/^\d{6}$/.test(otpValue)) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setOtp(otpValue);
    setIsOtpSubmitted(true);
  };

  // Step 3: Reset password
  const onSubmitNewPassword = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        {
          email: email.trim().toLowerCase(),
          otp,
          newPassword,
        },
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success(data.message || "Password reset successfully");

        navigate("/login");
      } else {
        toast.error(data.message || "Password reset failed");
      }
    } catch (error) {
      console.error("RESET PASSWORD ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">

      {/* Logo */}
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Edemy Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      {/* Step 1: Email */}
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password
          </h1>

          <p className="text-center mb-6 text-indigo-300">
            Enter your registered email address
          </p>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img
              src={assets.mail_icon}
              alt=""
              className="w-3 h-3"
            />

            <input
              type="email"
              placeholder="Email id"
              className="bg-transparent outline-none text-white w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      )}

      {/* Step 2: OTP */}
      {isEmailSent && !isOtpSubmitted && (
        <form
          onSubmit={onSubmitOtp}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password OTP
          </h1>

          <p className="text-center mb-6 text-indigo-300">
            Enter the 6-digit code sent to your email id.
          </p>

          <div
            className="flex justify-between mb-8"
            onPaste={handlePaste}
          >
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  required
                  className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>

          <button
            className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full"
          >
            Continue
          </button>

          <button
            type="button"
            onClick={() => {
              setIsEmailSent(false);
              setOtp("");
            }}
            className="w-full mt-4 text-indigo-300 hover:text-white"
          >
            Change email
          </button>
        </form>
      )}

      {/* Step 3: New Password */}
      {isEmailSent && isOtpSubmitted && (
        <form
          onSubmit={onSubmitNewPassword}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            New Password
          </h1>

          <p className="text-center mb-6 text-indigo-300">
            Enter your new password below
          </p>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img
              src={assets.lock_icon}
              alt=""
              className="w-3 h-3"
            />

            <input
              type="password"
              placeholder="New password"
              className="bg-transparent outline-none text-white w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3 disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
