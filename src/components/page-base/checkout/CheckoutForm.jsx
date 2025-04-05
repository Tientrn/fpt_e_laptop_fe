import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CartItem from "../shoppingcart/CartItem";
import CartSummary from "../shoppingcart/CartSummary";
import ShippingInformation from "./ShippingInformation";
import PaymentInformation from "./PaymentInformation";
import OrderSummary from "./OrderSummary";
import ErrorMessage from "./ErrorMessage";
import orderApis from "../../../api/orderApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useCartStore from "../../../store/useCartStore";

const CheckoutForm = ({
  orderId,
  cartItems,
  onUpdateQuantity,
  onRemove,
  shippingCost,
}) => {
  const { initializeCart } = useCartStore();
  const navigate = useNavigate();
  const userData = localStorage.getItem("user");
  
  const [orderTotal, setOrderTotal] = useState(0);
  
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
        amount: currentTotal
      });

      if (paymentResponse.data) {
        const urlResponse = await orderApis.createPaymentUrl({
          paymentId: paymentResponse.data.paymentId,
          redirectUrl: window.location,
          amount: currentTotal
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
      console.error("Payment error:", error);
      toast.error("Có lỗi xảy ra trong quá trình thanh toán!");
    }
  };

  const validateOrder = () => {
    if (cartItems.length === 0) {
      toast.error("Giỏ hàng của bạn đang trống!");
      return false;
    }
    if (orderTotal <= 0) {
      toast.error("Tổng giá trị đơn hàng không hợp lệ!");
      return false;
    }
    return true;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.2 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          className="text-3xl font-bold text-black text-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { duration: 0.5 } }}
        >
          Checkout
        </motion.h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Forms */}
          <div className="flex-grow space-y-6">
            {/* Cart Items */}
            <motion.div
              className="bg-white rounded-2xl shadow-md p-6"
              variants={sectionVariants}
            >
              <h2 className="text-xl font-semibold text-black mb-4">
                Your Cart
              </h2>
              {cartItems.length === 0 ? (
                <p className="text-slate-600 text-center">
                  Your cart is empty.
                </p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        transition: { duration: 0.3 },
                      }}
                      exit={{
                        opacity: 0,
                        x: 20,
                        transition: { duration: 0.3 },
                      }}
                    >
                      <CartItem
                        product={item}
                        onUpdateQuantity={onUpdateQuantity}
                        onRemove={onRemove}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Shipping Information */}
            {/* <motion.div
              className="bg-white rounded-2xl shadow-md p-6"
              variants={sectionVariants}
            >
              <h2 className="text-xl font-semibold text-black mb-4">
                Shipping Information
              </h2>
              <ShippingInformation />
            </motion.div> */}

            {/* Payment Information */}
            {/* <motion.div
              className="bg-white rounded-2xl shadow-md p-6"
              variants={sectionVariants}
            >
              <h2 className="text-xl font-semibold text-black mb-4">
                Payment Information
              </h2>
              <PaymentInformation />
            </motion.div> */}
          </div>

          {/* Right Column - Order Summary */}
          <motion.div
            className="w-full lg:w-96"
            initial={{ opacity: 0, x: 50 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: { duration: 0.5, delay: 0.3 },
            }}
          >
            <div className="bg-white rounded-2xl shadow-md sticky top-6 p-6 space-y-6">
              <h2 className="text-xl font-semibold text-black">
                Order Summary
              </h2>

              <OrderSummary
                totalPrice={orderTotal}
                shippingCost={shippingCost}
                grandTotal={orderTotal + shippingCost}
              />

              {/* Error Messages */}
              {/* {errors.length > 0 && (
                <motion.div
                  className="bg-red-50 border border-red-200 rounded-md p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.3 } }}
                >
                  {errors.map((error, index) => (
                    <ErrorMessage key={index} message={error} />
                  ))}
                </motion.div>
              )} */}

              {/* Place Order Button */}
              <motion.button
                onClick={() => {
                  if (validateOrder()) {
                    handlePlaceOrder();
                  }
                }}
                disabled={cartItems.length === 0}
                className={`w-full py-3 px-4 rounded-md shadow-md ${
                  cartItems.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-amber-600 hover:bg-amber-700"
                } text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2`}
                variants={buttonVariants}
                whileHover={cartItems.length > 0 ? "hover" : {}}
                whileTap={cartItems.length > 0 ? "tap" : {}}
              >
                Place Order
              </motion.button>

              {/* Secure Checkout Notice */}
              <div className="flex items-center justify-center space-x-2 text-amber-600">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span className="text-sm">Secure Checkout</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutForm;
