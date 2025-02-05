import React from "react";

const InputForm = ({ onNext }) => {
  return (
    <div className="p-8 bg-white rounded-lg">
      <h2 className="text-2xl font-semibold text-emerald-900 mb-6">
        Nhập thông tin
      </h2>
      <form className="space-y-6">
        <div>
          <label
            htmlFor="taxId"
            className="block text-sm font-medium text-emerald-700 mb-1"
          >
            Mã số thuế
          </label>
          <input
            type="text"
            id="taxId"
            className="w-full p-2.5 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200"
          />
        </div>
        <div>
          <label
            htmlFor="shopName"
            className="block text-sm font-medium text-emerald-700 mb-1"
          >
            Tên shop
          </label>
          <input
            type="text"
            id="shopName"
            className="w-full p-2.5 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200"
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-emerald-700 mb-1"
          >
            Số điện thoại
          </label>
          <input
            type="text"
            id="phone"
            className="w-full p-2.5 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-emerald-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-2.5 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-emerald-700 mb-1">
            Ảnh CCCD
          </label>
          <div className="w-full p-6 border-2 border-dashed border-emerald-200 rounded-lg hover:border-emerald-500 transition-colors duration-200">
            <input type="file" className="hidden" id="cccd" />
            <label
              htmlFor="cccd"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <svg
                className="w-10 h-10 text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span className="text-gray-600">Kéo thả hoặc chọn file</span>
              <span className="text-sm text-gray-500 mt-1">
                PNG, JPG (Tối đa 5MB)
              </span>
            </label>
          </div>
        </div>
        <button
          type="button"
          onClick={onNext}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition duration-200 shadow-lg hover:shadow-xl"
        >
          Tiếp tục
        </button>
      </form>
    </div>
  );
};

export default InputForm;
