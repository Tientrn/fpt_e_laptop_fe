import React, { useState, useEffect } from "react";
import CheckoutForm from "../../components/page-base/checkout/CheckoutForm";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const CheckoutPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedProducts = location.state?.products || []; // sản phẩm đã tick

  const [cartItems, setCartItems] = useState([]);
  const [shippingCost] = useState(5.0);

  useEffect(() => {
    // Load sản phẩm từ location.state
    setCartItems(selectedProducts);
  }, [selectedProducts]);

  const handleUpdateQuantity = (id, newQuantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === id
          ? { ...item, quantity: Math.max(newQuantity, 1) }
          : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== id));
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
            Quay lại giỏ hàng
          </button>
        </div>

        {/* Tiêu đề thanh toán */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Thanh toán</h1>
          <div className="w-16 h-1 bg-amber-600 mx-auto mt-2 rounded-full" />
          <p className="mt-2 text-sm text-gray-500">
            Vui lòng kiểm tra kỹ thông tin đơn hàng trước khi hoàn tất.
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
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
