import React from "react";

const EmptyCart = () => {
  return (
    <div className="text-center py-8">
      <p className="text-gray-500">Your cart is empty!</p>
      <button
        onClick={() => (window.location.href = "/shop")}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Shop Now
      </button>
    </div>
  );
};

export default EmptyCart;
