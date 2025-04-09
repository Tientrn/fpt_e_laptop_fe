import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import donateformApi from "../../api/donateformApi";
import { jwtDecode } from "jwt-decode";

const LaptopInfo = () => {
  const [donationForms, setDonationForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const id = Number(decoded.userId);

        setUserId(id);
      } catch (error) {
        console.error("❌ Token decode failed:", error);
      }
    }
  }, []);
  useEffect(() => {
    const fetchForms = async () => {
      if (!userId) return; // tránh gọi khi userId chưa có

      try {
        const res = await donateformApi.getAllDonateForms();

        // In ra toàn bộ JSON format dễ nhìn hơn
        console.log(
          "📦 Toàn bộ kết quả từ API:\n",
          JSON.stringify(res.data, null, 2)
        );

        const allForms = res.data || [];
        const sponsorForms = allForms
          .filter((form) => Number(form.sponsorId) === Number(userId))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        console.log(
          "✅ Đơn của sponsorId:",
          userId,
          "\n",
          JSON.stringify(sponsorForms, null, 2)
        );
        console.log(
          "🔍 Các sponsorId từ dữ liệu:",
          allForms.map((f) => f.sponsorId)
        );

        setDonationForms(sponsorForms);
        setFilteredForms(sponsorForms);
      } catch (error) {
        console.error("❌ Lỗi khi lấy đơn tài trợ:", error);
        toast.error("Không thể tải danh sách đơn tài trợ");
      }
    };

    fetchForms();
  }, [userId]);

  useEffect(() => {
    if (statusFilter === "All") {
      setFilteredForms(donationForms);
    } else {
      setFilteredForms(
        donationForms.filter((form) => form.status === statusFilter)
      );
    }
  }, [statusFilter, donationForms]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Danh sách đơn tài trợ đã gửi
        </h1>

        {/* Filter Dropdown */}
        <div className="mb-6 text-right">
          <label className="mr-2 text-sm font-medium text-gray-700">
            Lọc theo trạng thái:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="All">Tất cả</option>
            <option value="Pending">Đang chờ</option>
            <option value="Approved">Đã chấp nhận</option>
            <option value="Rejected">Từ chối</option>
          </select>
        </div>

        {filteredForms.length === 0 ? (
          <p className="text-center text-gray-600">Không có đơn nào.</p>
        ) : (
          <div className="space-y-4">
            {filteredForms.map((form) => (
              <div
                key={form.donationFormId}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-md"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg text-black">
                      {form.itemName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {form.itemDescription}
                    </p>
                    <p className="text-sm text-gray-500">
                      Số lượng:{" "}
                      <span className="font-medium">{form.quantity}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Gửi ngày:{" "}
                      {new Date(form.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <span
                    className={`text-sm px-3 py-1 rounded-full font-medium ${
                      form.status === "Accepted"
                        ? "bg-green-100 text-green-700"
                        : form.status === "Rejected"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {form.status === "Pending"
                      ? "Đang chờ duyệt"
                      : form.status === "Accepted"
                      ? "Đã chấp nhận"
                      : "Đã từ chối"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default LaptopInfo;
