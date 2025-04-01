import React from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import useCartStore from "../../store/useCartStore";

const CartIcon = () => {
  const navigate = useNavigate();
  const cartCount = useCartStore((state) => state.getCartCount());

  return (
    <div className="relative cursor-pointer" onClick={() => navigate("/cart")}>
      <FaShoppingCart className="text-2xl text-white hover:text-gray-200" />
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {cartCount}
        </span>
      )}
    </div>
  );
};

export default CartIcon;
