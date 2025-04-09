import React, { useState, useEffect } from "react";
import CheckoutForm from "../../components/page-base/checkout/CheckoutForm";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const CheckoutPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedProducts = location.state?.products;

  const [cartItems, setCartItems] = useState([]);
  const [shippingCost] = useState(5.0);

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
    <div className="min-h-screen bg-white text-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Nút quay lại */}
        <div>
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center text-slate-600 hover:text-amber-600 text-sm font-medium transition"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
<<<<<<< HEAD
            Quay lại giỏ hàng
=======
            Back to shop
>>>>>>> kiet
          </button>
        </div>

        {/* Tiêu đề thanh toán */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <div className="w-16 h-1 bg-amber-600 mx-auto mt-2 rounded-full" />
          <p className="mt-2 text-sm text-gray-500">
            Please check your order information before completing.
          </p>
        </div>

        {/* Form thanh toán */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <CheckoutForm
            orderId={orderId}
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemoveItem}
            shippingCost={shippingCost}
            onSuccess={handleClearCheckoutData} // ✅ chỉ xoá sau khi thanh toán thành công
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
