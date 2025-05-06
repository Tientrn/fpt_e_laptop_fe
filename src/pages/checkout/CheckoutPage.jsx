import React, { useState, useEffect } from "react";
import CheckoutForm from "../../components/page-base/checkout/CheckoutForm";
import {
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaShoppingBag,
  FaLock,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import useCartStore from "../../store/useCartStore";
import orderApis from "../../api/orderApi";
import productApi from "../../api/productApi";

const CheckoutPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const selectedProducts = location.state?.products;
  const { removeFromCart, getCurrentCart } = useCartStore();

  const [cartItems, setCartItems] = useState([]);
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const [orderExpired, setOrderExpired] = useState(false);
  const [cartChanged, setCartChanged] = useState(false);
  const [paymentSuccessItems, setPaymentSuccessItems] = useState([]);

  // Helper: sync localStorage
  const syncLocalStorage = (items) => {
    localStorage.setItem("checkout_products", JSON.stringify(items));
  };

  const handleClearCheckoutData = () => {
    localStorage.removeItem("checkout_products");
  };

  // Check for payment status
  useEffect(() => {
    const status = searchParams.get("status");
    const orderCode = searchParams.get("orderCode");

    // Handle cancellation
    if (status === "CANCELLED" && orderCode) {
      (async () => {
        try {
          const transactionCode = orderCode;
          await orderApis.updatePayment(transactionCode, {
            status: "CANCELLED",
          });
          localStorage.removeItem("pending_order");
          setTimeout(() => {
            navigate("/cart");
          }, 2000);
        } catch (error) {
          console.error("Error handling payment cancellation:", error);
        }
      })();
    }

    // Handle success
    if (status === "PAID" && orderCode && !paymentProcessed) {
      (async () => {
        try {
          // Store cart items before clearing
          const storedItems = JSON.parse(
            localStorage.getItem("checkout_products") || "[]"
          );
          setPaymentSuccessItems(storedItems);

          console.log("Starting payment success process...");
          console.log("Cart Items:", storedItems);

          // Update product quantities
          const updatePromises = storedItems.map(async (item) => {
            try {
              console.log(`Processing product ${item.productId}:`, item);

              // Get current product data first
              const productResponse = await productApi.getProductById(
                item.productId
              );
              console.log(
                `Product ${item.productId} current data:`,
                productResponse.data
              );

              if (!productResponse.isSuccess) {
                throw new Error(`Failed to get product ${item.productId}`);
              }

              const currentProduct = productResponse.data;
              const updatedQuantity = currentProduct.quantity - item.quantity;
              console.log(`Product ${item.productId} quantity update:`, {
                currentQuantity: currentProduct.quantity,
                orderedQuantity: item.quantity,
                newQuantity: updatedQuantity,
              });

              const updateData = {
                ProductId: currentProduct.productId,
                ProductName: currentProduct.productName,
                Quantity: updatedQuantity,
                Price: currentProduct.price,
                ScreenSize: currentProduct.screenSize,
                Storage: currentProduct.storage,
                Ram: currentProduct.ram,
                Cpu: currentProduct.cpu,
                Model: currentProduct.model,
                Color: currentProduct.color,
                GraphicsCard: currentProduct.graphicsCard,
                Battery: currentProduct.battery,
                Ports: currentProduct.ports,
                ProductionYear: currentProduct.productionYear,
                OperatingSystem: currentProduct.operatingSystem,
                Description: currentProduct.description,
                CategoryId: currentProduct.categoryId,
                ShopId: currentProduct.shopId,
                ImageProduct: currentProduct.imageProduct,
              };

              // Log the current product data to verify all required fields
              console.log("Current product data:", currentProduct);

              console.log(
                `Sending update request for product ${item.productId}:`,
                updateData
              );

              const updateResponse = await productApi.updateProduct(
                item.productId,
                updateData
              );
              console.log(
                `Update response for product ${item.productId}:`,
                updateResponse
              );

              if (!updateResponse.isSuccess) {
                throw new Error(`Failed to update product ${item.productId}`);
              }
            } catch (error) {
              console.error(`Error updating product ${item.productId}:`, error);
            }
          });

          console.log("Waiting for all product updates to complete...");
          await Promise.all(updatePromises);
          console.log("All product updates completed");

          toast.success("Payment successful! Your order is being processed.");
          handleClearCheckoutData();
          const pendingRemovalItems = JSON.parse(
            localStorage.getItem("pending_cart_removal") || "[]"
          );
          if (pendingRemovalItems.length > 0) {
            pendingRemovalItems.forEach((productId) => {
              removeFromCart(productId);
            });
            localStorage.removeItem("pending_cart_removal");
            localStorage.removeItem("pending_order");
          }
          setPaymentProcessed(true);
          setTimeout(() => {
            navigate("/");
          }, 3000);
        } catch (error) {
          console.error("Error handling payment success:", error);
        }
      })();
    }
  }, [searchParams, paymentProcessed, navigate, removeFromCart, cartItems]);

  // Check if order is expired (older than 2 hours) or cart state has changed
  useEffect(() => {
    const pendingOrderData = localStorage.getItem("pending_order");
    if (pendingOrderData) {
      try {
        const pendingOrder = JSON.parse(pendingOrderData);

        // Only process if this is the same order we're viewing
        if (pendingOrder.orderId.toString() === orderId) {
          const creationTime = new Date(pendingOrder.createdAt);
          const now = new Date();
          const hoursSinceCreation = (now - creationTime) / (1000 * 60 * 60);

          // If order is older than 2 hours, mark as expired
          if (hoursSinceCreation >= 2) {
            setOrderExpired(true);
          }

          // Check if cart state has changed since order creation
          if (pendingOrder.cartHash) {
            const currentCart = getCurrentCart();
            const currentCartHash = JSON.stringify(
              currentCart
                .filter((item) => item.productId)
                .map((item) => ({
                  id: item.productId,
                  quantity: item.quantity,
                }))
                .sort((a, b) => a.id - b.id)
            );

            const savedCartItems = JSON.parse(pendingOrder.cartHash);
            const normalizedSavedHash = JSON.stringify(
              savedCartItems.sort((a, b) => a.id - b.id)
            );

            if (currentCartHash !== normalizedSavedHash) {
              setCartChanged(true);
            }
          }
        }
      } catch (error) {
        console.error("Error checking order expiration:", error);
      }
    }
  }, [orderId, getCurrentCart]);

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

  const handleBackToCart = async () => {
    try {
      const paymentsResponse = await orderApis.getAllPayments();

      if (paymentsResponse?.data?.data) {
        const payment = paymentsResponse.data.data.find(
          (payment) => payment.orderId.toString() === orderId
        );

        if (payment && payment.transactionCode) {
          await orderApis.updatePayment(payment.transactionCode, {
            status: "CANCELLED",
          });
        }
      }
    } catch (error) {
      console.error("Error cancelling payment:", error);
    } finally {
      if (orderExpired) {
        localStorage.removeItem("pending_order");
      }
      navigate("/cart");
    }
  };

  const handleCreateNewOrder = () => {
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Progress tracker */}
        <div className="mb-12">
          <div className="flex justify-between items-center">
            <button
              onClick={handleBackToCart}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
            >
              <FaArrowLeft className="text-sm" />
              <span>Back to Cart</span>
            </button>

            <div className="hidden sm:flex items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-medium">
                  1
                </div>
                <div className="text-sm font-medium ml-2">Cart</div>
              </div>
              <div className="w-16 h-0.5 bg-indigo-600 mx-2"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-medium">
                  2
                </div>
                <div className="text-sm font-medium ml-2">Checkout</div>
              </div>
              <div className="w-16 h-0.5 bg-gray-300 mx-2"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-medium">
                  3
                </div>
                <div className="text-sm text-gray-500 ml-2">Complete</div>
              </div>
            </div>
          </div>
        </div>

        {/* Expired Order Banner */}
        {orderExpired && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <div className="text-red-500">
              <FaExclamationTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-medium text-red-800">Order Expired</h3>
              <p className="text-sm text-red-600">
                This order has expired. Please return to cart and create a new
                order.
              </p>
            </div>
            <button
              onClick={handleBackToCart}
              className="ml-auto bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Return to Cart
            </button>
          </div>
        )}

        {/* Cart Changed Banner */}
        {cartChanged && !orderExpired && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
            <div className="text-blue-500">
              <FaInfoCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-medium text-blue-800">Cart Has Changed</h3>
              <p className="text-sm text-blue-600">
                Your cart has changed since this order was created. You may want
                to create a new order with your current cart.
              </p>
            </div>
            <button
              onClick={handleCreateNewOrder}
              className="ml-auto bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Create New Order
            </button>
          </div>
        )}

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
                {!orderExpired ? (
                  <CheckoutForm
                    orderId={orderId}
                    cartItems={cartItems}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                    onSuccess={handleClearCheckoutData}
                    defaultPaymentMethod="payos"
                    hidePaymentMethods={true}
                  />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      This order has expired. Please create a new order.
                    </p>
                    <button
                      onClick={handleBackToCart}
                      className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Return to Cart
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Your Order
              </h2>

              <div className="divide-y divide-gray-200 max-h-96 overflow-auto pr-2 custom-scrollbar mb-4">
                {cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="py-3 flex items-start gap-3"
                  >
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-md border overflow-hidden">
                      <img
                        src={item.imageProduct}
                        alt={item.productName}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.productName}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Quantity: {item.quantity}
                      </p>
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
                    {cartItems.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-medium pt-2 border-t border-gray-200 mt-2">
                  <span className="text-gray-900">Total</span>
                  <span className="text-indigo-600">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(
                      cartItems.reduce(
                        (total, item) =>
                          total + item.totalPrice * item.quantity,
                        0
                      )
                    )}
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
                  <span>
                    Your order will be processed immediately after payment
                  </span>
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
