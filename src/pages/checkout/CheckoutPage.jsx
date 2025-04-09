import React, { useState } from "react";
import CheckoutForm from "../../components/page-base/checkout/CheckoutForm";
import useCartStore from "../../store/useCartStore";
import { useParams, useNavigate } from "react-router-dom";

const initialCartItems = [];

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [shippingCost] = useState(5.0);
  const { orderId } = useParams();
  const { getCurrentCart } = useCartStore();
  const navigate = useNavigate();

  const items = getCurrentCart();

  const handleUpdateQuantity = (id, newQuantity) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(newQuantity, 1) } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-white text-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Nút quay lại */}
        <div>
          <button
            onClick={() => navigate("/laptopshop")} // hoặc "/cart" tùy luồng
            className="flex items-center text-slate-600 hover:text-amber-600 text-sm font-medium transition"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to shop
          </button>
        </div>

        {/* Tiêu đề thanh toán */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <div className="w-16 h-1 bg-amber-600 mx-auto mt-2 rounded-full" />
          <p className="mt-2 text-sm text-gray-500">
            Please check your order information before completing.
          </p>
        </div>

        {/* Form thanh toán */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <CheckoutForm
            orderId={orderId}
            cartItems={items}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemoveItem}
            shippingCost={shippingCost}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
