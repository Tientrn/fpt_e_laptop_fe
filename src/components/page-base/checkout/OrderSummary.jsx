import React from "react";

const OrderSummary = ({ totalPrice = 0, shippingCost = 0, grandTotal = 0 }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-300">
      {/* Header */}
      <div className="p-4 border-b border-gray-300">
        <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Subtotal</span>
          <span className="font-medium text-gray-900">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(totalPrice)}
          </span>
        </div>

        {/* Shipping Cost */}
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Shipping</span>
          <span className="font-medium text-gray-900">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(shippingCost)}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-300" />

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">Total</span>
          <div className="text-right">
            <span className="text-lg font-bold text-gray-900">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(grandTotal)}
            </span>
            <p className="text-xs text-gray-600 mt-1">Including VAT</p>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-6 pt-4 border-t border-gray-300">
        <h3 className="text-sm font-medium text-gray-900 mb-4">We Accept</h3>
          <div className="flex items-center space-x-4 justify-center">
                    <img src="/visa.png" alt="Visa" className="h-8 object-contain" />
                    <img src="/mastercard.png" alt="Mastercard" className="h-8 object-contain" />
                    <img src="/momo.png" alt="Momo" className="h-8 object-contain" />
                  </div>
        </div>

        {/* Secure Transaction */}
        <div className="flex items-center justify-center space-x-2 bg-gray-100 p-3 rounded-lg">
          <svg
            className="w-5 h-5 text-amber-600"
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
          <span className="text-sm text-gray-700">Secure Transaction</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
