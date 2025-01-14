import React from "react";
import { useState } from "react";

const Rating = ({ totalStars = 5 }) => {
  const [rating, setRating] = useState(0);

  const handleRating = (index) => {
    setRating(index);
  };
  return (
    <div className="flex items-center space-x-2">
      {Array.from({ length: totalStars }, (_, index) => (
        <button
          key={index}
          onClick={() => handleRating(index + 1)}
          className={`text-2xl ${
            index < rating ? "text-yellow-400" : "text-gray-300"
          } hover:scale-110 transition transform`}
        >
          ★
        </button>
      ))}
      <span className="text-sm text-gray-600">
        ({rating}/{totalStars})
      </span>
    </div>
  );
};

export default Rating;
