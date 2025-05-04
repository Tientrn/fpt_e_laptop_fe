import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaChevronDown,
  FaChevronUp,
  FaFilter,
} from "react-icons/fa";
import orderApis from "../../../api/orderApi";
import productApi from "../../../api/productApi";
import shopApi from "../../../api/shopApi";
import { format } from "date-fns";

const ShopOrders = () => {
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [productDetailsMap, setProductDetailsMap] = useState({});
  const [productIdsOfThisShop, setProductIdsOfThisShop] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const rawUser = JSON.parse(localStorage.getItem("user"));
  const userId = Number(rawUser?.userId);

  useEffect(() => {
    const fetchOrdersForShop = async () => {
      try {
        setLoading(true);

        const shopRes = await shopApi.getAllShops();
        const shops = shopRes.data || [];
        const currentShop = shops.find(
          (shop) =>
            Number(shop.userId) === userId &&
            shop.status?.toLowerCase() === "active"
        );

        if (!currentShop) {
          setOrders([]);
          return;
        }

        const shopId = currentShop.shopId;
        const detailRes = await orderApis.getAllOrderDetail();
        const allOrderDetails = detailRes.data || [];

        const productIds = [
          ...new Set(allOrderDetails.map((d) => d.productId)),
        ];

        const productsWithShop = await Promise.all(
          productIds.map(async (id) => {
            try {
              const res = await productApi.getProductById(id);
              const product = res.data?.data || res.data;
              return product;
            } catch (error) {
              return null;
            }
          })
        );

        const productMap = {};
        const productIdSet = new Set();

        productsWithShop.forEach((product) => {
          if (product && product.shopId === shopId) {
            productMap[product.productId] = product;
            productIdSet.add(product.productId);
          }
        });

        const orderIds = new Set(
          allOrderDetails
            .filter((od) => productIdSet.has(od.productId))
            .map((od) => od.orderId)
        );

        const orderRes = await orderApis.getAllOrders();
        const allOrders = orderRes.data || [];
        const filteredOrders = allOrders.filter((order) =>
          orderIds.has(order.orderId)
        );

        setProductDetailsMap(productMap);
        setProductIdsOfThisShop(productIdSet);
        setOrderDetails(allOrderDetails);
        setOrders(filteredOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchOrdersForShop();
    }
  }, [userId]);

  const toggleOrderDetail = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const getStatusIcon = (status) => {
    const lower = status.toLowerCase();
    if (lower.includes("success"))
      return <FaCheckCircle className="text-green-600" />;
    if (lower.includes("cancelled"))
      return <FaTimesCircle className="text-red-600" />;
    return null;
  };

  const getStatusColor = (status) => {
    const lower = status.toLowerCase();
    if (lower.includes("success"))
      return "bg-green-50 text-green-700 border border-green-200";
    if (lower.includes("cancelled"))
      return "bg-red-50 text-red-700 border border-red-200";
    return "bg-gray-50 text-gray-700 border border-gray-200";
  };

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.status.toLowerCase() === filterStatus);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
          <p className="text-gray-600 mt-1">
            Manage and track your shop orders
          </p>
        </div>
        <div className="relative w-full md:w-auto">
          <select
            className="w-full md:w-48 appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Orders</option>
            <option value="success">Success</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500 text-lg">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Order Record
                      </h2>
                      <span
                        className={`text-sm font-medium capitalize px-3 py-1 rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <span className="font-medium">Date:</span>
                          {format(
                            new Date(order.createdDate),
                            "dd/MM/yyyy HH:mm"
                          )}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <span className="font-medium">Address:</span>
                          {order.orderAddress}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          Total Amount:{" "}
                          <span className="font-medium text-gray-900">
                            {formatCurrency(order.totalPrice)}
                          </span>
                        </p>
                        {(() => {
                          const productsInOrder = orderDetails.filter(
                            (od) =>
                              od.orderId === order.orderId &&
                              productIdsOfThisShop.has(od.productId)
                          );
                          const totalQuantity = productsInOrder.reduce(
                            (sum, od) => sum + od.quantity,
                            0
                          );
                          return (
                            <p className="text-sm text-gray-600">
                              Total Items:{" "}
                              <span className="font-medium text-gray-900">
                                {totalQuantity}
                              </span>
                            </p>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <button
                      onClick={() => toggleOrderDetail(order.orderId)}
                      className="text-amber-600 hover:text-amber-700 flex items-center gap-2 text-sm font-medium transition-colors bg-amber-50 px-4 py-2 rounded-lg hover:bg-amber-100"
                    >
                      {expandedOrderId === order.orderId ? (
                        <>
                          <FaChevronUp /> Hide Details
                        </>
                      ) : (
                        <>
                          <FaChevronDown /> View Details
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {expandedOrderId === order.orderId && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div
                        className={`p-4 rounded-lg ${getStatusColor(
                          order.status
                        )}`}
                      >
                        <p className="text-sm text-gray-600">Status</p>
                        <p className="font-medium">{order.status}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-medium text-gray-900">
                          {order.orderAddress}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="font-medium text-gray-900">
                          {formatCurrency(order.totalPrice)}
                        </p>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Products in this order
                    </h3>
                    <div className="space-y-4">
                      {orderDetails
                        .filter(
                          (od) =>
                            od.orderId === order.orderId &&
                            productIdsOfThisShop.has(od.productId)
                        )
                        .map((od) => {
                          const product = productDetailsMap[od.productId];
                          return (
                            <div
                              key={od.orderItemId || od.productId}
                              className="flex gap-6 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <img
                                src={product?.imageProduct}
                                alt={product?.productName}
                                className="w-32 h-32 object-cover rounded-lg shadow-sm"
                              />
                              <div className="flex-1 space-y-2">
                                <h4 className="text-lg font-semibold text-gray-900">
                                  {product?.productName || "(No name)"}
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                  <p>CPU: {product?.cpu}</p>
                                  <p>RAM: {product?.ram}</p>
                                  <p>Storage: {product?.storage}</p>
                                  <p>Quantity: {od.quantity}</p>
                                </div>
                                <p className="text-amber-600 font-semibold">
                                  Price: {formatCurrency(od.priceItem)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopOrders;
