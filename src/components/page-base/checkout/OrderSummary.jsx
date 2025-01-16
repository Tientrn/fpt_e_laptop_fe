import React from "react";

const OrderSummary = ({ totalPrice = 0, shippingCost = 0, grandTotal = 0 }) => {
  return (
    <div
      className="bg-gradient-to-br from-teal-50 to-emerald-50 
      rounded-xl shadow-sm border border-teal-100"
    >
      {/* Header */}
      <div className="p-4 border-b border-teal-100">
        <h2 className="text-xl font-semibold text-teal-800">Order Summary</h2>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span className="text-teal-600">Subtotal</span>
          <span className="font-medium text-teal-800">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(totalPrice)}
          </span>
        </div>

        {/* Shipping Cost */}
        <div className="flex justify-between items-center">
          <span className="text-teal-600">Shipping</span>
          <span className="font-medium text-teal-800">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(shippingCost)}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-teal-100 to-transparent" />

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-teal-800">Total</span>
          <div className="text-right">
            <span className="text-lg font-bold text-teal-800">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(grandTotal)}
            </span>
            <p className="text-xs text-teal-600 mt-1">Including VAT</p>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-6 pt-4 border-t border-teal-100">
          <p className="text-sm text-teal-600 mb-3">We Accept</p>
          <div className="flex items-center space-x-2">
            <img
              src="/visa.svg"
              alt="Visa"
              className="h-8 w-auto grayscale hover:grayscale-0 transition-all"
            />
            <img
              src="/mastercard.svg"
              alt="Mastercard"
              className="h-8 w-auto grayscale hover:grayscale-0 transition-all"
            />
            <img
              src="/momo.svg"
              alt="Momo"
              className="h-8 w-auto grayscale hover:grayscale-0 transition-all"
            />
          </div>
        </div>

        {/* Secure Transaction */}
        <div
          className="flex items-center justify-center space-x-2 
          bg-white/50 p-3 rounded-lg"
        >
          <svg
            className="w-5 h-5 text-teal-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span className="text-sm text-teal-600">Secure Transaction</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
