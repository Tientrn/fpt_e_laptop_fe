import React from "react";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import CouponInput from "./CouponInput";
import CartActions from "./CartAction";

const CartContainer = ({
  cartItems,
  totalPrice,
  onRemove,
  onUpdateQuantity,
  onApplyCoupon,
  onCheckout,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-teal-800">Shopping Cart</h1>
        <p className="mt-2 text-teal-600">
          {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your
          cart
        </p>
      </div>

      {cartItems.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section - Cart Items */}
          <div className="flex-grow space-y-6">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                product={item}
                onRemove={onRemove}
                onUpdateQuantity={onUpdateQuantity}
              />
            ))}
          </div>

          {/* Right Section - Summary and Actions */}
          <div className="w-full lg:w-96 space-y-6">
            <div
              className="bg-gradient-to-r from-teal-50 to-emerald-50 
              rounded-xl shadow-sm p-6 space-y-6"
            >
              <CouponInput onApplyCoupon={onApplyCoupon} />
              <div className="h-px bg-gradient-to-r from-transparent via-teal-100 to-transparent" />
              <CartSummary totalPrice={totalPrice} />
              <CartActions onCheckout={onCheckout} />
            </div>
          </div>
        </div>
      ) : (
        <div
          className="text-center py-16 bg-gradient-to-r from-teal-50 to-emerald-50 
          rounded-xl shadow-sm"
        >
          <div className="space-y-3">
            <p className="text-xl text-teal-800">Your cart is empty!</p>
            <p className="text-teal-600">
              Add some items to your cart to continue shopping.
            </p>
            <button
              onClick={() => (window.location.href = "/shop")}
              className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg
                hover:bg-teal-700 transition-all duration-300
                hover:shadow-md"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartContainer;
