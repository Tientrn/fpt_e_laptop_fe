import React from "react";

export default function HighlightFeatureCard({ title, image, sectionId }) {
  const handleClick = () => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div
      className="relative w-80 p-6 border border-gray-200 rounded-2xl shadow-lg bg-white hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 flex flex-col items-center"
      onClick={handleClick}
    >
      <div className="w-full h-44 flex justify-center items-center overflow-hidden rounded-xl bg-gray-100">
        <img
          src={image || "https://via.placeholder.com/300x200"}
          alt="Feature Image"
          className="w-auto h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      <h1 className="mt-6 text-center text-lg font-semibold text-gray-900 hover:text-amber-600 transition-colors duration-300">
        {title}
      </h1>
    </div>
  );
}
