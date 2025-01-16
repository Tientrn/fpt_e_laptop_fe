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
      className="relative w-96 z-0 hover:transform hover:scale-105 transition-all duration-300 mb-32 cursor-pointer"
      onClick={handleClick}
    >
      <div className="absolute -z-10 w-full">
        <img
          src={image || "https://via.placeholder.com/60x40"}
          alt="Feature Image"
          className="mb-4 h-40 w-full rounded-md object-cover shadow-lg"
        />
      </div>

      <h1 className="relative top-16 mb-2 text-center text-lg font-semibold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
        {title}
      </h1>
    </div>
  );
}
