import React from "react";

const Hero = () => {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center aspect-auto"
      style={{
        backgroundImage: "url(../src/assets/banner.jpg)",
      }}
    >
      <div className="bg-black/30 p-8 rounded-lg text-center backdrop-blur-sm transform transition-transform duration-300 hover:scale-105">
        <h1 className="text-5xl font-bold text-white mb-4 pointer-events-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          Welcome to FPT E-Laptop
        </h1>
        <p className="text-2xl text-yellow-300 mt-2 leading-relaxed pointer-events-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          Discover our high quality laptop Borrow and Sales!
        </p>
      </div>
    </div>
  );
};

export default Hero;
