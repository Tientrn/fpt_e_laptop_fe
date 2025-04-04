import React, { useState } from "react";
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
   const {
      initializeCart
    } = useCartStore();
  
    const userData = localStorage.getItem("user");
  const navigate = useNavigate();
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.totalPrice * item.quantity,
    0
  );
  const grandTotal = totalPrice + shippingCost;
  const [errors, setErrors] = useState([]);

  const validateForm = () => {
    const newErrors = [];
    if (cartItems.length === 0) newErrors.push("Your cart is empty.");
    // Có thể thêm các validation khác (shipping, payment) nếu cần
    return newErrors;
  };

  // const handlePlaceOrder = () => {
  //   const formErrors = validateForm();
  //   if (formErrors.length > 0) {
  //     setErrors(formErrors);
  //   } else {
  //     setErrors([]);
  //     console.log("Order placed successfully!");
  //     // Thêm logic thực tế để xử lý đặt hàng (API call, redirect, v.v.)
  //   }
  // };

  const handlePlaceOrder = () => {
      orderApis.createPayment({orderId, paymentMethod: 1}).then((data) => {
        orderApis.createPaymentUrl({paymentId: data.data.paymentId, redirectUrl: window.location}).then((data) => {
          initializeCart(userData.userId)
          window.open(data.data, "_blank");
          navigate("/laptopshop")
        })
      }).catch(() => {
        toast.error("Thanh toán lỗi");
      })
    }

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
            <motion.div
              className="bg-white rounded-2xl shadow-md p-6"
              variants={sectionVariants}
            >
              <h2 className="text-xl font-semibold text-black mb-4">
                Shipping Information
              </h2>
              <ShippingInformation />
            </motion.div>

            {/* Payment Information */}
            <motion.div
              className="bg-white rounded-2xl shadow-md p-6"
              variants={sectionVariants}
            >
              <h2 className="text-xl font-semibold text-black mb-4">
                Payment Information
              </h2>
              <PaymentInformation />
            </motion.div>
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
                totalPrice={totalPrice}
                shippingCost={shippingCost}
                grandTotal={grandTotal}
              />

              {/* Error Messages */}
              {errors.length > 0 && (
                <motion.div
                  className="bg-red-50 border border-red-200 rounded-md p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.3 } }}
                >
                  {errors.map((error, index) => (
                    <ErrorMessage key={index} message={error} />
                  ))}
                </motion.div>
              )}

              {/* Place Order Button */}
              <motion.button
                onClick={handlePlaceOrder}
                className="w-full py-3 px-4 bg-amber-600 text-white rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 
                           shadow-md"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
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
