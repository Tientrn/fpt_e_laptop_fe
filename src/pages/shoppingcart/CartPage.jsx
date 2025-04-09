import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus, FaArrowLeft } from "react-icons/fa";
import useCartStore from "../../store/useCartStore";
import { toast } from "react-toastify";
import orderApis from "../../api/orderApi";

const CartPage = () => {
  const [quantityErrors, setQuantityErrors] = useState({});
  const navigate = useNavigate();
  const {
    getCurrentCart,
    removeFromCart,
    addToCart,
    decreaseQuantity,
    getTotalPrice,
  } = useCartStore();

  const items = getCurrentCart();
  const userData = localStorage.getItem("user");

  const [selectedItems, setSelectedItems] = useState(
    items.map((item) => item.productId)
  );

  // Đảm bảo selectedItems luôn khớp với giỏ hàng khi thay đổi
  useEffect(() => {
    setSelectedItems((prevSelected) =>
      items
        .filter((item) => prevSelected.includes(item.productId))
        .map((item) => item.productId)
    );
  }, [items]);

  const handleToggleSelect = (productId) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const handleDecreaseQuantity = (item) => {
    decreaseQuantity(item.productId);
    setQuantityErrors((prev) => ({ ...prev, [item.productId]: null }));
  };

  const handleIncreaseQuantity = (item) => {
    if (item.quantity < item.quantityAvailable) {
      addToCart(item);
      setQuantityErrors((prev) => ({ ...prev, [item.productId]: null }));
    } else {
      setQuantityErrors((prev) => ({
        ...prev,
        [item.productId]: "Vượt quá số lượng tồn kho",
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
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"
    );
    if (confirmDelete) {
      removeFromCart(productId);
      setSelectedItems((prev) => prev.filter((id) => id !== productId));
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    }
  };

  const handleCheckout = () => {
    const selectedCartItems = items.filter((item) =>
      selectedItems.includes(item.productId)
    );

    if (selectedCartItems.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
      return;
    }

    const sum = selectedCartItems.reduce(
      (acc, curr) => acc + curr.quantity * curr.totalPrice,
      0
    );

    const user = JSON.parse(userData);
    const order = {
      userId: user?.userId ?? 1,
      totalPrice: sum,
      field: "string",
      orderAddress: "string",
      status: "Active",
    };

    let orderDetail = [];

    orderApis
      .createOrder(order)
      .then((data) => {
        selectedCartItems.forEach((item) => {
          orderDetail.push({
            orderId: data.data.orderId,
            productId: item.productId,
            quantity: item.quantity,
            priceItem: item.totalPrice,
          });
          removeFromCart(item.productId);
        });

        orderApis.createOrderDetail([...orderDetail]);

        toast.success("Tạo đơn hàng thành công!", {
          position: "top-right",
          autoClose: 1500,
        });

        navigate(`/checkout/${data.data.orderId}`, {
          state: { products: selectedCartItems },
        });
      })
      .catch((err) =>
        toast.error("Tạo đơn hàng lỗi", {
          position: "top-right",
          autoClose: 1500,
        })
      );
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-6">
          <h2 className="text-2xl font-semibold text-black mb-4">
            Giỏ hàng của bạn trống
          </h2>
          <button
            onClick={() => navigate("/laptopshop")}
            className="flex items-center gap-2 mx-auto text-black hover:text-amber-600 transition-colors duration-200"
          >
            <FaArrowLeft /> Tiếp tục mua sắm
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
            <FaArrowLeft /> Tiếp tục mua sắm
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
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.productId)}
                  onChange={() => handleToggleSelect(item.productId)}
                  className="w-4 h-4 text-amber-600 accent-amber-600"
                />
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
                Tổng quan đơn hàng
              </h2>

              <div className="space-y-3 mb-4">
                {items
                  .filter((item) => selectedItems.includes(item.productId))
                  .map((item) => (
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

              <div className="border-t border-gray-200 my-4 mb-4"></div>

              <div className="flex justify-between">
                <span className="text-black font-medium">Tổng cộng</span>
                <span className="text-amber-600 font-semibold">
                  {formatPrice(
                    items
                      .filter((item) => selectedItems.includes(item.productId))
                      .reduce(
                        (acc, item) => acc + item.totalPrice * item.quantity,
                        0
                      )
                  )}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-slate-600 text-white py-3 rounded mt-6 hover:bg-slate-700 transition-colors duration-200"
              >
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
