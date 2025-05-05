import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import orderApis from "../../api/orderApi";
import productApi from "../../api/productApi";
import productFeedbackApi from "../../api/productFeedbackApi";
import {
  FaInfoCircle,
  FaShoppingBag,
  FaStar,
  FaUserSecret,
  FaAngleRight,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import "react-toastify/dist/ReactToastify.css";

const OrderDetailStudent = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [feedbacks, setFeedbacks] = useState({});
  const [orderInfo, setOrderInfo] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(Number(decoded.userId));
      const name = decoded.fullName || decoded.name || "";
      setUserName(name);
    }
  }, []);

  useEffect(() => {
    const fetchOrderInfo = async () => {
      try {
        const res = await orderApis.getOrderById(orderId);
        if (res.isSuccess) {
          setOrderInfo(res.data);
        }
      } catch (error) {
        console.error("Error fetching order info:", error);
      }
    };

    fetchOrderInfo();
  }, [orderId]);

  useEffect(() => {
    const fetchOrderDetailsWithProduct = async () => {
      try {
        const res = await orderApis.getAllOrderDetail();
        if (res.isSuccess) {
          const filtered = res.data.filter(
            (item) => Number(item.orderId) === Number(orderId)
          );

          const enrichedDetails = await Promise.all(
            filtered.map(async (item) => {
              try {
                const productRes = await productApi.getProductById(
                  item.productId
                );
                return { ...item, product: productRes.data };
              } catch (err) {
                console.error("❌ Lỗi getProductById:", err);
                return { ...item, product: null };
              }
            })
          );

          setOrderDetails(enrichedDetails);
        }
      } catch (error) {
        console.error("Lỗi khi tải chi tiết đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetailsWithProduct();
  }, [orderId]);

  const handleFeedbackChange = (id, field, value) => {
    setFeedbacks((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSubmitFeedback = async (orderDetails) => {
    const fb = feedbacks[orderDetails.orderItemId];
    if (!fb || !fb.rating || !fb.comments) {
      toast.warning("Vui lòng nhập đủ sao và bình luận.");
      return;
    }

    const body = {
      orderDetailId: orderDetails.orderItemId,
      productId: orderDetails.productId,
      userId,
      rating: Number(fb.rating),
      comments: fb.comments,
      isAnonymous: fb.isAnonymous || false,
    };

    try {
      const res = await productFeedbackApi.createFeedbackProduct(body);
      if (res.isSuccess && (res.code === 200 || res.code === 201)) {
        toast.success("🎉 Đánh giá đã được gửi!");
      } else {
        toast.error("❌ Gửi đánh giá thất bại (dữ liệu không hợp lệ).");
      }
    } catch (error) {
      toast.error("❌ Gửi đánh giá thất bại.");
    }
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "pending") {
      return (
        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full">
          {status}
        </span>
      );
    } else if (statusLower === "delivered" || statusLower === "success") {
      return (
        <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
          {status}
        </span>
      );
    } else {
      return (
        <span className="bg-red-100 text-red-800 text-xs font-medium px-3 py-1 rounded-full">
          {status}
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-3 text-indigo-600 font-medium">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-8 px-8">
            <h1 className="text-3xl font-bold text-white flex items-center">
              <FaShoppingBag className="mr-4 w-8 h-8" /> Order Details
            </h1>
            <p className="text-indigo-100 mt-2 text-lg">
              Review the details of your order and provide feedback
            </p>
          </div>

          {orderInfo && (
            <div className="border-b border-gray-200 px-8 py-6 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-50">
                  <span className="text-sm text-gray-600 font-medium block mb-1">
                    User Name
                  </span>
                  <span className="text-indigo-700 font-semibold text-lg">
                    {userName}
                  </span>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-50">
                  <span className="text-sm text-gray-600 font-medium block mb-1">
                    Status
                  </span>
                  {getStatusBadge(orderInfo.status)}
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-50">
                  <span className="text-sm text-gray-600 font-medium block mb-1">
                    Date
                  </span>
                  <span className="text-gray-800 text-lg">
                    {new Date(orderInfo.createdDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-50">
                  <span className="text-sm text-gray-600 font-medium block mb-1">
                    Address
                  </span>
                  <span className="text-gray-800 text-lg truncate block">
                    {orderInfo.orderAddress}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="p-8">
            {orderDetails.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-indigo-400 mb-6">
                  <FaInfoCircle className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  No Items Found
                </h3>
                <p className="text-gray-500 max-w-md mx-auto text-lg">
                  This order does not contain any items. This could be due to an
                  error or the order may have been canceled.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-indigo-100">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-indigo-400 to-indigo-600">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Product
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Specifications
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Total
                      </th>
                      {orderInfo?.status?.toLowerCase() !== "cancelled" && (
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider"
                        >
                          Feedback
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orderDetails.map((item) => {
                      const fb = feedbacks[item.orderItemId] || {};
                      const isPending =
                        orderInfo?.status?.toLowerCase() === "pending";

                      return (
                        <tr
                          key={item.orderItemId}
                          className="hover:bg-indigo-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-6">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-20 w-20 rounded-xl overflow-hidden border-2 border-indigo-100 shadow-sm hover:shadow-md transition-all">
                                <img
                                  src={item.product?.imageProduct}
                                  alt={item.product?.productName}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-base font-medium text-gray-900 line-clamp-2">
                                  {item.product?.productName}
                                </div>
                                <div className="text-sm text-indigo-600 mt-1">
                                  Product ID: {item.productId}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <div className="space-y-2 text-sm text-gray-500">
                              <div className="flex items-center">
                                <span className="w-20 font-medium">CPU:</span>
                                <span>{item.product?.cpu}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="w-20 font-medium">RAM:</span>
                                <span>{item.product?.ram}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="w-20 font-medium">
                                  Storage:
                                </span>
                                <span>{item.product?.storage}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="w-20 font-medium">
                                  Screen:
                                </span>
                                <span>{item.product?.screenSize} inch</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-500">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                              {item.quantity}
                            </span>
                          </td>
                          <td className="px-6 py-6 whitespace-nowrap">
                            <div className="text-base font-medium text-gray-900">
                              {(
                                item.quantity * item.priceItem
                              ).toLocaleString()}{" "}
                              đ
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.priceItem.toLocaleString()} đ each
                            </div>
                          </td>
                          {orderInfo?.status?.toLowerCase() !== "cancelled" && (
                            <td className="px-6 py-6">
                              {isPending ? (
                                <div className="flex items-center text-yellow-600 text-sm italic bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                                  <FaInfoCircle className="mr-2" />
                                  <span>
                                    Cannot leave feedback while order is pending
                                  </span>
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-sm text-gray-600 mb-2">
                                      Rating
                                    </label>
                                    <div className="relative">
                                      <select
                                        className="block w-full rounded-xl border-2 border-indigo-200 pr-10 focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2"
                                        value={fb.rating || ""}
                                        onChange={(e) =>
                                          handleFeedbackChange(
                                            item.orderItemId,
                                            "rating",
                                            e.target.value
                                          )
                                        }
                                      >
                                        <option value="">Select rating</option>
                                        {[1, 2, 3, 4, 5].map((r) => (
                                          <option key={r} value={r}>
                                            {r} {r === 1 ? "star" : "stars"}
                                          </option>
                                        ))}
                                      </select>
                                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                        <FaStar className="h-4 w-4 text-yellow-400" />
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-sm text-gray-600 mb-2">
                                      Comments
                                    </label>
                                    <textarea
                                      rows={3}
                                      className="block w-full rounded-xl border-2 border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2 px-3"
                                      placeholder="Share your experience with this product..."
                                      value={fb.comments || ""}
                                      onChange={(e) =>
                                        handleFeedbackChange(
                                          item.orderItemId,
                                          "comments",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="flex items-center">
                                    <input
                                      type="checkbox"
                                      id={`anonymous-${item.orderItemId}`}
                                      className="h-5 w-5 rounded border-2 border-indigo-200 text-indigo-600 focus:ring-indigo-500"
                                      checked={fb.isAnonymous || false}
                                      onChange={(e) =>
                                        handleFeedbackChange(
                                          item.orderItemId,
                                          "isAnonymous",
                                          e.target.checked
                                        )
                                      }
                                    />
                                    <label
                                      htmlFor={`anonymous-${item.orderItemId}`}
                                      className="ml-2 block text-sm text-gray-600 flex items-center"
                                    >
                                      <FaUserSecret className="mr-2" /> Post
                                      anonymously
                                    </label>
                                  </div>
                                  <button
                                    onClick={() => handleSubmitFeedback(item)}
                                    className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                                  >
                                    <FaStar className="mr-2" />
                                    Submit Feedback
                                  </button>
                                </div>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {orderInfo && (
            <div className="border-t border-gray-200 px-8 py-6 bg-gray-50">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-50">
                  <span className="text-sm text-gray-600 font-medium block mb-1">
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold text-indigo-700">
                    {orderInfo.totalPrice?.toLocaleString()} đ
                  </span>
                </div>
                <a
                  href="/student/orders"
                  className="inline-flex items-center px-6 py-3 text-indigo-600 hover:text-indigo-900 bg-white rounded-xl shadow-sm border border-indigo-100 hover:bg-indigo-50 transition-all"
                >
                  Back to Orders <FaAngleRight className="ml-2" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
};

export default OrderDetailStudent;
