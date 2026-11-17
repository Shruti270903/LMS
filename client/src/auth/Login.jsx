// import React, { useContext, useState } from "react";
// import { assets } from "../assets/assets";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { AppContent } from "../context/AppContext";

// const Login = () => {
//   const navigate = useNavigate();

//   const { backendUrl, setIsLoggedin, getUserData } =
//     useContext(AppContent);

//   const [state, setState] = useState("Login");
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const onSubmitHandler = async (e) => {
//     e.preventDefault();

//     try {
//       axios.defaults.withCredentials = true;

//       if (state === "Sign Up") {
//         const { data } = await axios.post(
//           `${backendUrl}/api/auth/register`,
//           {
//             name,
//             email,
//             password,
//           },
//           {
//             withCredentials: true,
//           }
//         );

//         if (data.success) {
//           setIsLoggedin(true);

//           if (getUserData) {
//             await getUserData();
//           }

//           toast.success(data.message || "Account created successfully");

//           navigate("/email-verify");
//         } else {
//           toast.error(data.message || "Registration failed");
//         }
//       } else {
//         const { data } = await axios.post(
//           `${backendUrl}/api/auth/login`,
//           {
//             email,
//             password,
//           },
//           {
//             withCredentials: true,
//           }
//         );

//         if (data.success) {
//           setIsLoggedin(true);

//           if (getUserData) {
//             await getUserData();
//           }

//           toast.success(data.message || "Login successful");

//           navigate("/");
//         } else {
//           toast.error(data.message || "Login failed");
//         }
//       }
//     } catch (error) {
//       console.error("AUTH ERROR:", error);

//       toast.error(
//         error.response?.data?.message ||
//           error.response?.data?.error ||
//           "Something went wrong"
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4">
//       <div className="w-full max-w-md">

//         <div className="flex justify-center mb-6">
//           <img
//             src={assets.logo}
//             alt="Edemy"
//             className="w-40 cursor-pointer"
//             onClick={() => navigate("/")}
//           />
//         </div>

//         <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
//           <h2 className="text-2xl font-semibold text-center text-gray-800">
//             {state === "Sign Up" ? "Create Account" : "Login"}
//           </h2>

//           <p className="text-sm text-gray-500 text-center mt-2">
//             {state === "Sign Up"
//               ? "Create your account to start learning"
//               : "Login to continue your learning journey"}
//           </p>

//           <form onSubmit={onSubmitHandler} className="mt-6">

//             {state === "Sign Up" && (
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Name
//                 </label>

//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   placeholder="Enter your name"
//                   required
//                   className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-blue-500"
//                 />
//               </div>
//             )}

//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Email
//               </label>

//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter your email"
//                 required
//                 className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-blue-500"
//               />
//             </div>

//             <div className="mb-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Password
//               </label>

//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter your password"
//                 required
//                 className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-blue-500"
//               />
//             </div>

//             {state === "Login" && (
//               <div className="text-right mb-5">
//                 <button
//                   type="button"
//                   onClick={() => navigate("/reset-password")}
//                   className="text-sm text-blue-600 hover:underline"
//                 >
//                   Forgot password?
//                 </button>
//               </div>
//             )}

//             {state === "Sign Up" && <div className="mb-5" />}

//             <button
//               type="submit"
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md transition"
//             >
//               {state === "Sign Up" ? "Create Account" : "Login"}
//             </button>
//           </form>

//           <div className="text-center mt-6 text-sm text-gray-600">
//             {state === "Sign Up" ? (
//               <>
//                 Already have an account?{" "}
//                 <button
//                   type="button"
//                   onClick={() => setState("Login")}
//                   className="text-blue-600 font-medium hover:underline"
//                 >
//                   Login
//                 </button>
//               </>
//             ) : (
//               <>
//                 Don't have an account?{" "}
//                 <button
//                   type="button"
//                   onClick={() => setState("Sign Up")}
//                   className="text-blue-600 font-medium hover:underline"
//                 >
//                   Create Account
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContext";

const Login = () => {
  const navigate = useNavigate();

  const {
    backendUrl,
    checkAuth,
  } = useContext(AppContent);

  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const endpoint =
        state === "Sign Up"
          ? "/api/auth/register"
          : "/api/auth/login";

      const payload =
        state === "Sign Up"
          ? { name: name.trim(), email: email.trim(), password }
          : { email: email.trim(), password };

      const { data } = await axios.post(
        `${backendUrl}${endpoint}`,
        payload,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        // Refresh authentication and user information
        await checkAuth();

        toast.success(
          data.message ||
            (state === "Sign Up"
              ? "Account created successfully"
              : "Login successful")
        );

        if (state === "Sign Up") {
          navigate("/email-verify");
        } else {
          navigate("/");
        }
      } else {
        toast.error(data.message || "Authentication failed");
      }
    } catch (error) {
      console.error("AUTH ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="flex justify-center mb-6">
          <img
            src={assets.logo}
            alt="Edemy"
            className="w-40 cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-center text-gray-800">
            {state === "Sign Up" ? "Create Account" : "Login"}
          </h2>

          <p className="text-sm text-gray-500 text-center mt-2">
            {state === "Sign Up"
              ? "Create your account to start learning"
              : "Login to continue your learning journey"}
          </p>

          <form onSubmit={onSubmitHandler} className="mt-6">

            {state === "Sign Up" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-blue-500"
              />
            </div>

            {state === "Login" && (
              <div className="text-right mb-5">
                <button
                  type="button"
                  onClick={() => navigate("/reset-password")}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {state === "Sign Up" && <div className="mb-5" />}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-3 rounded-md transition"
            >
              {loading
                ? "Please wait..."
                : state === "Sign Up"
                  ? "Create Account"
                  : "Login"}
            </button>
          </form>

          <div className="text-center mt-6 text-sm text-gray-600">
            {state === "Sign Up" ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setState("Login")}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Login
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setState("Sign Up")}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Create Account
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
