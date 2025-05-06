import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaFilter,
  FaSort,
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import orderApi from "../../api/orderApi";
import productApi from "../../api/productApi";
import shopApi from "../../api/shopApi";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [products, setProducts] = useState({});
  const [shops, setShops] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    fetchOrders();
    fetchOrderDetails();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderApi.getAllOrders();
      if (response.isSuccess && response.code === 200) {
        setOrders(response.data);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async () => {
    try {
      const response = await orderApi.getAllOrderDetail();
      if (response.isSuccess && response.code === 200) {
        setOrderDetails(response.data);
        // Fetch product details for each order detail
        response.data.forEach(async (detail) => {
          if (detail.productId) {
            try {
              const productResponse = await productApi.getProductById(
                detail.productId
              );
              if (productResponse.isSuccess && productResponse.code === 200) {
                const product = productResponse.data;
                setProducts((prev) => ({
                  ...prev,
                  [detail.productId]: product,
                }));

                // Fetch shop details if shopId exists
                if (product.shopId) {
                  try {
                    const shopResponse = await shopApi.getShopById(
                      product.shopId
                    );
                    if (shopResponse.isSuccess && shopResponse.code === 200) {
                      setShops((prev) => ({
                        ...prev,
                        [product.shopId]: shopResponse.data,
                      }));
                    }
                  } catch (error) {
                    console.error(
                      `Error fetching shop ${product.shopId}:`,
                      error
                    );
                  }
                }
              }
            } catch (error) {
              console.error(
                `Error fetching product ${detail.productId}:`,
                error
              );
            }
          }
        });
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const getOrderDetails = (orderId) => {
    return orderDetails.filter((detail) => detail.orderId === orderId);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId.toString().includes(searchTerm) ||
      order.orderAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdDate) - new Date(a.createdDate);
    } else if (sortBy === "oldest") {
      return new Date(a.createdDate) - new Date(b.createdDate);
    } else if (sortBy === "highest") {
      return b.totalPrice - a.totalPrice;
    } else if (sortBy === "lowest") {
      return a.totalPrice - b.totalPrice;
    }
    return 0;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "success":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
          icon: <FaCheckCircle className="w-4 h-4 mr-1.5" />,
        };
      case "cancelled":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
          icon: <FaTimesCircle className="w-4 h-4 mr-1.5" />,
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          icon: null,
        };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track all orders
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full bg-gray-50 transition-all duration-200 hover:bg-white group-hover:border-indigo-300"
            />
            <FaSearch className="absolute left-3 top-3.5 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" />
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 transition-all duration-200 hover:bg-white appearance-none"
            >
              <option value="all">All Status</option>
              <option value="Success">Success</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <FaFilter className="absolute left-3 top-3.5 text-gray-400" />
            <FaChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative group">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 transition-all duration-200 hover:bg-white group-hover:border-indigo-300 appearance-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
            <FaSort className="absolute left-3 top-3.5 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" />
            <div className="absolute right-3 top-3.5 pointer-events-none">
              <FaChevronDown className="w-3 h-3 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-200 hover:shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Total Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedOrders.map((order) => (
                <React.Fragment key={order.orderId}>
                  <tr className="hover:bg-gray-50 transition-colors duration-150 group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 group-hover:bg-indigo-200 transition-colors duration-150">
                        #{order.orderId}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-150">
                      {order.orderAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-150">
                      {new Date(order.createdDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`inline-flex items-center px-3 py-1.5 rounded-full border ${
                          getStatusColor(order.status).bg
                        } ${getStatusColor(order.status).text} ${
                          getStatusColor(order.status).border
                        } transition-colors duration-150 group-hover:shadow-sm`}
                      >
                        {getStatusColor(order.status).icon}
                        <span className="text-sm font-medium">
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-150">
                      {order.totalPrice.toLocaleString("vi-VN")} VNĐ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => toggleOrderDetails(order.orderId)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 hover:text-indigo-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        {expandedOrders[order.orderId] ? (
                          <>
                            <span>Hide Details</span>
                            <FaChevronUp className="ml-2 w-3 h-3" />
                          </>
                        ) : (
                          <>
                            <span>View Details</span>
                            <FaChevronDown className="ml-2 w-3 h-3" />
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedOrders[order.orderId] && (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 bg-gray-50">
                        <div className="space-y-4 animate-fadeIn">
                          <h4 className="font-medium text-gray-900 flex items-center">
                            <span className="w-1 h-4 bg-indigo-500 rounded-full mr-2"></span>
                            Order Items
                          </h4>
                          <div className="space-y-3">
                            {getOrderDetails(order.orderId).map((detail) => {
                              const product = products[detail.productId];
                              return product ? (
                                <div
                                  key={detail.orderItemId}
                                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
                                >
                                  <div className="flex items-center space-x-6">
                                    <div className="relative">
                                      <img
                                        src={product.imageProduct}
                                        alt={product.productName}
                                        className="w-20 h-20 object-cover rounded-lg shadow-sm"
                                      />
                                    </div>
                                    <div className="flex-1 grid grid-cols-4 gap-4">
                                      <div>
                                        <h5 className="font-medium text-gray-900 mb-1">
                                          {product.productName}
                                        </h5>
                                        <p className="text-sm text-gray-600">
                                          <span className="font-medium">
                                            Quantity:
                                          </span>{" "}
                                          {detail.quantity}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                          <span className="font-medium">
                                            Price:
                                          </span>{" "}
                                          {detail.priceItem.toLocaleString(
                                            "vi-VN"
                                          )}{" "}
                                          VNĐ
                                        </p>
                                        {shops[product.shopId] && (
                                          <p className="text-sm text-gray-600">
                                            <span className="font-medium">
                                              Shop:
                                            </span>{" "}
                                            {shops[product.shopId].shopName}
                                          </p>
                                        )}
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        <p className="font-medium mb-1">
                                          Specifications
                                        </p>
                                        <div className="space-y-1">
                                          <p>CPU: {product.cpu}</p>
                                          <p>RAM: {product.ram}</p>
                                          <p>Storage: {product.storage}</p>
                                          <p>Screen: {product.screenSize}"</p>
                                        </div>
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        {product.model && (
                                          <p>Model: {product.model}</p>
                                        )}
                                        {product.color && (
                                          <p>Color: {product.color}</p>
                                        )}
                                        {product.graphicsCard && (
                                          <p>
                                            Graphics: {product.graphicsCard}
                                          </p>
                                        )}
                                        {product.battery && (
                                          <p>Battery: {product.battery}</p>
                                        )}
                                        {product.ports && (
                                          <p>Ports: {product.ports}</p>
                                        )}
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        {product.productionYear && (
                                          <p>Year: {product.productionYear}</p>
                                        )}
                                        {product.operatingSystem && (
                                          <p>OS: {product.operatingSystem}</p>
                                        )}
                                        {product.categoryName && (
                                          <p>
                                            Category: {product.categoryName}
                                          </p>
                                        )}
                                        {product.description && (
                                          <div className="mt-2">
                                            <p className="font-medium">
                                              Description:
                                            </p>
                                            <p className="text-gray-500">
                                              {product.description}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-xl shadow-md">
        <div className="flex flex-1 justify-between sm:hidden">
          <button className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-150">
            Previous
          </button>
          <button className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-150">
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">{sortedOrders.length}</span> of{" "}
              <span className="font-medium">{sortedOrders.length}</span> results
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 transition-colors duration-150">
                Previous
              </button>
              <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 transition-colors duration-150">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
