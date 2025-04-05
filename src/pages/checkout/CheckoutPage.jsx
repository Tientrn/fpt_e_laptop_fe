import React, { useState } from "react";
import CheckoutForm from "../../components/page-base/checkout/CheckoutForm";
import useCartStore from "../../store/useCartStore";
import orderApis from "../../api/orderApi";
import { useParams } from "react-router-dom";

const initialCartItems = [
];

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [shippingCost] = useState(5.0);
  const { orderId } = useParams();
  const { getCurrentCart } = useCartStore();

  const items = getCurrentCart();
  const userData = localStorage.getItem("user");

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
    <div className="min-h-screen relative">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Animated Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 
              'linear-gradient(to right, #4f46e5 1px, transparent 1px), linear-gradient(to bottom, #4f46e5 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        
        {/* Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top Left Blob */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
        
        {/* Bottom Right Blob */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
        
        {/* Center Blob */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />

        {/* Additional Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 animate-pulse" />
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full opacity-20 animate-pulse animation-delay-2000" />
      </div>

      {/* Content */}
      <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto backdrop-blur-sm">
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
