import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import useCartStore from "../../../store/useCartStore";
import OrderSummary from "./OrderSummary";
import { FaShoppingCart, FaLock } from "react-icons/fa";
import orderApis from "../../../api/orderApi";

const CheckoutForm = ({
  orderId,
  cartItems: initialCartItems,
  shippingCost,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { initializeCart } = useCartStore();
  const userData = localStorage.getItem("user");
  const [orderTotal, setOrderTotal] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedItems = JSON.parse(
      localStorage.getItem("checkout_products") || "[]"
    );
    if (initialCartItems?.length > 0) {
      setCartItems(initialCartItems);
      localStorage.setItem(
        "checkout_products",
        JSON.stringify(initialCartItems)
      );
    } else if (storedItems.length > 0) {
      setCartItems(storedItems);
    }
  }, [initialCartItems]);

  useEffect(() => {
    const status = searchParams.get("status");
    const cancel = searchParams.get("cancel");

    if (cancel === "true" || status === "cancel") {
      toast.info("You have canceled the payment");
      navigate("/laptopshop");
      return;
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
        toast.error("Your cart is empty!");
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
          redirectUrl: window.location.href,
          amount: currentTotal,
        });

        if (urlResponse.data) {
          initializeCart(userData?.userId);
          if (onSuccess) onSuccess();
          window.open(urlResponse.data, "_blank");
          toast.success("Payment successful! Redirecting to home page...");
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          throw new Error("Cannot create payment URL");
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("An error occurred during the payment process!");
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-black mb-6">Checkout</h1>

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

        <div className="mt-6 border-t pt-6">
          <OrderSummary
            totalPrice={orderTotal}
            shippingCost={shippingCost}
            grandTotal={orderTotal + shippingCost}
          />

          <button
            onClick={handlePlaceOrder}
            disabled={cartItems.length === 0}
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
          </button>

          <div className="mt-4 text-center text-sm text-gray-500">
            <span>Bạn sẽ được chuyển đến cổng thanh toán an toàn</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
