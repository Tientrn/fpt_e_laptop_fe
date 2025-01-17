import React from "react";
import { useNavigate } from "react-router-dom";

const CartActions = ({ onCheckout }) => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
    if (onCheckout) onCheckout();
  };

  return (
    <div className="mt-8 space-y-4">
      {/* Total Section */}
      <div
        className="bg-gradient-to-r from-teal-50 to-emerald-50 
        p-6 rounded-xl shadow-sm space-y-4"
      >
        <div className="flex justify-between items-center text-lg">
          <span className="text-teal-800 font-medium">Subtotal:</span>
          <span className="text-teal-600 font-bold">$2,400.00</span>
        </div>
        <div className="flex justify-between items-center text-lg">
          <span className="text-teal-800 font-medium">Shipping:</span>
          <span className="text-teal-600 font-bold">$25.00</span>
        </div>
        <div className="h-px bg-teal-200"></div>
        <div className="flex justify-between items-center text-xl">
          <span className="text-teal-900 font-semibold">Total:</span>
          <span className="text-teal-700 font-bold">$2,425.00</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/laptoppurchase")}
          className="flex-1 px-6 py-3 rounded-lg border-2 border-teal-500 text-teal-600
            hover:bg-teal-50 active:bg-teal-100
            transition-all duration-300 font-medium
            flex items-center justify-center space-x-2 group"
        >
          <svg
            className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16l-4-4m0 0l4-4m-4 4h18"
            />
          </svg>
          <span>Continue Shopping</span>
        </button>

        <button
          onClick={handleCheckout}
          className="flex-1 px-6 py-3 rounded-lg bg-teal-600 text-white
            hover:bg-teal-700 active:bg-teal-800
            transition-all duration-300 font-medium
            flex items-center justify-center space-x-2 group
            hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>Proceed to Checkout</span>
          <svg
            className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartActions;
