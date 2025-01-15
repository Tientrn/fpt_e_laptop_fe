import React, { useState } from "react";
import CheckoutForm from "../../components/page-base/checkout/CheckoutForm";

const initialCartItems = [
  {
    id: 1,
    name: "Product 1",
    price: 29.99,
    quantity: 1,
    image: "link_to_image",
  },
  {
    id: 2,
    name: "Product 2",
    price: 19.99,
    quantity: 2,
    image: "link_to_image",
  },
];

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [shippingCost] = useState(5.0);

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
    <CheckoutForm
      cartItems={cartItems}
      onUpdateQuantity={handleUpdateQuantity}
      onRemove={handleRemoveItem}
      shippingCost={shippingCost}
    />
  );
};

export default CheckoutPage;
