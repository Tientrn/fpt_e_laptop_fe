import React from "react";

const Hero = () => {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center aspect-auto "
      style={{
        backgroundImage: "url(../src/assets/banner.jpg)", // Thay thế bằng URL ảnh của bạn
      }}
    >
      <div className=" bg-opacity-70 p-8 rounded-lg text-center shadow-lg transform transition-transform duration-300 hover:scale-105">
        <h1 className="text-4xl font-bold text-white mb-4 pointer-events-none">
          Welcome to FPT E-Laptop
        </h1>
        <p className="text-lg text-yellow-400 mt-2 leading-relaxed pointer-events-none">
          Discover our high quality laptop Borrow and Sales!
        </p>
      </div>
    </div>
  );
};

export default Hero;
