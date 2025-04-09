import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import useCartStore from "../../../store/useCartStore";
import OrderSummary from "./OrderSummary";
import { FaShoppingCart, FaLock } from "react-icons/fa";
import orderApis from "../../../api/orderApi";

const CheckoutForm = ({ orderId, cartItems, shippingCost }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { initializeCart } = useCartStore();
  const userData = localStorage.getItem("user");
  const [orderTotal, setOrderTotal] = useState(0);

  useEffect(() => {
    const status = searchParams.get("status");
    const cancel = searchParams.get("cancel");
    if (cancel === "true" || status === "cancel") {
      toast.info("Bạn đã hủy thanh toán");
      navigate("/laptopshop");
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    const newTotal = cartItems.reduce(
      (total, item) => total + item.totalPrice * item.quantity,
      0
    );
    setOrderTotal(newTotal);
  }, [cartItems]);

  const handlePlaceOrder = async () => {
    try {
      if (cartItems.length === 0) {
        toast.error("Giỏ hàng của bạn đang trống!");
        return;
      }

      const currentTotal = cartItems.reduce(
        (total, item) => total + item.totalPrice * item.quantity,
        0
      );

      const paymentResponse = await orderApis.createPayment({
        orderId,
        paymentMethod: 1,
        amount: currentTotal,
      });

      if (paymentResponse.data) {
        const urlResponse = await orderApis.createPaymentUrl({
          paymentId: paymentResponse.data.paymentId,
          redirectUrl: window.location,
          amount: currentTotal,
        });

        if (urlResponse.data) {
          initializeCart(userData.userId);
          window.open(urlResponse.data, "_blank");
          navigate("/laptopshop");
        } else {
          throw new Error("Không thể tạo URL thanh toán");
        }
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra trong quá trình thanh toán!");
    }
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left column - cart items */}
          <div className="lg:col-span-3 space-y-6">
            <h2 className="text-xl font-semibold text-black">Sản phẩm</h2>
            {cartItems.length === 0 ? (
              <div className="text-center py-10 border rounded text-gray-500">
                <FaShoppingCart className="mx-auto text-4xl mb-3" />
                Giỏ hàng của bạn trống
                <div>
                  <button
                    onClick={() => navigate("/laptopshop")}
                    className="mt-4 text-slate-600 hover:text-amber-600"
                  >
                    Quay lại cửa hàng
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="border border-gray-200 rounded-xl p-4 flex gap-4 items-start hover:shadow-sm"
                  >
                    <img
                      src={item.imageProduct}
                      alt={item.productName}
                      className="w-24 h-24 object-contain rounded border"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-black text-base">
                          {item.productName}
                        </h3>
                        <span className="text-amber-600 font-semibold text-sm">
                          {item.totalPrice.toLocaleString("vi-VN")}₫
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 text-sm text-gray-600">
                        <p>CPU: {item.cpu}</p>
                        <p>RAM: {item.ram}</p>
                        <p>Storage: {item.storage}</p>
                        <p>
                          Số lượng:{" "}
                          <span className="font-medium text-black">
                            {item.quantity}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right column - summary */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-black mb-4">
              Tổng quan đơn hàng
            </h2>

            <OrderSummary
              totalPrice={orderTotal}
              shippingCost={shippingCost}
              grandTotal={orderTotal + shippingCost}
            />

            <motion.button
              onClick={() => handlePlaceOrder()}
              disabled={cartItems.length === 0}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`mt-6 w-full py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors duration-200
                ${
                  cartItems.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-slate-600 hover:bg-amber-600 text-white"
                }
              `}
            >
              <FaLock className="w-4 h-4" />
              <span>Xác nhận thanh toán</span>
            </motion.button>

            <div className="mt-4 text-center text-sm text-gray-500">
              <span>Bạn sẽ được chuyển đến cổng thanh toán an toàn</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
