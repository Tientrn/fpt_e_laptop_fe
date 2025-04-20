import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaWallet, FaExchangeAlt, FaMoneyBillWave } from "react-icons/fa";
import { getWalletByUserId } from "../../utils/getWalletByUserId";
import { formatCurrency } from "../../utils/moneyValidationUtils";

const OverviewPage = () => {
  const [walletInfo, setWalletInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch wallet information
  useEffect(() => {
    const fetchWalletInfo = async () => {
      try {
        setLoading(true);
        const walletData = await getWalletByUserId();
        
        if (walletData) {
          setWalletInfo(walletData);
        } else {
          setError("Không tìm thấy thông tin ví hoặc bạn chưa có ví");
          toast.error("Không tìm thấy thông tin ví");
        }
      } catch (error) {
        console.error("Error fetching wallet information:", error);
        setError("Lỗi khi tải thông tin ví");
        toast.error("Lỗi khi tải thông tin ví");
      } finally {
        setLoading(false);
      }
    };

    fetchWalletInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-amber-600">Manager Overview</h1>

      {/* Wallet Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {error ? (
          <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-600">
            <p>{error}</p>
            <button 
              className="mt-2 bg-red-600 text-white px-4 py-1 rounded-md hover:bg-red-700 text-sm"
              onClick={() => window.location.reload()}
            >
              Thử lại
            </button>
          </div>
        ) : walletInfo ? (
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
            <div className="bg-white/10 backdrop-blur-sm p-8 h-full">
              <div className="flex items-center mb-3">
                <div className="bg-white/20 p-3 rounded-full">
                  <FaWallet className="text-white text-2xl" />
                </div>
                <h2 className="ml-3 text-xl font-semibold text-white">Ví của bạn</h2>
              </div>
              
              <div className="mt-8 mb-2">
                <p className="text-white/70 text-sm">Số dư hiện tại</p>
                <div className="flex items-baseline mt-1">
                  <span className="text-4xl font-bold text-white">{formatCurrency(walletInfo.balance || 0)}</span>
                  <span className="text-white/70 ml-2 text-sm">VND</span>
                </div>
              </div>
              
              <div className="mt-8 flex items-center">
                <div className="bg-white/20 p-2 rounded-full">
                  <FaMoneyBillWave className="text-white text-sm" />
                </div>
                <p className="ml-2 text-sm text-white/80">Quản lý dòng tiền của doanh nghiệp</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 p-6 rounded-xl shadow-md text-center">
            <FaWallet className="text-3xl text-amber-400 mx-auto mb-3" />
            <p className="text-amber-700 font-medium">Không có thông tin ví</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-4">
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full">
                <FaExchangeAlt className="text-white text-xl" />
              </div>
              <h2 className="ml-3 text-xl font-semibold text-white">Giao dịch gần đây</h2>
            </div>
          </div>
          
          <div className="p-6 flex items-center justify-center h-[calc(100%-76px)]">
            <div className="text-center">
              <p className="text-blue-600 font-medium mb-2">Chức năng đang phát triển</p>
              <p className="text-gray-500 text-sm">Thông tin giao dịch sẽ sớm được cập nhật</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage; 