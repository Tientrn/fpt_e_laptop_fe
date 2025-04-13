import { motion } from "framer-motion";
import laptopImage from "../../../assets/laptopanimation.jpg";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative flex flex-col lg:flex-row items-center justify-between min-h-[calc(100vh-106px)] px-6 py-12 md:py-20 bg-gradient-to-br from-indigo-50 to-purple-50 overflow-hidden">
      {/* Background Accent */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-400 opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600 opacity-10 rounded-full blur-3xl"></div>
      
      {/* Text Content */}
      <div className="z-10 max-w-lg text-center lg:text-left mb-12 lg:mb-0">
        <motion.span
          className="inline-block text-indigo-600 font-medium mb-4 rounded-full bg-indigo-100 px-4 py-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          The Best Laptop Companion For Students
        </motion.span>
        
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-indigo-900 leading-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          Elevate Your Experience with{" "}
          <span className="text-purple-600">FPT E-Laptop</span>
        </motion.h1>
        
        <motion.p
          className="text-lg text-indigo-700 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        >
          Rent or buy high-performance laptops designed specifically for students and professionals.{" "}
          <span className="font-medium text-indigo-800">
            Perfect for your study and work needs at affordable prices.
          </span>
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
        >
          <Link 
            to="/laptopshop"
            className="px-8 py-3 bg-indigo-800 text-white text-base font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
          >
            Shop Now
          </Link>
          <Link 
            to="/laptopborrow"
            className="px-8 py-3 bg-amber-500 text-indigo-900 text-base font-semibold rounded-lg shadow-md hover:bg-amber-400 transition-colors"
          >
            Borrow a Laptop
          </Link>
        </motion.div>
      </div>

      {/* Animated Laptop Image */}
      <motion.div
        className="z-10 w-full lg:w-1/2 flex justify-center lg:justify-end"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
      >
        <div className="relative">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-600/20 rounded-2xl -m-6"
            animate={{ 
              scale: [1, 1.03, 1],
              rotate: [0, 1, -1, 0],
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
          <motion.img
            src={laptopImage}
            alt="Laptop"
            className="w-full max-w-lg h-auto object-contain rounded-xl shadow-2xl"
            animate={{ 
              y: [0, -8, 0],
              rotate: [0, 0.5, -0.5, 0],
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </div>
      </motion.div>
      
      {/* Scroll down indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="text-sm text-indigo-500 mb-2">Scroll down</span>
        <motion.div
          className="w-6 h-10 border-2 border-indigo-400 rounded-full flex justify-center"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div 
            className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;
