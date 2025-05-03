import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaTrash,
  FaMinus,
  FaPlus,
  FaArrowLeft,
  FaShoppingBag,
} from "react-icons/fa";
import useCartStore from "../../store/useCartStore";
import { toast, ToastContainer } from "react-toastify";
import orderApis from "../../api/orderApi";

const CartPage = () => {
  const [quantityErrors, setQuantityErrors] = useState({});
  const { getCurrentCart, removeFromCart, addToCart, decreaseQuantity } =
    useCartStore();

  const items = getCurrentCart();
  const userData = localStorage.getItem("user");

  const [selectedItems, setSelectedItems] = useState(
    items.map((item) => item.productId)
  );

  // Ensure selectedItems always match with cart changes
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
        [item.productId]: "Out of stock",
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
    const item = items.find((item) => item.productId === productId);
    toast.info(
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Confirm Delete
          </h2>
          <p className="text-gray-600 mb-8">
            Are you sure you want to delete item{" "}
            <span className="font-medium text-gray-800">
              {item.productName}
            </span>
            ?
            <br />
            <span className="text-sm">This action cannot be undone.</span>
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => toast.dismiss()}
            className="min-w-[120px] px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              removeFromCart(productId);
              setSelectedItems((prev) => prev.filter((id) => id !== productId));
              toast.dismiss();
              toast.success("Item deleted successfully");
            }}
            className="min-w-[120px] px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-md transition duration-200 font-medium"
          >
            Delete
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
        className: "bg-white rounded-lg shadow-xl",
        progressClassName: "hidden",
        style: {
          background: "white",
          minWidth: "400px",
          maxWidth: "450px",
          padding: 0,
          margin: "0 auto",
        },
      }
    );
  };

  const handleCheckout = () => {
    const selectedCartItems = items.filter((item) =>
      selectedItems.includes(item.productId)
    );

    if (selectedCartItems.length === 0) {
      toast.warning("Please select at least one item to checkout");
      return;
    }

    // Check if there's an existing pending order
    const pendingOrderData = localStorage.getItem("pending_order");
    let shouldCreateNewOrder = true;

    if (pendingOrderData) {
      try {
        const pendingOrder = JSON.parse(pendingOrderData);
        const creationTime = new Date(pendingOrder.createdAt);
        const now = new Date();
        const hoursSinceCreation = (now - creationTime) / (1000 * 60 * 60);

        // Always create a new order if the cart has changed
        // We just need to clean up old orders if they're expired (older than 2 hours)
        if (hoursSinceCreation >= 2) {
          localStorage.removeItem("pending_order");
        }
      } catch (error) {
        // If there's an error parsing the pending order, clear it
        localStorage.removeItem("pending_order");
      }
    }

    // Always create a new order regardless of pending orders (user wants each cart change to create a new order)
    const sum = selectedCartItems.reduce(
      (acc, curr) => acc + curr.totalPrice,
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
        // Save this order as pending
        localStorage.setItem(
          "pending_order",
          JSON.stringify({
            orderId: data.data.orderId,
            createdAt: new Date().toISOString(),
            totalPrice: sum,
            cartHash: JSON.stringify(
              selectedCartItems.map((item) => ({
                id: item.productId,
                quantity: item.quantity,
              }))
            ),
          })
        );

        selectedCartItems.forEach((item) => {
          orderDetail.push({
            orderId: data.data.orderId,
            productId: item.productId,
            quantity: item.quantity,
            priceItem: item.totalPrice,
          });
        });

        return orderApis.createOrderDetail(orderDetail);
      })
      .then(() => {
        toast.success("Successfully created order!", {
          position: "top-right",
          autoClose: 1500,
        });

        // Store the selected products for the checkout page
        localStorage.setItem(
          "checkout_products",
          JSON.stringify(selectedCartItems)
        );

        // Store selected item IDs in local storage to be removed after successful payment
        localStorage.setItem(
          "pending_cart_removal",
          JSON.stringify(selectedItems)
        );

        window.location.href = `/checkout/${orderDetail[0].orderId}`;
      })
      .catch((err) => {
        console.error(err);
        toast.error("Create order error", {
          position: "top-right",
          autoClose: 1500,
        });
      });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-bold text-indigo-900 tracking-tight">
              Your Shopping Cart
            </h1>
            <Link
              to="/laptopshop"
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors duration-200 px-4 py-2 rounded-full hover:bg-indigo-50"
            >
              <FaArrowLeft className="text-sm" /> Continue Shopping
            </Link>
          </div>

          <div className="flex items-center justify-center py-20">
            <div className="text-center px-12 py-16 max-w-md mx-auto bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="text-indigo-400 mb-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-28 w-28 mx-auto opacity-90"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-indigo-900 mb-4">
                Your Cart is Empty
              </h2>
              <p className="text-gray-500 mb-10 max-w-xs mx-auto">
                Looks like you haven&apos;t added any laptops to your cart yet.
              </p>
              <Link
                to="/laptopshop"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-base font-medium rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <FaArrowLeft className="text-xs" /> Browse Laptops
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Progress tracker */}
        <div className="mb-12">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-indigo-900 tracking-tight mb-1">
                Your Shopping Cart
              </h1>
              <p className="text-gray-500 text-sm">
                {items.length} {items.length === 1 ? "item" : "items"} in your
                cart
              </p>
            </div>

            <div className="hidden sm:flex items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-medium">
                  1
                </div>
                <div className="text-sm font-medium ml-2">Cart</div>
              </div>
              <div className="w-16 h-0.5 bg-gray-300 mx-2"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-medium">
                  2
                </div>
                <div className="text-sm text-gray-500 ml-2">Checkout</div>
              </div>
              <div className="w-16 h-0.5 bg-gray-300 mx-2"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-medium">
                  3
                </div>
                <div className="text-sm text-gray-500 ml-2">Complete</div>
              </div>
            </div>

            <Link
              to="/laptopshop"
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors duration-200 px-4 py-2 rounded-full hover:bg-indigo-50"
            >
              <FaArrowLeft className="text-sm" /> Continue Shopping
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-5">
            {items.map((item) => (
              <div
                key={item.productId}
                className="bg-white border border-gray-100 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 hover:border-indigo-200 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.productId)}
                    onChange={() => handleToggleSelect(item.productId)}
                    className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                  />
                  <div className="relative h-24 w-24 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden shadow-sm group">
                    <img
                      src={item.imageProduct}
                      alt={item.productName}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                    <h3 className="text-indigo-900 font-medium text-lg truncate pr-4">
                      {item.productName}
                    </h3>
                    <span className="font-semibold text-indigo-900 whitespace-nowrap">
                      {formatPrice(item.totalPrice)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
                    <span className="py-1 px-3 bg-indigo-50 rounded-full text-center">
                      CPU: {item.cpu}
                    </span>
                    <span className="py-1 px-3 bg-indigo-50 rounded-full text-center">
                      RAM: {item.ram}
                    </span>
                    <span className="py-1 px-3 bg-indigo-50 rounded-full text-center">
                      Storage: {item.storage}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleDecreaseQuantity(item)}
                        disabled={item.quantity <= 1}
                        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaMinus className="w-2.5 h-2.5" />
                      </button>
                      <span className="w-12 text-center text-gray-800 font-medium py-1.5">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleIncreaseQuantity(item)}
                        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                      >
                        <FaPlus className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.productId)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                      aria-label="Remove item"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>

                  {quantityErrors[item.productId] && (
                    <p className="text-xs text-red-600 mt-2">
                      {quantityErrors[item.productId]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-8 sticky top-4 shadow-sm hover:shadow-md transition-all duration-300">
              <h2 className="text-xl font-semibold text-indigo-900 mb-6 pb-4 border-b border-gray-100">
                Order Summary
              </h2>

              {/* Products list */}
              <div className="space-y-3 mb-6 max-h-60 overflow-auto pr-2 custom-scrollbar">
                {items
                  .filter((item) => selectedItems.includes(item.productId))
                  .map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between items-center py-2 border-b border-gray-50 text-sm"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-700 font-medium truncate">
                          {item.productName}
                        </p>
                        <p className="text-gray-500">
                          <span className="text-xs">×</span>
                          {item.quantity}
                        </p>
                      </div>
                      <span className="text-indigo-900 font-semibold ml-4">
                        {formatPrice(item.totalPrice)}
                      </span>
                    </div>
                  ))}
              </div>

              {/* Summary calculation */}
              <div className="space-y-3 py-4 border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Total Items</span>
                  <span className="font-medium">
                    {items
                      .filter((item) => selectedItems.includes(item.productId))
                      .reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                </div>

                <div className="flex justify-between font-semibold text-lg text-indigo-900 pt-2">
                  <span>Total Amount</span>
                  <span>
                    {formatPrice(
                      items
                        .filter((item) =>
                          selectedItems.includes(item.productId)
                        )
                        .reduce((acc, item) => acc + item.totalPrice, 0)
                    )}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
                className={`w-full py-4 mt-6 rounded-lg font-semibold text-white shadow-md transition-all duration-300 flex items-center justify-center gap-2
                  ${
                    selectedItems.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg transform hover:-translate-y-1"
                  }`}
              >
                <FaShoppingBag className="text-sm" /> Proceed to Checkout
              </button>

              {selectedItems.length === 0 && (
                <p className="text-xs text-center text-gray-500 mt-2">
                  Please select at least one item to checkout
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default CartPage;
