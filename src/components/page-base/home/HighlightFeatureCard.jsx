import React from "react";

const HighlightFeatureCard = ({ title }) => {
  return (
    <div className="relative w-96 z-0">
      <div className="absolute -z-10 w-full">
        <img
          src="https://via.placeholder.com/60x40"
          alt="Feature Image"
          class="mb-4 h-40 w-full rounded-md object-cover"
        />
      </div>

      <h1 className="relative top-16 mb-2 text-center text-lg font-semibold text-gray-800">
        {title}
      </h1>
    </div>
  );
};

export default HighlightFeatureCard;
