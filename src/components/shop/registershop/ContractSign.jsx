import React from "react";

const ContractSign = ({ onBack, onSign }) => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-emerald-100 pb-4">
          <h2 className="text-2xl font-semibold text-emerald-900">
            Ký hợp đồng
          </h2>
          <p className="mt-2 text-emerald-600">
            Vui lòng đọc kỹ điều khoản trước khi ký hợp đồng
          </p>
        </div>

        {/* Contract Viewer */}
        <div className="bg-emerald-50 rounded-lg p-4">
          <div className="relative border border-emerald-200 rounded-lg overflow-hidden">
            <iframe
              src="/sample-contract.pdf"
              className="w-full h-[600px]"
              title="Contract Viewer"
            ></iframe>
          </div>
        </div>

        {/* Agreement Section */}
        <div className="flex items-center space-x-2 py-4">
          <input
            type="checkbox"
            id="agreement"
            className="w-4 h-4 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-500"
          />
          <label htmlFor="agreement" className="text-emerald-700">
            Tôi đã đọc và đồng ý với các điều khoản trong hợp đồng
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="flex-1 px-6 py-3 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition duration-200"
          >
            Quay lại
          </button>
          <button
            onClick={onSign}
            className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
          >
            <span>Ký hợp đồng</span>
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractSign;
