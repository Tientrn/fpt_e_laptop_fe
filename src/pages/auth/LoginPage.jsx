import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion"; // Thêm framer-motion
import loginApi from "../../api/loginApi";
import { jwtDecode } from "jwt-decode";
import useCartStore from "../../store/useCartStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const initializeCart = useCartStore((state) => state.initializeCart);

  useEffect(() => {
    if (location.state?.showRegisterSuccess) {
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      window.history.replaceState({}, document.title);
    }

    const isLoggingOut = new URLSearchParams(location.search).get("logout");
    if (isLoggingOut) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.history.replaceState({}, document.title, "/login");
      return;
    }

    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        if (user.roleId === 1) {
          navigate("/dashboard");
        } else if (user.roleId === 4) {
          navigate("/staff");
        } else {
          navigate("/");
        }
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, [navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginApi.login({ email, password });
      const token = response.token || response.data?.token;

      if (!token) {
        throw new Error("Token không tồn tại trong response");
      }

      const decodedToken = jwtDecode(token);
      let userRoleId;
      const userRole =
        decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];
      switch (userRole) {
        case "Admin":
          userRoleId = 1;
          break;
        case "Student":
          userRoleId = 2;
          break;
        case "Sponsor":
          userRoleId = 3;
          break;
        case "Staff":
          userRoleId = 4;
          break;
        case "Manager":
          userRoleId = 5;
        case "Shop":
          userRoleId = 6;
          break;
        default:
          throw new Error("Invalid role");
      }

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: decodedToken.email,
          username: decodedToken.username,
          userId: decodedToken.nameidentifier,
          roleId: userRoleId,
          role: userRole,
        })
      );

      setError("");
      toast.success("Đăng nhập thành công!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        switch (userRoleId) {
          case 1:
            navigate("/dashboard");
            break;
          case 2:
            navigate("/home");
            break;
          case 3:
            navigate("/sponsor");
            break;
          case 4:
            navigate("/staff");
            break;
          case 5:
            navigate("/dashboard");
            break;
          case 6:
            navigate("/shop");
            break;
          default:
            navigate("/home");
        }
      }, 1500);

      // Khởi tạo cart cho user mới đăng nhập
      initializeCart(decodedToken.userid);
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "Đăng nhập thất bại");
      toast.error(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  // Animation variants cho các thành phần
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: 0.2 },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <motion.div
        className="flex w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Side - Illustration */}
        <div className="hidden md:block w-1/2 bg-amber-100 p-8 relative overflow-hidden">
          <motion.div
            className="flex flex-col items-center justify-center h-full"
            initial={{ opacity: 0, x: -50 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: { duration: 0.8, delay: 0.3 },
            }}
          >
            <motion.img
              src="https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_1280.jpg"
              alt="Laptop Sharing Illustration"
              className="w-3/4 mb-6 rounded-lg shadow-md"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1, transition: { duration: 0.6 } }}
            />
            <h2 className="text-2xl font-bold text-amber-800">Welcome Back!</h2>
            <p className="text-sm text-amber-600 text-center mt-2">
              Sign in to share and borrow laptops effortlessly.
            </p>
            
            {/* Thêm nút Back to Home */}
            <motion.button
              onClick={() => navigate("/")}
              className="mt-6 px-6 py-2 bg-amber-600 text-white rounded-full flex items-center gap-2 hover:bg-amber-700 transition-colors shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Back to Home
            </motion.button>
          </motion.div>
          
          {/* Giữ nguyên phần animated background circles */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <motion.div
              className="w-32 h-32 bg-amber-200 rounded-full absolute -top-16 -left-16 opacity-50"
              animate={{
                y: [0, 20, 0],
                transition: { duration: 4, repeat: Infinity },
              }}
            />
            <motion.div
              className="w-24 h-24 bg-amber-300 rounded-full absolute bottom-0 right-0 opacity-50"
              animate={{
                y: [0, -20, 0],
                transition: { duration: 3, repeat: Infinity },
              }}
            />
          </div>
        </div>

        {/* Right Side - Login Form */}
        <motion.div
          className="w-full md:w-1/2 p-8 space-y-6"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center">
            <motion.h1
              className="text-3xl font-bold text-black"
              initial={{ y: -20, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                transition: { duration: 0.5, delay: 0.4 },
              }}
            >
              LaptopSharing
            </motion.h1>
            <p className="text-sm text-slate-600 mt-1">
              Sign in to your account
            </p>
          </div>

          {error && (
            <motion.div
              className="text-sm text-center text-red-600 bg-red-100 p-2 rounded-md border border-red-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-black mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-md text-black 
                           focus:outline-none focus:ring-2 focus:ring-amber-500 transition 
                           placeholder:text-slate-400 shadow-sm"
                placeholder="Your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-black mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-md text-black 
                           focus:outline-none focus:ring-2 focus:ring-amber-500 transition 
                           placeholder:text-slate-400 shadow-sm"
                placeholder="Your password"
              />
            </div>

            <motion.button
              type="submit"
              className="w-full py-2 px-4 bg-amber-600 text-white rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 
                         shadow-md"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Sign In
            </motion.button>
          </form>

          <div className="text-center space-y-2">
            <a href="#" className="text-sm text-amber-600 hover:underline">
              Forgot Password?
            </a>
            <div className="flex items-center justify-center">
              <hr className="flex-1 border-slate-300" />
              <span className="px-3 text-sm text-slate-600">or</span>
              <hr className="flex-1 border-slate-300" />
            </div>
            <motion.button
              className="w-full flex items-center justify-center py-2 px-4 border border-slate-300 
                         rounded-md text-black hover:bg-slate-50 transition shadow-sm"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <img
                src="https://img.icons8.com/color/24/000000/google-logo.png"
                alt="Google Logo"
                className="mr-2 h-5 w-5"
              />
              Sign in with Google
            </motion.button>
          </div>

          <p className="text-center text-sm text-black">
            New here?{" "}
            <a href="/register" className="text-amber-600 hover:underline">
              Create an account
            </a>
          </p>
        </motion.div>
      </motion.div>
      <ToastContainer />
    </div>
  );
}
