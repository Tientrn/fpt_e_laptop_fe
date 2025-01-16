import React from "react";

const CartSummary = ({ totalPrice }) => {
  return (
    <div
      className="bg-gradient-to-r from-teal-50 to-emerald-50 
      p-4 rounded-xl mt-4 border border-teal-100 
      hover:shadow-md hover:border-teal-200 
      transition-all duration-300"
    >
      <h2 className="text-lg font-bold mb-2 text-teal-800">Order Summary</h2>
      <div className="flex justify-between">
        <p className="text-teal-600">Total Price:</p>
        <p className="font-bold text-teal-700">
          {new Intl.NumberFormat("vi-VN").format(totalPrice)} VND
        </p>
      </div>
    </div>
  );
};

export default CartSummary;
