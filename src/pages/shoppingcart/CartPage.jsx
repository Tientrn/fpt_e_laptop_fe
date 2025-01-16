import React, { useState } from "react";
import CartContainer from "../../components/page-base/shoppingcart/CartContainer";

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Product A",
      price: 50,
      quantity: 2,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 2,
      name: "Product B",
      price: 30,
      quantity: 1,
      image: "https://via.placeholder.com/100",
    },
  ]);

  const handleRemove = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleApplyCoupon = (code) => {
    alert(`Coupon ${code} applied!`);
  };

  const handleCheckout = () => {
    alert("Proceeding to checkout...");
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <CartContainer
      cartItems={cartItems}
      totalPrice={totalPrice}
      onRemove={handleRemove}
      onUpdateQuantity={handleUpdateQuantity}
      onApplyCoupon={handleApplyCoupon}
      onCheckout={handleCheckout}
    />
  );
}
