import React, { useRef } from "react";
import CardBorrow from "../../reuse/cards/CardBorrow";

const ListLaptopBorrow = () => {
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
    <div className="p-6 space-y-10 bg-gradient-to-br from-emerald-50 to-teal-50">
      <h1 className="text-center font-bold text-3xl p-4 font-serif text-teal-800">
        Laptops Borrow
      </h1>

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
              <CardBorrow />
            </div>
            <div className="flex-none w-72 transform transition-transform duration-300 hover:scale-105">
              <CardBorrow />
            </div>
            <div className="flex-none w-72 transform transition-transform duration-300 hover:scale-105">
              <CardBorrow />
            </div>
            <div className="flex-none w-72 transform transition-transform duration-300 hover:scale-105">
              <CardBorrow />
            </div>
            <div className="flex-none w-72 transform transition-transform duration-300 hover:scale-105">
              <CardBorrow />
            </div>
            <div className="flex-none w-72 transform transition-transform duration-300 hover:scale-105">
              <CardBorrow />
            </div>
            <div className="flex-none w-72 transform transition-transform duration-300 hover:scale-105">
              <CardBorrow />
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

      {/* Nút Explore More */}
      <div className="flex justify-center pt-4">
        <a
          href="/laptop-borrow"
          className="px-6 py-3 rounded-full 
            bg-teal-600 text-white
            hover:bg-teal-700 
            transition-all duration-300
            shadow-md hover:shadow-lg
            font-medium
            flex items-center space-x-2"
        >
          <span>Explore More Borrow Options</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default ListLaptopBorrow;
