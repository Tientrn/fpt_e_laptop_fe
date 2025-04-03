import React from "react";

const ErrorMessage = ({ message }) => {
  return (
    <div
      className="flex items-center space-x-2 p-3 rounded-lg 
      bg-white border border-gray-300 text-gray-900 shadow-sm"
    >
      <svg
        className="w-5 h-5 flex-shrink-0 text-amber-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

export default ErrorMessage;
