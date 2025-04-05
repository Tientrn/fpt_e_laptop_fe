import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import useCartStore from "../../../store/useCartStore"; 

const CartItem = ({ product }) => {
  const { addToCart, decreaseQuantity, removeFromCart } = useCartStore();

  if (!product) {
    return <div className="text-black">Product not found</div>;
  }

  const { productId, productName, totalPrice, quantity, imageProduct } = product;

  const handleIncrease = () => {
    addToCart({
      ...product,
      quantity: 1
    });
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      decreaseQuantity(productId);
    }
  };

  const handleRemove = () => {
    removeFromCart(productId);
  };

  return (
    <div className="bg-white border border-gray-200 rounded p-4 flex items-center space-x-4 hover:border-amber-600 transition-colors duration-300">
      {/* Image */}
      <div className="w-20 h-20 flex-shrink-0">
        <img
          src={imageProduct}
          alt={productName}
          className="w-full h-full object-contain rounded"
        />
      </div>

      {/* Content */}
      <div className="flex-grow space-y-2">
        <h3 className="text-black font-medium text-sm">{productName}</h3>
        <p className="text-amber-600 font-semibold text-sm">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(totalPrice)}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 text-black hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            -
          </button>
          <span className="w-8 text-center text-black font-medium">
            {quantity}
          </span>
          <button
            onClick={handleIncrease}
            className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 text-black hover:bg-amber-50 transition-colors duration-200"
          >
            +
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col items-end space-y-2">
        <span className="text-black font-semibold text-sm">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(totalPrice * quantity)}
        </span>
        <button
          onClick={handleRemove}
          className="p-1 text-gray-500 hover:text-amber-600 transition-colors duration-200"
        >
          <DeleteIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
