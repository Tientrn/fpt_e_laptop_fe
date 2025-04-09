import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus, FaArrowLeft } from "react-icons/fa";
import useCartStore from "../../store/useCartStore";
import { toast } from "react-toastify";
import orderApis from "../../api/orderApi";

const CartPage = () => {
  const [quantityErrors, setQuantityErrors] = useState({});
  const navigate = useNavigate();
  const {
    initializeCart,
    getCurrentCart,
    removeFromCart,
    addToCart,
    decreaseQuantity,
    getTotalPrice,
  } = useCartStore();

  const items = getCurrentCart();
  const userData = localStorage.getItem("user");

  const handleDecreaseQuantity = (item) => {
    decreaseQuantity(item.productId);
    // Xóa lỗi nếu có khi giảm số lượng xuống dưới tồn kho
    setQuantityErrors((prev) => ({ ...prev, [item.productId]: null }));
  };

  const handleIncreaseQuantity = (item) => {
    if (item.quantity < item.quantityAvailable) {
      addToCart(item);
      // Xóa lỗi nếu có
      setQuantityErrors((prev) => ({ ...prev, [item.productId]: null }));
    } else {
      // Gán lỗi cho đúng sản phẩm
      setQuantityErrors((prev) => ({
        ...prev,
        [item.productId]: "Out of stock",
      }));
    }
  };

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

  const handleCheckout = () => {
    if (items && items.length > 0) {
      var orderDetail = [];
      const sum = items.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.quantity * currentValue.totalPrice;
      }, 0);

      const user = JSON.parse(userData);
      console.log("user", user);
      const order = {
        userId: user.userId ?? 1,
        totalPrice: sum,
        field: "string",
        orderAddress: "string",
        status: "Active",
      };

      orderApis
        .createOrder(order)
        .then((data) => {
          items.map((item) => {
            orderDetail.push({
              orderId: data.data.orderId,
              productId: item.productId,
              quantity: item.quantity,
              priceItem: item.totalPrice,
            });
          });
          orderApis.createOrderDetail([...orderDetail]);
          toast.success("Order created successfully!", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });

          navigate(`/checkout/${data.data.orderId}`);
        })
        .catch((err) =>
          toast.error("Order creation failed", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          })
        );
    }
    toast.warning("Your cart is empty");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-6">
          <h2 className="text-2xl font-semibold text-black mb-4">
            Your cart is empty
          </h2>
          <button
            onClick={() => navigate("/laptopshop")}
            className="flex items-center gap-2 mx-auto text-black hover:text-amber-600 transition-colors duration-200"
          >
            <FaArrowLeft /> Continue shopping
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
            <FaArrowLeft /> Continue shopping
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

                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDecreaseQuantity(item)}
                        disabled={item.quantity <= 1}
                        className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 text-black hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <FaMinus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-black font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleIncreaseQuantity(item)}
                        className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 text-black hover:bg-amber-50 transition-colors duration-200"
                      >
                        <FaPlus className="w-3 h-3" />
                      </button>
                    </div>

                    {quantityErrors[item.productId] && (
                      <span className="text-xs text-red-600 mt-1 ml-1">
                        {quantityErrors[item.productId]}
                      </span>
                    )}
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
              <h2 className="text-lg font-semibold text-black mb-6">
                Order Summary
              </h2>

              {/* Add list items */}
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between text-sm"
                  >
                    <div className="flex items-start">
                      <span className="text-gray-600">
                        {item.productName}
                        <span className="text-gray-400 ml-1">
                          x{item.quantity}
                        </span>
                      </span>
                    </div>
                    <span className="text-gray-800 font-medium">
                      {formatPrice(item.totalPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-4 mb-4"></div>

              {/* Total */}
              <div className="flex justify-between">
                <span className="text-black font-medium">Total</span>
                <span className="text-amber-600 font-semibold">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>

              <button
                onClick={() => handleCheckout()}
                className="w-full bg-slate-600 text-white py-3 rounded mt-6 hover:bg-slate-700 transition-colors duration-200"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
