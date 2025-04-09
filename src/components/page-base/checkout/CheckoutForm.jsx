import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CartItem from "../shoppingcart/CartItem";
import CartSummary from "../shoppingcart/CartSummary";
import ShippingInformation from "./ShippingInformation";
import PaymentInformation from "./PaymentInformation";
import OrderSummary from "./OrderSummary";
import orderApis from "../../../api/orderApi";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import useCartStore from "../../../store/useCartStore";
import { FaShoppingCart, FaLock, FaCreditCard, FaTruck } from "react-icons/fa";

const CheckoutForm = ({
  orderId,
  cartItems,
  onUpdateQuantity,
  onRemove,
  shippingCost,
}) => {
  const { initializeCart } = useCartStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userData = localStorage.getItem("user");
  
  const [orderTotal, setOrderTotal] = useState(0);
  
  useEffect(() => {
    // Kiểm tra status từ PayOS redirect
    const status = searchParams.get('status');
    const cancel = searchParams.get('cancel');
    
    if (cancel === 'true' || status === 'cancel') {
      toast.info("You have canceled the payment");
      navigate('/laptopshop');
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

  const validateOrder = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return false;
    }
    if (orderTotal <= 0) {
      toast.error("The order total is invalid!");
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
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98 },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-gray-60 to-gray-100 py-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">  
        <motion.div
          className="text-center mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { duration: 0.5 } }}
        >
          {/* <h1 className="text-4xl font-bold text-indigo-900 mb-4">Checkout</h1> */}
        </motion.div>

        <motion.div 
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-indigo-50 overflow-hidden"
          variants={sectionVariants}
        >
          <div className="grid grid-cols-1 lg:grid-cols-5">
            {/* Left Column - Cart Items */}
            <div className="p-8 lg:col-span-3 bg-white/95 border-r border-indigo-100 min-h-[calc(100vh-200px)]">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-indigo-900">Your Cart</h2>
                  <span className="text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                    {cartItems.length} items
                  </span>
                </div>
                
                {cartItems.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <FaShoppingCart className="w-16 h-16 mx-auto text-indigo-200 mb-4" />
                      <p className="text-indigo-600 text-lg">Your cart is empty</p>
                      <button 
                        onClick={() => navigate('/laptopshop')}
                        className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-auto pr-4 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-indigo-50">
                    <div className="space-y-6">
                      {cartItems.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="border-b border-indigo-100 last:border-0 pb-6 last:pb-0"
                        >
                          <CartItem
                            product={item}
                            onUpdateQuantity={onUpdateQuantity}
                            onRemove={onRemove}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-2 bg-indigo-50/50">
              <div className="p-8 sticky top-0">
                <h2 className="text-2xl font-bold text-indigo-900 mb-6">Order Summary</h2>

                <OrderSummary
                  totalPrice={orderTotal}
                  shippingCost={shippingCost}
                  grandTotal={orderTotal + shippingCost}
                />

                <motion.button
                  onClick={() => {
                    if (validateOrder()) {
                      handlePlaceOrder();
                    }
                  }}
                  disabled={cartItems.length === 0}
                  className={`w-full py-4 px-6 rounded-xl shadow-md flex items-center justify-center space-x-2 mt-8 ${
                    cartItems.length === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 transform transition-all duration-200"
                  } text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  variants={buttonVariants}
                  whileHover={cartItems.length > 0 ? "hover" : {}}
                  whileTap={cartItems.length > 0 ? "tap" : {}}
                >
                  <span>Place Order</span>
                  <FaLock className="w-4 h-4" />
                </motion.button>

                {/* Payment Methods */}
                <div className="mt-8 pt-6 border-t border-indigo-100">
                  <h3 className="text-sm font-medium text-indigo-900 mb-4">We Accept</h3>
                  <div className="flex items-center space-x-4">
                    <img src="/visa.png" alt="Visa" className="h-8 object-contain opacity-80 hover:opacity-100 transition-opacity" />
                    <img src="/mastercard.png" alt="Mastercard" className="h-8 object-contain opacity-80 hover:opacity-100 transition-opacity" />
                    <img src="/momo.png" alt="Momo" className="h-8 object-contain opacity-80 hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Secure Checkout Notice */}
                <div className="mt-6 flex items-center justify-center space-x-2 text-indigo-600 bg-indigo-50 p-3 rounded-lg">
                  <FaLock className="w-4 h-4" />
                  <span className="text-sm font-medium">Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CheckoutForm;
