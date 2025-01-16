import React from "react";

export default function HighlightFeatureSection({ images }) {
  return (
    <div
      id="budget-laptops"
      className="container mx-auto my-8 flex flex-col md:flex-row items-center md:space-x-20 p-8"
    >
      <div className="relative w-full md:w-1/2 mb-8 md:mb-0">
        <img
          src={images.img1 || "https://via.placeholder.com/150x150"}
          alt="Laptop Sale 1"
          className="w-[300px] h-auto object-cover rounded-lg shadow-xl hover:scale-105 transition-transform duration-300"
        />
        <img
          src={images.img2}
          alt="Laptop Sale 2"
          className="absolute -bottom-4 left-32 w-[300px] h-auto object-cover rounded-lg shadow-xl hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="w-full md:w-1/2 text-center md:text-left">
        <h1 className="font-bold text-4xl font-serif mb-6 text-olive-dark">
          Budget-Friendly Student Laptops
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          <span className="font-semibold text-gray-800 text-xl">
            Explore our collection of high-quality laptops at affordable prices.
          </span>
          <span className="font-medium text-gray-800">
            Perfect for students with features including long-lasting battery
            life, lightweight and portable design, reliable performance for
            studying, official warranty, and student-friendly payment plans.
          </span>
        </p>
        <button className="mt-8 bg-white text-black border-2 border-black px-8 py-3 rounded-lg hover:bg-[#808000] hover:text-white hover:border-[#808000] transition-all duration-300 font-semibold">
          Shop Now
        </button>
      </div>
    </div>
  );
}
