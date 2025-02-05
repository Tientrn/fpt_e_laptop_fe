import React from "react";

const Verification = ({ onBack, onNext, taxId, cccdImage }) => {
  return (
    <div className="p-8 bg-white rounded-lg">
      <h2 className="text-2xl font-semibold text-emerald-900 mb-6">Xác minh</h2>
      <div className="space-y-6">
        <div className="bg-emerald-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-emerald-700 mb-2">
            Mã số thuế:
          </p>
          <p className="text-emerald-900">{taxId}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-gray-600 mb-2">Ảnh CCCD:</p>
          <img
            src={cccdImage}
            alt="CCCD"
            className="w-48 h-48 object-cover rounded-lg border border-gray-200"
          />
        </div>
        <p className="text-amber-500 flex items-center gap-2">
          <span className="inline-block w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></span>
          Đang xác minh...
        </p>
        <div className="flex gap-4 pt-4">
          <button
            onClick={onBack}
            className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 py-2.5 px-6 rounded-lg"
          >
            Quay lại
          </button>
          <button
            onClick={onNext}
            className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-6 rounded-lg shadow-lg"
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verification;
