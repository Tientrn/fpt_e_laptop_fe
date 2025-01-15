import React from "react";
import { useNavigate } from "react-router-dom";

function CardBorrow({ product }) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden 
      border border-teal-100 hover:shadow-xl transition-all duration-300
      group"
    >
      {/* Image container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={
            product?.image ||
            "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3"
          }
          alt={product?.name || "Laptop"}
          className="w-full h-full object-cover object-center
            group-hover:scale-110 transition-transform duration-500"
        />
        {/* Status badge */}
        <span
          className={`absolute top-2 right-2 px-3 py-1 text-white text-sm rounded-full
          ${product?.status === "Available" ? "bg-teal-500" : "bg-red-500"}
          transition-colors duration-300`}
        >
          {product?.status || "Available"}
        </span>
        {/* Overlay gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 
          group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>

      {/* Content container */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3
          className="font-semibold text-lg text-gray-800 
          truncate group-hover:text-teal-600 transition-colors"
        >
          {product?.name || "Laptop Name"}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2">
          {product?.shortDescription || "Description of the laptop"}
        </p>

        {/* Specs */}
        <div className="space-y-1">
          <div className="flex items-center text-sm text-gray-600">
            <svg
              className="w-4 h-4 mr-2 text-teal-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
            <span>{product?.processor || "Processor"}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <svg
              className="w-4 h-4 mr-2 text-teal-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{product?.ram || "RAM"}</span>
          </div>
        </div>

        {/* Action button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={() => navigate(`/laptop-borrow/${product?.id}`)}
            className="p-2 bg-teal-600 text-white rounded-lg
              hover:bg-teal-700 transition-all duration-300
              hover:scale-110 active:scale-95
              flex items-center justify-center
              group/btn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 group-hover/btn:animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardBorrow;
