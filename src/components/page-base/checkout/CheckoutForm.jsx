import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import useCartStore from "../../../store/useCartStore";
import OrderSummary from "./OrderSummary";
import PaymentQRCode from "./PaymentQRCode";
import PaymentInformation from "./PaymentInformation";
import { FaShoppingCart, FaLock, FaQrcode } from "react-icons/fa";
import orderApis from "../../../api/orderApi";

const CheckoutForm = ({
  orderId,
  cartItems: initialCartItems,
  shippingCost,
  onSuccess,
  defaultPaymentMethod,
  hidePaymentMethods,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { initializeCart } = useCartStore();
  const userData = localStorage.getItem("user");
  const [orderTotal, setOrderTotal] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [paymentQRUrl, setPaymentQRUrl] = useState("");
  const [paymentId, setPaymentId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(
    defaultPaymentMethod || "payos"
  );

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
      navigate("/cart");
      return;
    }

    if (status === "success") {
      toast.success("Payment successful!");
      if (onSuccess) onSuccess();
      initializeCart();
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }, [searchParams, navigate, onSuccess, initializeCart]);

  useEffect(() => {
    const newTotal = cartItems.reduce(
      (total, item) => total + item.totalPrice * item.quantity,
      0
    );
    setOrderTotal(newTotal);
  }, [cartItems]);

  const createPayment = async () => {
    setIsLoading(true);
    try {
      if (!orderId) {
        toast.error("Order ID is missing!");
        return null;
      }

      const paymentResponse = await orderApis.createPayment({
        orderId,
        paymentMethod:
          paymentMethod === "payos"
            ? 1
            : paymentMethod === "creditCard"
            ? 2
            : 3,
      });

      if (paymentResponse.data && paymentResponse.data.paymentId) {
        setPaymentId(paymentResponse.data.paymentId);
        return paymentResponse.data.paymentId;
      } else {
        toast.error("Failed to create payment");
        return null;
      }
    } catch (error) {
      console.error("Payment creation error:", error);
      toast.error("An error occurred during payment creation!");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getPaymentUrl = async (paymentIdToUse) => {
    setIsLoading(true);
    try {
      let currentPaymentId = paymentIdToUse || paymentId;
      if (!currentPaymentId) {
        const newPaymentId = await createPayment();
        if (!newPaymentId) return;
        currentPaymentId = newPaymentId;
      }

      const redirectUrl = `${window.location.origin}/checkout/${orderId}?status=success`;

      const urlResponse = await orderApis.createPaymentUrl({
        paymentId: currentPaymentId,
        redirectUrl,
      });

      if (urlResponse?.data) {
        let paymentUrl;

        if (typeof urlResponse.data === "string") {
          paymentUrl = urlResponse.data;
        } else if (
          urlResponse.data?.data &&
          typeof urlResponse.data.data === "string"
        ) {
          paymentUrl = urlResponse.data.data;
        } else if (
          urlResponse.data?.url &&
          typeof urlResponse.data.url === "string"
        ) {
          paymentUrl = urlResponse.data.url;
        }

        if (paymentUrl) {
          console.log("Payment URL generated:", paymentUrl);
          setPaymentQRUrl(paymentUrl);
          setPaymentInitiated(true);
        } else {
          console.error("Invalid payment URL format:", urlResponse.data);
          toast.error("Invalid payment URL format received");
        }
      } else {
        toast.error("Cannot create payment URL");
      }
    } catch (error) {
      console.error("Payment URL error:", error);
      toast.error("An error occurred while generating payment QR code!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitiatePayment = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    if (paymentMethod === "shipCode") {
      // Handle COD payment - skip QR code
      toast.success("Your order has been placed successfully!");
      if (onSuccess) onSuccess();
      setTimeout(() => {
        navigate("/");
      }, 2000);
      return;
    }

    const paymentId = await createPayment();
    if (paymentId) {
      getPaymentUrl(paymentId);
    }
  };

  const handleRefreshQR = async () => {
    return getPaymentUrl();
  };

  const handleSelectPaymentMethod = (method) => {
    setPaymentMethod(method);
    // Reset payment state when changing payment method
    if (paymentInitiated) {
      setPaymentInitiated(false);
      setPaymentQRUrl("");
    }
  };

  return (
    <div className="space-y-8">
      {/* Payment info section */}
      {!hidePaymentMethods && (
        <PaymentInformation
          onSelectPaymentMethod={handleSelectPaymentMethod}
          selectedMethod={paymentMethod}
        />
      )}

      {/* Payos payment section */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="p-2 bg-indigo-100 rounded-full">
          <FaQrcode className="w-5 h-5 text-indigo-600" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-medium text-indigo-900">Payos Payment</h3>
          <p className="text-sm text-indigo-600/70 mt-0.5">
            Scan the QR code to complete payment securely and quickly through
            your banking app
          </p>
        </div>
      </div>

      {/* Order Summary */}
      <div>
        {!paymentInitiated ? (
          <button
            onClick={handleInitiatePayment}
            disabled={cartItems.length === 0 || isLoading}
            className={`mt-6 w-full py-3.5 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-300
              ${
                cartItems.length === 0 || isLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              }
            `}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <>
                <FaLock className="w-4 h-4" />
                <span>Generate Payment QR Code</span>
              </>
            )}
          </button>
        ) : (
          <PaymentQRCode
            qrCodeUrl={paymentQRUrl}
            onRefresh={handleRefreshQR}
            totalAmount={orderTotal + shippingCost}
          />
        )}

        <div className="mt-4 text-center text-sm text-gray-500">
          <span>Secure payment via Payos</span>
        </div>
      </div>
    </div>
  );
};

CheckoutForm.propTypes = {
  orderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  cartItems: PropTypes.array,
  shippingCost: PropTypes.number,
  onSuccess: PropTypes.func,
  defaultPaymentMethod: PropTypes.string,
  hidePaymentMethods: PropTypes.bool,
};

CheckoutForm.defaultProps = {
  cartItems: [],
  shippingCost: 0,
  defaultPaymentMethod: "payos",
  hidePaymentMethods: false,
};

export default CheckoutForm;
