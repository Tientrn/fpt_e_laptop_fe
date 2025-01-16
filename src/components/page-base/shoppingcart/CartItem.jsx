import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";

const CartItem = ({ product, onRemove, onUpdateQuantity }) => {
  if (!product) {
    return <div>Product not found</div>;
  }
  const { id, name, price, quantity, image } = product;

  return (
    <div
      className="group bg-gradient-to-r from-white to-teal-50 
      rounded-xl shadow-sm hover:shadow-md transition-all duration-300 
      overflow-hidden"
    >
      <div className="flex items-center p-4 space-x-4">
        {/* Image */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover rounded-lg 
              transform transition-transform duration-300 
              group-hover:scale-105"
          />
          <div
            className="absolute inset-0 rounded-lg 
            ring-1 ring-teal-200 group-hover:ring-teal-300 
            transition-all duration-300"
          ></div>
        </div>

        {/* Content */}
        <div className="flex-grow space-y-2">
          <h3
            className="font-medium text-teal-900 group-hover:text-teal-700 
            transition-colors duration-300"
          >
            {name}
          </h3>
          <p className="text-teal-600 font-medium">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(price)}
          </p>

          {/* Quantity Controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onUpdateQuantity(id, quantity - 1)}
              className="w-8 h-8 flex items-center justify-center 
                rounded-full bg-teal-50 text-teal-600
                hover:bg-teal-100 active:bg-teal-200
                transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={quantity <= 1}
            >
              -
            </button>

            <span className="w-12 text-center font-medium text-teal-800">
              {quantity}
            </span>

            <button
              onClick={() => onUpdateQuantity(id, quantity + 1)}
              className="w-8 h-8 flex items-center justify-center 
                rounded-full bg-teal-50 text-teal-600
                hover:bg-teal-100 active:bg-teal-200
                transition-all duration-300"
            >
              +
            </button>

            {/* Subtotal for mobile */}
            <span className="ml-4 text-sm text-teal-600 sm:hidden">
              Subtotal:{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(price * quantity)}
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-end space-y-3">
          {/* Subtotal for desktop */}
          <span className="hidden sm:block font-medium text-teal-800">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(price * quantity)}
          </span>

          {/* Remove Button */}
          <button
            onClick={() => onRemove(id)}
            className="p-2 rounded-full text-teal-500
              hover:text-red-500 hover:bg-red-50
              transition-all duration-300
              group/delete"
          >
            <DeleteIcon
              className="transform transition-transform duration-300
              group-hover/delete:rotate-12"
            />
          </button>
        </div>
      </div>

      {/* Bottom Border with Gradient */}
      <div className="h-px bg-gradient-to-r from-transparent via-teal-100 to-transparent"></div>
    </div>
  );
};

export default CartItem;
