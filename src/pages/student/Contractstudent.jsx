import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaFileDownload,
  FaCheckCircle,
} from "react-icons/fa";
import borrowcontractApi from "../../api/borrowcontractApi"; // Thay bằng đường dẫn tới axiosClient của bạn

const Contractstudent = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedContract, setSelectedContract] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      console.log("Bắt đầu gọi API");
      const response = await borrowcontractApi.getAllBorrowContracts();
      console.log("Phản hồi từ API:", response);

      if (!response || !response.data) {
        throw new Error("Không nhận được dữ liệu từ server");
      }

      if (response.isSuccess) {
        console.log("Dữ liệu thô:", response.data.data);
        const transformedContracts = response.data.map((contract) => {
          console.log("Đang ánh xạ contract:", contract);
          return {
            id: contract.contractId,
            contractNumber: `CTR-${contract.contractId}`,
            laptopName: contract.terms.split("Contract for ")[1] || "Unknown",
            startDate: contract.contractDate,
            endDate: contract.expectedReturnDate,
            status:
              contract.status.toLowerCase() === "pending"
                ? "active"
                : "completed",
            depositAmount: contract.itemValue * 0.1,
            returnDate: null,
            laptopCondition: {
              beforeBorrow: contract.conditionBorrow,
              afterReturn: null,
            },
          };
        });
        console.log("Dữ liệu sau ánh xạ:", transformedContracts);
        setContracts(transformedContracts);
      } else {
        throw new Error(
          response.data.message || "Lấy dữ liệu hợp đồng thất bại"
        );
      }
    } catch (error) {
      console.error("Error fetching contracts:", error);
      toast.error(error.message || "Không thể tải danh sách hợp đồng");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (contract) => {
    setSelectedContract(contract);
    setIsModalOpen(true);
  };

  const handleDownloadContract = (id) => {
    toast.info(`Đang tải hợp đồng #${id}...`);
    setTimeout(() => {
      toast.success("Tải hợp đồng thành công");
    }, 1500);
  };

  const handleConfirmReturn = async (id) => {
    if (
      window.confirm("Bạn có chắc chắn muốn xác nhận trả laptop này không?")
    ) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Giả lập API call
        setContracts(
          contracts.map((contract) =>
            contract.id === id
              ? {
                  ...contract,
                  status: "completed",
                  returnDate: new Date().toISOString(),
                  laptopCondition: {
                    ...contract.laptopCondition,
                    afterReturn: "Trả lại trong tình trạng tốt",
                  },
                }
              : contract
          )
        );
        toast.success("Xác nhận trả thành công");
      } catch (error) {
        console.error("Error confirming return:", error);
        toast.error("Không thể xác nhận trả");
      }
    }
  };

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.laptopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || contract.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContracts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredContracts.length / itemsPerPage);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-black mb-6">Hợp đồng của tôi</h1>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm theo tên laptop hoặc mã hợp đồng..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:border-amber-600 focus:outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <select
              className="p-2 border border-gray-200 rounded focus:border-amber-600 focus:outline-none text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="completed">Đã hoàn thành</option>
            </select>
          </div>
        </div>

        {/* Contracts Table */}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">
                      Mã hợp đồng
                    </th>
                    <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">
                      Laptop
                    </th>
                    <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">
                      Thời gian
                    </th>
                    <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">
                      Tiền cọc
                    </th>
                    <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">
                      Trạng thái
                    </th>
                    <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((contract) => (
                      <tr
                        key={contract.id}
                        className="border-t border-gray-200 hover:bg-amber-50"
                      >
                        <td className="px-4 py-3 text-sm text-black">
                          {contract.contractNumber}
                        </td>
                        <td className="px-4 py-3 text-sm text-black">
                          {contract.laptopName}
                        </td>
                        <td className="px-4 py-3 text-sm text-black">
                          {format(new Date(contract.startDate), "dd/MM/yyyy")} -{" "}
                          {format(new Date(contract.endDate), "dd/MM/yyyy")}
                        </td>
                        <td className="px-4 py-3 text-sm text-black">
                          {formatCurrency(contract.depositAmount)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              contract.status === "active"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {contract.status === "active"
                              ? "Đang hoạt động"
                              : "Đã hoàn thành"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleViewDetails(contract)}
                              className="text-gray-500 hover:text-amber-600"
                              title="Xem chi tiết"
                            >
                              <FaEye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() =>
                                handleDownloadContract(contract.id)
                              }
                              className="text-gray-500 hover:text-amber-600"
                              title="Tải hợp đồng"
                            >
                              <FaFileDownload className="w-5 h-5" />
                            </button>
                            {contract.status === "active" && (
                              <button
                                onClick={() => handleConfirmReturn(contract.id)}
                                className="text-gray-500 hover:text-amber-600"
                                title="Xác nhận trả"
                              >
                                <FaCheckCircle className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-3 text-center text-sm text-gray-500"
                      >
                        Không tìm thấy hợp đồng nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredContracts.length > 0 && (
              <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <div>
                  Hiển thị {indexOfFirstItem + 1} đến{" "}
                  {Math.min(indexOfLastItem, filteredContracts.length)} trong
                  tổng số {filteredContracts.length} hợp đồng
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-200 rounded hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Trước
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 border border-gray-200 rounded ${
                        currentPage === i + 1
                          ? "bg-amber-600 text-white"
                          : "hover:bg-amber-50"
                      } transition-colors duration-200`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-200 rounded hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Details Modal */}
        {isModalOpen && selectedContract && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded p-6 max-w-lg w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-black">
                  Chi tiết hợp đồng
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-amber-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Mã hợp đồng</p>
                    <p className="text-sm text-black font-medium">
                      {selectedContract.contractNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Trạng thái</p>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        selectedContract.status === "active"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedContract.status === "active"
                        ? "Đang hoạt động"
                        : "Đã hoàn thành"}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Laptop</p>
                  <p className="text-sm text-black font-medium">
                    {selectedContract.laptopName}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Thời gian mượn</p>
                    <p className="text-sm text-black">
                      {format(
                        new Date(selectedContract.startDate),
                        "dd/MM/yyyy"
                      )}{" "}
                      -{" "}
                      {format(new Date(selectedContract.endDate), "dd/MM/yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Tiền cọc</p>
                    <p className="text-sm text-black font-medium">
                      {formatCurrency(selectedContract.depositAmount)}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    Tình trạng laptop trước khi mượn
                  </p>
                  <p className="text-sm text-black">
                    {selectedContract.laptopCondition.beforeBorrow}
                  </p>
                </div>
                {selectedContract.status === "completed" && (
                  <>
                    <div>
                      <p className="text-xs text-gray-500">Ngày trả</p>
                      <p className="text-sm text-black">
                        {format(
                          new Date(selectedContract.returnDate),
                          "dd/MM/yyyy HH:mm"
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">
                        Tình trạng laptop sau khi trả
                      </p>
                      <p className="text-sm text-black">
                        {selectedContract.laptopCondition.afterReturn}
                      </p>
                    </div>
                  </>
                )}
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => handleDownloadContract(selectedContract.id)}
                  className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors duration-200 text-sm flex items-center"
                >
                  <FaFileDownload className="mr-2" />
                  Tải hợp đồng
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded text-black hover:bg-amber-50 transition-colors duration-200 text-sm"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contractstudent;
