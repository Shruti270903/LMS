import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { assets } from "../assets/assets.js";
import { AppContent } from "../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const EmailVerify = () => {
  // const {
  //   backendUrl,
  //   isLoggedin,
  //   isAuthChecking,
  //   getUserData,
  //   userData,
  // } = useContext(AppContent);

  const {
  backendUrl,
  isLoggedin,
  isAuthChecking,
  checkAuth,
  userData,
} = useContext(AppContent);

  const navigate = useNavigate();

  const inputRefs = useRef([]);
  const hasSentInitialOtp = useRef(false);

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Send verification OTP
  const sendVerificationOtp = async () => {
    try {
      setIsSendingOtp(true);

      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`,
        {},
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("SEND VERIFY OTP ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to send verification OTP"
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Move to next OTP box
  const handleInput = (e, index) => {
    const value = e.target.value;

    // Allow only numbers
    e.target.value = value.replace(/\D/g, "");

    if (
      e.target.value.length > 0 &&
      index < 5
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Move back on Backspace
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

    const paste = e.clipboardData
      .getData("text")
      .trim();

    if (!/^\d{6}$/.test(paste)) {
      toast.error("Please paste a valid 6-digit OTP");
      return;
    }

    paste.split("").forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });

    inputRefs.current[5]?.focus();
  };

  // Verify OTP
  
const onSubmitHandler = async (e) => {
  e.preventDefault();

  if (isVerifying) return;

  try {
    const otp = inputRefs.current
      .map((input) => input?.value || "")
      .join("");

    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsVerifying(true);

    const { data } = await axios.post(
      `${backendUrl}/api/auth/verify-account`,
      { otp },
      {
        withCredentials: true,
      }
    );

    if (data.success) {
      toast.success(data.message || "Email verified successfully");

      // Refresh authenticated user information
      await checkAuth();

      navigate("/");
    } else {
      toast.error(data.message || "OTP verification failed");
    }

  } catch (error) {
    console.error("EMAIL VERIFY ERROR:", error);

    toast.error(
      error.response?.data?.message ||
        "Unable to verify email"
    );
  } finally {
    setIsVerifying(false);
  }
};

  // Check login status and send OTP
  useEffect(() => {
    if (isAuthChecking) {
      return;
    }

    // User is not logged in
    if (!isLoggedin) {
      navigate("/login");
      return;
    }

    // Already verified
    if (userData?.isAccountVerified) {
      navigate("/");
      return;
    }

    // Automatically send OTP once
    if (!hasSentInitialOtp.current) {
      hasSentInitialOtp.current = true;
      sendVerificationOtp();
    }
  }, [
    isAuthChecking,
    isLoggedin,
    userData,
    navigate,
  ]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">

      {/* Logo */}
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Edemy Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      {/* Verification Form */}
      <form
        onSubmit={onSubmitHandler}
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verify OTP
        </h1>

        <p className="text-center mb-6 text-indigo-300">
          Enter the 6-digit code sent to your email id.
        </p>

        {/* OTP Inputs */}
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
                onInput={(e) =>
                  handleInput(e, index)
                }
                onKeyDown={(e) =>
                  handleKeyDown(e, index)
                }
              />
            ))}
        </div>

        {/* Verify Button */}
        <button
  type="submit"
  disabled={isVerifying}
  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full hover:opacity-90 transition disabled:opacity-50"
>
  {isVerifying ? "Verifying..." : "Verify email"}
</button>

        {/* Resend OTP */}
        <button
          type="button"
          onClick={sendVerificationOtp}
          disabled={isSendingOtp}
          className="w-full mt-4 text-indigo-300 hover:text-white disabled:opacity-50"
        >
          {isSendingOtp
            ? "Sending OTP..."
            : "Resend OTP"}
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;