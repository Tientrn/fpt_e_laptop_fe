import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import orderApis from "../../api/orderApi";
import productApi from "../../api/productApi";
import productFeedbackApi from "../../api/productFeedbackApi";
import { FaInfoCircle } from "react-icons/fa";
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(Number(decoded.userId));
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

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black">Chi tiết đơn hàng</h1>

      {orderInfo && (
        <div className="mb-6 text-sm text-slate-700">
          <span className="font-medium">Trạng thái đơn hàng:</span>{" "}
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              orderInfo.status.toLowerCase() === "pending"
                ? "bg-amber-100 text-amber-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {orderInfo.status}
          </span>
        </div>
      )}

      {loading ? (
        <p className="text-slate-600">Đang tải chi tiết đơn hàng...</p>
      ) : orderDetails.length === 0 ? (
        <div className="text-slate-600 flex items-center space-x-2">
          <FaInfoCircle className="text-amber-600" />
          <span>Không có sản phẩm nào trong đơn hàng này.</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-slate-200 rounded-xl shadow">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-sm text-left text-black">
                  Sản phẩm
                </th>
                <th className="px-4 py-3 text-sm text-left text-black">
                  Cấu hình
                </th>
                <th className="px-4 py-3 text-sm text-left text-black">
                  Số lượng
                </th>
                <th className="px-4 py-3 text-sm text-left text-black">Tổng</th>
                <th className="px-4 py-3 text-sm text-left text-black">
                  Feedback
                </th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.map((item) => {
                const fb = feedbacks[item.orderItemId] || {};
                const isPending =
                  orderInfo?.status?.toLowerCase() === "pending";

                return (
                  <tr
                    key={item.orderItemId}
                    className="hover:bg-slate-50 border-b border-slate-100"
                  >
                    <td className="px-4 py-3 text-sm text-black flex items-center gap-2">
                      <img
                        src={item.product?.imageProduct}
                        alt={item.product?.productName}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <span>{item.product?.productName}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-black">
                      <div>CPU: {item.product?.cpu}</div>
                      <div>RAM: {item.product?.ram}</div>
                      <div>SSD: {item.product?.storage}</div>
                      <div>Màn hình: {item.product?.screenSize} inch</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-black">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-sm text-black font-medium">
                      {(item.quantity * item.priceItem).toLocaleString()} đ
                    </td>
                    <td className="px-4 py-3 text-sm text-black space-y-2">
                      {isPending ? (
                        <span className="text-slate-400 italic text-xs">
                          Không thể đánh giá khi đơn hàng đang chờ xử lý.
                        </span>
                      ) : (
                        <>
                          <div>
                            <label className="block text-xs">
                              Sao đánh giá:
                            </label>
                            <select
                              className="border rounded px-2 py-1 text-sm w-full"
                              value={fb.rating || ""}
                              onChange={(e) =>
                                handleFeedbackChange(
                                  item.orderItemId,
                                  "rating",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Chọn sao</option>
                              {[1, 2, 3, 4, 5].map((r) => (
                                <option key={r} value={r}>
                                  {r} ⭐
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs">Bình luận:</label>
                            <textarea
                              rows={2}
                              className="border rounded w-full px-2 py-1 text-sm"
                              placeholder="Viết đánh giá..."
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
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="checkbox"
                              checked={fb.isAnonymous || false}
                              onChange={(e) =>
                                handleFeedbackChange(
                                  item.orderItemId,
                                  "isAnonymous",
                                  e.target.checked
                                )
                              }
                            />
                            <label className="text-xs">Ẩn danh</label>
                          </div>
                          <button
                            onClick={() => handleSubmitFeedback(item)}
                            className="mt-2 w-full px-3 py-1 bg-slate-600 text-white rounded hover:bg-amber-600 transition"
                          >
                            Gửi đánh giá
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
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
