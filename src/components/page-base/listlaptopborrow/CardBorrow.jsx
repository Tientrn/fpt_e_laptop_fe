import React from "react";
import { Link, useNavigate } from "react-router-dom";

const CardBorrow = ({ laptop }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/borrow/${laptop.itemId}`);
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-duration-300 h-[540px] flex flex-col cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative h-48">
        <img
          src={laptop.itemImage}
          alt={laptop.itemName}
          className="w-full h-full object-cover"
        />
        <div
          className={`absolute top-4 right-4 px-3 py-1 rounded-md text-sm font-medium text-white
            ${laptop.status === "Available" ? "bg-teal-500" : "bg-red-500"}`}
        >
          {laptop.status}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-xl mb-4 text-gray-800 line-clamp-2 min-h-[3.5rem]">
          {laptop.itemName}
        </h3>
        
        <div className="space-y-2.5 flex-grow">
          <div className="flex items-center text-gray-600">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            <span className="truncate">CPU: {laptop.cpu}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="truncate">RAM: {laptop.ram}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
            <span className="truncate">Storage: {laptop.storage}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="truncate">Screen Size: {laptop.screenSize}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="truncate">Condition: {laptop.conditionItem || "N/A"}</span>
          </div>
        </div>

        {/* Detail Button - Ngăn chặn sự kiện click lan truyền */}
        <div className="mt-4 flex justify-end">
          <Link
            to={`/borrow/${laptop.itemId}`}
            className="inline-flex items-center px-4 py-2 text-sm 
                     bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <span>View Detail</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardBorrow;