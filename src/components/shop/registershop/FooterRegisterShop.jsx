import React from "react";

const FooterRegisterShop = () => {
  return (
    <footer className="bg-gradient-to-r from-emerald-50 to-white border-t border-emerald-100">
      <div className="max-w-4xl mx-auto px-8 py-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Error message section */}
          <div className="w-full bg-red-50 rounded-lg p-3 hidden">
            <p className="text-sm text-red-600 font-medium flex items-center justify-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              Thông báo lỗi (nếu có)
            </p>
          </div>

          {/* Support section */}
          <div className="flex items-center gap-4">
            <span className="text-emerald-700">Liên hệ hỗ trợ:</span>
            <a
              href="tel:1800-1234"
              className="flex items-center text-emerald-600 hover:text-emerald-800"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              1800-1234
            </a>
            <span className="text-emerald-200">|</span>
            <a
              href="#"
              className="flex items-center text-emerald-600 hover:text-emerald-800"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Chat trực tiếp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterRegisterShop;
