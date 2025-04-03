import React from "react";
import { motion } from "framer-motion";
import laptopImage from "../../../assets/laptopanimation.jpg"; // Đảm bảo thay đường dẫn ảnh đúng

const Hero = () => {
  return (
    <div className="relative flex flex-col md:flex-row items-center justify-center min-h-screen px-6 py-16 bg-white">
      {/* Text Content */}
      <div className="max-w-lg text-center md:text-left">
        <motion.h1
          className="text-5xl font-bold text-gray-900 leading-tight mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Elevate Your Experience with{" "}
          <span className="text-amber-600">FPT E-Laptop</span>
        </motion.h1>
        <motion.p
          className="text-lg text-gray-600 mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Rent or buy high-performance laptops designed for students and
          professionals.{" "}
          <span className="text-gray-800 font-semibold">
            Perfect for your study and work needs.
          </span>
        </motion.p>
        <motion.button
          className="px-8 py-3 bg-slate-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-amber-600 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Explore Now
        </motion.button>
      </div>

      {/* Animated Laptop Image */}
      <motion.div
        className="w-full md:w-1/2 flex justify-center mt-10 md:mt-0"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <motion.img
          src={laptopImage}
          alt="Laptop"
          className="w-full md:w-96 h-auto object-contain rounded-lg shadow-xl"
          animate={{ rotate: [0, 1, -1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
};

export default Hero;
