import React, { useState, useEffect } from "react";
import CheckoutForm from "../../components/page-base/checkout/CheckoutForm";
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft, FaShoppingBag, FaLock } from "react-icons/fa";
import useCartStore from "../../store/useCartStore";

const CheckoutPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const selectedProducts = location.state?.products;
  const { removeFromCart } = useCartStore();

  const [cartItems, setCartItems] = useState([]);
  const [shippingCost] = useState(5.0);
  const [paymentProcessed, setPaymentProcessed] = useState(false);

  // Helper: sync localStorage
  const syncLocalStorage = (items) => {
    localStorage.setItem("checkout_products", JSON.stringify(items));
  };

  useEffect(() => {
    if (selectedProducts?.length > 0) {
      setCartItems(selectedProducts);
      syncLocalStorage(selectedProducts);
    } else {
      const stored = localStorage.getItem("checkout_products");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCartItems(parsed);
        } catch {
          setCartItems([]);
        }
      }
    }
  }, [selectedProducts]);

  // Check for payment status from URL
  useEffect(() => {
    const status = searchParams.get("status");
    
    if (status === "success" && !paymentProcessed) {
      toast.success("Payment successful! Your order is being processed.");
      
      // Clear checkout data
      handleClearCheckoutData();
      
      // Remove items from the cart now that payment is successful
      const pendingRemovalItems = JSON.parse(localStorage.getItem("pending_cart_removal") || "[]");
      if (pendingRemovalItems.length > 0) {
        pendingRemovalItems.forEach(productId => {
          removeFromCart(productId);
        });
        // Clear the pending removal list
        localStorage.removeItem("pending_cart_removal");
        toast.info("Your cart has been updated");
      }
      
      setPaymentProcessed(true);
      
      // Redirect after a delay
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [searchParams, navigate, paymentProcessed, removeFromCart]);

  const handleUpdateQuantity = (id, newQuantity) => {
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.productId === id
          ? { ...item, quantity: Math.max(newQuantity, 1) }
          : item
      );
      syncLocalStorage(updated);
      return updated;
    });
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.productId !== id);
      syncLocalStorage(updated);
      return updated;
    });
  };

  const handleClearCheckoutData = () => {
    localStorage.removeItem("checkout_products");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Progress tracker */}
        <div className="mb-12">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate("/cart")}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
            >
              <FaArrowLeft className="text-sm" />
              <span>Back to Cart</span>
            </button>
            
            <div className="hidden sm:flex items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-medium">1</div>
                <div className="text-sm font-medium ml-2">Cart</div>
              </div>
              <div className="w-16 h-0.5 bg-indigo-600 mx-2"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-medium">2</div>
                <div className="text-sm font-medium ml-2">Checkout</div>
              </div>
              <div className="w-16 h-0.5 bg-gray-300 mx-2"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-medium">3</div>
                <div className="text-sm text-gray-500 ml-2">Complete</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main checkout container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout form container */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
                <p className="text-gray-500 text-sm mt-1">
                  Complete your order with Payos QR payment
                </p>
              </div>
              
              <div className="p-6">
                <CheckoutForm
                  orderId={orderId}
                  cartItems={cartItems}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                  shippingCost={shippingCost}
                  onSuccess={handleClearCheckoutData}
                  defaultPaymentMethod="payos"
                  hidePaymentMethods={true}
                />
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Order</h2>
              
              <div className="divide-y divide-gray-200 max-h-96 overflow-auto pr-2 custom-scrollbar mb-4">
                {cartItems.map((item) => (
                  <div key={item.productId} className="py-3 flex items-start gap-3">
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-md border overflow-hidden">
                      <img 
                        src={item.imageProduct} 
                        alt={item.productName}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{item.productName}</h3>
                      <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                      <p className="text-sm font-medium text-indigo-600 mt-1">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.totalPrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Items</span>
                  <span className="font-medium">
                    {cartItems.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(cartItems.reduce((total, item) => total + item.totalPrice * item.quantity, 0))}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping Fee</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-medium pt-2 border-t border-gray-200 mt-2">
                  <span className="text-gray-900">Total</span>
                  <span className="text-indigo-600">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(cartItems.reduce((total, item) => total + item.totalPrice * item.quantity, 0) + shippingCost)}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <FaLock className="text-gray-400" />
                  <span>Secure payment through Payos</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaShoppingBag className="text-gray-400" />
                  <span>Your order will be processed immediately after payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
