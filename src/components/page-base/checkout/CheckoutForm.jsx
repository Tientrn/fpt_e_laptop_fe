import React, { useState } from "react";
import CartItem from "../shoppingcart/CartItem";
import CartSummary from "../shoppingcart/CartSummary";
import ShippingInformation from "./ShippingInformation";
import PaymentInformation from "./PaymentInformation";
import OrderSummary from "./OrderSummary";
import ErrorMessage from "./ErrorMessage";

const CheckoutForm = ({
  cartItems,
  onUpdateQuantity,
  onRemove,
  shippingCost,
}) => {
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const grandTotal = totalPrice + shippingCost;
  const [errors, setErrors] = useState([]);

  const validateForm = () => {
    const newErrors = [];
    if (cartItems.length === 0) newErrors.push("Your cart is empty.");
    return newErrors;
  };

  const handlePlaceOrder = () => {
    const formErrors = validateForm();
    if (formErrors.length > 0) {
      setErrors(formErrors);
    } else {
      setErrors([]);
      console.log("Order placed successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50/50 to-emerald-50/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-teal-800 text-center mb-8">
          Checkout
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Forms */}
          <div className="flex-grow space-y-6">
            {/* Cart Items */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-teal-800 mb-4">
                  Your Cart
                </h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      product={item}
                      onUpdateQuantity={onUpdateQuantity}
                      onRemove={onRemove}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-teal-800 mb-4">
                  Shipping Information
                </h2>
                <ShippingInformation />
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-teal-800 mb-4">
                  Payment Information
                </h2>
                <PaymentInformation />
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-xl shadow-sm sticky top-6">
              <div className="p-6 space-y-6">
                <h2 className="text-xl font-semibold text-teal-800">
                  Order Summary
                </h2>

                <OrderSummary
                  totalPrice={totalPrice}
                  shippingCost={shippingCost}
                  grandTotal={grandTotal}
                />

                {/* Error Messages */}
                {errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    {errors.map((error, index) => (
                      <ErrorMessage key={index} message={error} />
                    ))}
                  </div>
                )}

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  className="w-full py-3 px-4 bg-teal-600 text-white rounded-lg
                    hover:bg-teal-700 active:bg-teal-800
                    transition-all duration-300
                    hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0
                    font-medium"
                >
                  Place Order
                </button>

                {/* Secure Checkout Notice */}
                <div className="flex items-center justify-center space-x-2 text-teal-600">
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span className="text-sm">Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
