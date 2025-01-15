import React, { useRef } from "react";
import Card from "../../reuse/cards/Card";

const ProductRelated = () => {
  const scrollContainerRef = useRef(null);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-teal-800">Similar Products</h2>
        <p className="text-teal-600 text-sm">
          Products with similar specifications or from the same brand
        </p>
      </div>

      {/* Container chính */}
      <div className="relative max-w-[95%] mx-auto">
        {/* Nút scroll trái */}
        <button
          onClick={handleScrollLeft}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 
            w-10 h-10 flex items-center justify-center
            bg-white/90 rounded-full shadow-lg 
            hover:bg-white hover:shadow-xl
            transition-all duration-300 
            border border-teal-100
            group"
        >
          <svg
            className="w-6 h-6 text-teal-600 group-hover:text-teal-700 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Container sản phẩm với scroll */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide scroll-smooth
            py-4 px-2"
        >
          <div className="flex space-x-6 w-fit">
            <div className="flex-none w-72 transform transition-transform duration-300 hover:scale-105">
              <Card />
            </div>
            <div className="flex-none w-72 transform transition-transform duration-300 hover:scale-105">
              <Card />
            </div>
            <div className="flex-none w-72 transform transition-transform duration-300 hover:scale-105">
              <Card />
            </div>
            <div className="flex-none w-72 transform transition-transform duration-300 hover:scale-105">
              <Card />
            </div>
          </div>
        </div>

        {/* Nút scroll phải */}
        <button
          onClick={handleScrollRight}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 
            w-10 h-10 flex items-center justify-center
            bg-white/90 rounded-full shadow-lg 
            hover:bg-white hover:shadow-xl
            transition-all duration-300 
            border border-teal-100
            group"
        >
          <svg
            className="w-6 h-6 text-teal-600 group-hover:text-teal-700 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductRelated;
