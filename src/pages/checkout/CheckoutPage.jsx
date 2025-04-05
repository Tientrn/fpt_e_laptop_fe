import React, { useState } from "react";
import CheckoutForm from "../../components/page-base/checkout/CheckoutForm";
import useCartStore from "../../store/useCartStore";
import orderApis from "../../api/orderApi";
import { useParams } from "react-router-dom";

const initialCartItems = [
  {
    id: 1,
    name: "Laptop Dell XPS 13",
    price: 1299.99,
    quantity: 1,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "MacBook Air M1",
    price: 999.99,
    quantity: 2,
    image: "https://via.placeholder.com/150",
  },
];

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [shippingCost] = useState(5.0);
  const { orderId } = useParams();
  const {
    getCurrentCart,
    removeFromCart,
    addToCart,
    decreaseQuantity,
    getTotalPrice
  } = useCartStore();

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto">
        <CheckoutForm
          orderId={orderId}
          cartItems={items}
          onUpdateQuantity={handleUpdateQuantity}
          onRemove={handleRemoveItem}
          shippingCost={shippingCost}
        />
      </div>
    </div>
  );
};

export default CheckoutPage;
