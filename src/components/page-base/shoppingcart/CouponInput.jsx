import React, { useState } from "react";

const CouponInput = ({ onApplyCoupon }) => {
  const [coupon, setCoupon] = useState("");

  const handleApply = () => {
    if (coupon.trim()) {
      onApplyCoupon(coupon);
      setCoupon("");
    }
  };

  return (
    <div className="mt-4 flex items-center">
      <input
        type="text"
        value={coupon}
        onChange={(e) => setCoupon(e.target.value)}
        placeholder="Enter coupon code"
        className="flex-grow p-2 border border-teal-200 rounded-md 
          text-teal-800 bg-white focus:border-teal-400 
          focus:outline-none focus:ring-1 focus:ring-teal-400
          placeholder-teal-400/50"
      />
      <button
        onClick={handleApply}
        className="ml-2 px-4 py-2 bg-white text-teal-600 
          border border-teal-200 rounded-md 
          hover:bg-teal-600 hover:text-white hover:border-teal-600
          transition-colors duration-200"
      >
        Apply
      </button>
    </div>
  );
};

export default CouponInput;
