import React from "react";
import { useNavigate } from "react-router-dom";

const Card = ({ product }) => {
  const navigate = useNavigate();

  const handleNavigateToDetail = () => {
    navigate(`/laptoppurchasedetail/${product?.id}`);
  };

  return (
    <div
      onClick={handleNavigateToDetail}
      className="bg-white rounded-xl shadow-lg overflow-hidden 
      border border-teal-100 hover:shadow-xl transition-all duration-300
      group cursor-pointer"
    >
      {/* Image container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={product?.image || "/default-laptop.jpg"}
          alt={product?.name || "Laptop"}
          className="w-full h-full object-cover object-center
            group-hover:scale-110 transition-transform duration-500"
        />
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
          onClick={handleNavigateToDetail}
          className="font-semibold text-lg text-gray-800 
          truncate group-hover:text-teal-600 transition-colors"
        >
          {product?.name || "Laptop Name"}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2">
          {product?.shortDescription || "Description of the laptop"}
        </p>

        {/* Price and Action */}
        <div className="flex justify-between items-center pt-2">
          <div className="text-teal-600 font-bold">
            {product?.price ? `${product.price}đ` : "Contact"}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering parent's onClick
              navigate(`/laptop-detail/${product?.id}`);
            }}
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
