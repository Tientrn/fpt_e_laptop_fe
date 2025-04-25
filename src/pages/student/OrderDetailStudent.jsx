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
        console.error("Lỗi khi lấy thông tin đơn hàng:", error);
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
    } else if (statusLower === "delivered" || statusLower === "paid") {
      return (
        <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
          {status}
        </span>
      );
    } else {
      return (
        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full">
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
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-6 px-8">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <FaShoppingBag className="mr-3" /> Order Details
            </h1>
            <p className="text-indigo-100 mt-1">
              Review the details of your order and provide feedback
            </p>
          </div>

          {orderInfo && (
            <div className="border-b border-gray-200 px-8 py-4 bg-gray-50">
              <div className="flex flex-wrap items-center justify-between">
                <div className="mb-2 md:mb-0">
                  <span className="text-sm text-gray-600 font-medium">
                    User Name:
                  </span>{" "}
                  <span className="text-indigo-700 font-semibold">
                    {userName}
                  </span>
                </div>
                <div className="mb-2 md:mb-0">
                  <span className="text-sm text-gray-600 font-medium">
                    Status:
                  </span>{" "}
                  {getStatusBadge(orderInfo.status)}
                </div>
                <div className="mb-2 md:mb-0">
                  <span className="text-sm text-gray-600 font-medium">
                    Date:
                  </span>{" "}
                  <span className="text-gray-800">
                    {new Date(orderInfo.createdDate).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600 font-medium">
                    Address:
                  </span>{" "}
                  <span className="text-gray-800 max-w-xs truncate inline-block">
                    {orderInfo.orderAddress}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="p-8">
            {orderDetails.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-indigo-400 mb-4">
                  <FaInfoCircle className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Items Found
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  This order does not contain any items. This could be due to an
                  error or the order may have been canceled.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Product
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Specifications
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Feedback
                      </th>
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
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden border border-gray-200">
                                <img
                                  src={item.product?.imageProduct}
                                  alt={item.product?.productName}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 line-clamp-2">
                                  {item.product?.productName}
                                </div>
                                <div className="text-xs text-indigo-600 mt-1">
                                  Product ID: {item.productId}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1 text-xs text-gray-500">
                              <div className="flex items-center">
                                <span className="w-16 font-medium">CPU:</span>
                                <span>{item.product?.cpu}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="w-16 font-medium">RAM:</span>
                                <span>{item.product?.ram}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="w-16 font-medium">
                                  Storage:
                                </span>
                                <span>{item.product?.storage}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="w-16 font-medium">
                                  Screen:
                                </span>
                                <span>{item.product?.screenSize} inch</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {(
                                item.quantity * item.priceItem
                              ).toLocaleString()}{" "}
                              đ
                            </div>
                            <div className="text-xs text-gray-500">
                              {item.priceItem.toLocaleString()} đ each
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {isPending ? (
                              <div className="flex items-center text-yellow-600 text-xs italic bg-yellow-50 p-3 rounded-lg">
                                <FaInfoCircle className="mr-2" />
                                <span>
                                  Cannot leave feedback while order is pending
                                </span>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">
                                    Rating
                                  </label>
                                  <div className="relative">
                                    <select
                                      className="block w-full rounded-md border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
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
                                  <label className="block text-xs text-gray-500 mb-1">
                                    Comments
                                  </label>
                                  <textarea
                                    rows={2}
                                    className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
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
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
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
                                    className="ml-2 block text-xs text-gray-500 flex items-center"
                                  >
                                    <FaUserSecret className="mr-1" /> Post
                                    anonymously
                                  </label>
                                </div>
                                <button
                                  onClick={() => handleSubmitFeedback(item)}
                                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  <FaStar className="mr-2" />
                                  Submit Feedback
                                </button>
                              </div>
                            )}
                          </td>
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
              <div className="flex justify-between">
                <div>
                  <span className="text-sm text-gray-600 font-medium">
                    Total Amount:
                  </span>{" "}
                  <span className="text-xl font-bold text-indigo-700">
                    {orderInfo.totalPrice?.toLocaleString()} đ
                  </span>
                </div>
                <a
                  href="/student/orderstudent"
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
                >
                  Back to Orders <FaAngleRight className="ml-1" />
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
