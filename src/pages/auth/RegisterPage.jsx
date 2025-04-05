import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import registerApi from "../../api/registerApi";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    dob: "",
    address: "",
    phoneNumber: "",
    roleId: "", // 2 - student, 3 - sponsor, 6 - shop
    gender: "",
    avatar: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const registerData = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        dob: formData.dob,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        gender: formData.gender,
        avatar: formData.avatar,
        roleId: parseInt(formData.roleId),
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
          "Đăng ký không thành công vui lòng thử lại!."
      );
    }
  };

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
            <input type="hidden" name="avatar" value={formData.avatar} />
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
                className="w-full px-4 py-2 border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                className="w-full px-4 py-2 border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                className="w-full px-4 py-2 border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                className="w-full px-4 py-2 border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Your address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Date of Birth (dd-mm-yyyy)
              </label>
              <input
                type="text"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="16-08-2002"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">-- Select gender --</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Avatar (URL)
              </label>
              <input
                type="url"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            {formData.avatar && (
              <div className="flex justify-center">
                <img
                  src={formData.avatar}
                  alt="Avatar Preview"
                  className="h-24 w-24 rounded-full object-cover mt-2 shadow"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Role
              </label>
              <select
                name="roleId"
                value={formData.roleId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">-- Select role --</option>
                <option value="2">Student</option>
                <option value="3">Sponsor</option>
                <option value="6">Shop</option>
              </select>
            </div>

            <motion.button
              type="submit"
              className="w-full py-2 px-4 bg-amber-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 shadow-md"
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
