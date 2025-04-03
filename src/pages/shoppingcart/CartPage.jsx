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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-6">
          <h2 className="text-2xl font-semibold text-black mb-4">
            Giỏ hàng của bạn trống
          </h2>
          <button
            onClick={() => navigate("/laptopshop")}
            className="flex items-center gap-2 mx-auto text-black hover:text-amber-600 transition-colors duration-200"
          >
            <FaArrowLeft /> Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-black">Giỏ hàng</h1>
          <button
            onClick={() => navigate("/laptopshop")}
            className="flex items-center gap-2 text-black hover:text-amber-600 transition-colors duration-200"
          >
            <FaArrowLeft /> Tiếp tục mua sắm
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="bg-white border border-gray-200 rounded p-4 flex items-center space-x-4 hover:border-amber-600 transition-colors duration-300"
              >
                <img
                  src={item.imageProduct}
                  alt={item.productName}
                  className="w-20 h-20 object-contain rounded"
                />
                <div className="flex-1 space-y-2">
                  <h3 className="text-black font-medium text-sm">
                    {item.productName}
                  </h3>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>CPU: {item.cpu}</p>
                    <p>RAM: {item.ram}</p>
                    <p>Storage: {item.storage}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decreaseQuantity(item.productId)}
                        disabled={item.quantity <= 1}
                        className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 text-black hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <FaMinus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-black font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 text-black hover:bg-amber-50 transition-colors duration-200"
                      >
                        <FaPlus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-amber-600 font-semibold text-sm">
                      {formatPrice(item.totalPrice)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.productId)}
                  className="p-1 text-gray-500 hover:text-amber-600 transition-colors duration-200"
                >
                  <FaTrash className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-black mb-4">
                Tổng quan đơn hàng
              </h2>
              <div className="flex justify-between border-t border-gray-200 pt-4">
                <span className="text-black font-medium">Tổng cộng</span>
                <span className="text-amber-600 font-semibold">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>
              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-slate-600 text-white py-3 rounded mt-6 hover:bg-slate-700 transition-colors duration-200"
              >
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
