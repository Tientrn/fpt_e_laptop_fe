import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion"; // Thêm framer-motion
import registerApi from "../../api/registerApi";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    address: "",
    roleId: 3,
    isStudent: false,
    studentCode: "",
    university: "",
    studentCardImage: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const registerData = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        roleId: formData.roleId,
        isStudent: formData.isStudent,
        studentCode: formData.isStudent ? formData.studentCode : null,
        university: formData.isStudent ? formData.university : null,
        studentCardImage: formData.isStudent ? formData.studentCardImage : null,
      };

      const response = await registerApi.register(registerData);
      toast.success("Đăng ký thành công! Chuyển đến trang đăng nhập...", {
        position: "top-right",
        autoClose: 1500,
      });

      setTimeout(() => {
        navigate("/login", {
          state: { showRegisterSuccess: true },
          replace: true,
        });
      }, 1500);
    } catch (err) {
      console.error("Registration failed:", err);
      toast.error(
        err.response?.data?.message ||
          "Đăng ký không thành công. Vui lòng thử lại."
      );
    }
  };

  // Animation variants
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
              alt="Join LaptopSharing"
              className="w-3/4 mb-6 rounded-lg shadow-md"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1, transition: { duration: 0.6 } }}
            />
            <h2 className="text-2xl font-bold text-amber-800">Join Us!</h2>
            <p className="text-sm text-amber-600 text-center mt-2">
              Create an account to start sharing and borrowing laptops.
            </p>
          </motion.div>
          {/* Animated background circles */}
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

        {/* Right Side - Register Form */}
        <motion.div
          className="w-full md:w-1/2 p-8 space-y-6 overflow-y-auto max-h-screen"
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
            <p className="text-sm text-slate-600 mt-1">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-md text-black 
                           focus:outline-none focus:ring-2 focus:ring-amber-500 transition 
                           placeholder:text-slate-400 shadow-sm"
                placeholder="Your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-md text-black 
                           focus:outline-none focus:ring-2 focus:ring-amber-500 transition 
                           placeholder:text-slate-400 shadow-sm"
                placeholder="Your password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-md text-black 
                           focus:outline-none focus:ring-2 focus:ring-amber-500 transition 
                           placeholder:text-slate-400 shadow-sm"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-md text-black 
                           focus:outline-none focus:ring-2 focus:ring-amber-500 transition 
                           placeholder:text-slate-400 shadow-sm"
                placeholder="Your phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-md text-black 
                           focus:outline-none focus:ring-2 focus:ring-amber-500 transition 
                           placeholder:text-slate-400 shadow-sm"
                placeholder="Your address"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isStudent"
                checked={formData.isStudent}
                onChange={handleChange}
                className="h-4 w-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
              />
              <label className="ml-2 block text-sm font-medium text-black">
                Are you a student?
              </label>
            </div>

            {formData.isStudent && (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: 1,
                  height: "auto",
                  transition: { duration: 0.3 },
                }}
              >
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Student Code
                  </label>
                  <input
                    type="text"
                    name="studentCode"
                    value={formData.studentCode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-md text-black 
                               focus:outline-none focus:ring-2 focus:ring-amber-500 transition 
                               placeholder:text-slate-400 shadow-sm"
                    placeholder="Your student code"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    University
                  </label>
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-md text-black 
                               focus:outline-none focus:ring-2 focus:ring-amber-500 transition 
                               placeholder:text-slate-400 shadow-sm"
                    placeholder="Your university"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Student Card Image URL
                  </label>
                  <input
                    type="url"
                    name="studentCardImage"
                    value={formData.studentCardImage}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-md text-black 
                               focus:outline-none focus:ring-2 focus:ring-amber-500 transition 
                               placeholder:text-slate-400 shadow-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </motion.div>
            )}

            <motion.button
              type="submit"
              className="w-full py-2 px-4 bg-amber-600 text-white rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 
                         shadow-md"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Register
            </motion.button>
          </form>

          <p className="text-center text-sm text-black">
            Already have an account?{" "}
            <a href="/login" className="text-amber-600 hover:underline">
              Sign in
            </a>
          </p>
        </motion.div>
      </motion.div>
      <ToastContainer />
    </div>
  );
};

export default RegisterPage;
