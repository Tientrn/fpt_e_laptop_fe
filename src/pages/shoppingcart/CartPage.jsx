import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus, FaArrowLeft } from "react-icons/fa";
import useCartStore from "../../store/useCartStore";
import { toast } from "react-toastify";

const CartPage = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, addToCart, decreaseQuantity, getTotalPrice } =
    useCartStore();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    toast.success("Removed item from cart");
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-64px)]">
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="text-center my-16">
            <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
            <button
              onClick={() => navigate("/laptopshop")}
              className="text-[#2563EB] hover:text-[#1d4ed8] flex items-center gap-2 mx-auto"
            >
              <FaArrowLeft /> Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Shopping Cart</h1>
          <button
            onClick={() => navigate("/laptopshop")}
            className="text-[#2563EB] hover:text-[#1d4ed8] flex items-center gap-2"
          >
            <FaArrowLeft /> Continue Shopping
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-4 p-4 border-b last:border-b-0"
                >
                  <img
                    src={item.imageProduct}
                    alt={item.productName}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      {item.productName}
                    </h3>
                    <div className="text-sm text-gray-600 mb-2">
                      <p>CPU: {item.cpu}</p>
                      <p>RAM: {item.ram}</p>
                      <p>Storage: {item.storage}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => decreaseQuantity(item.productId)}
                          className="p-1 rounded-md hover:bg-gray-100"
                        >
                          <FaMinus className="text-[#10B981]" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="p-1 rounded-md hover:bg-gray-100"
                        >
                          <FaPlus className="text-[#10B981]" />
                        </button>
                      </div>
                      <div className="text-[#10B981] font-semibold">
                        {formatPrice(item.totalPrice)}
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between border-t pt-4">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-[#10B981]">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-[#10B981] text-white py-3 rounded-lg mt-6 hover:bg-[#0F766E] transition-colors duration-300"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
