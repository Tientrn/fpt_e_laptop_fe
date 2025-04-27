import React, { useState } from "react";
import PropTypes from "prop-types";
import { FaSync, FaExternalLinkAlt } from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";

const PaymentQRCode = ({ qrCodeUrl, onRefresh, totalAmount }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    onRefresh().finally(() => {
      setIsLoading(false);
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleOpenExternalUrl = () => {
    window.open(qrCodeUrl, "_blank");
  };

  return (
    <div className="flex flex-col items-center mt-6 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-indigo-900 mb-3">
        Scan QR Code to Pay
      </h3>
      <p className="text-gray-600 text-sm mb-4">
        Amount: <span className="font-medium text-indigo-700">{formatPrice(totalAmount)}</span>
      </p>
      
      <div className="relative bg-white p-4 border border-gray-300 rounded-lg shadow-sm mb-4">
        {qrCodeUrl ? (
          <div className="flex flex-col items-center">
            <QRCodeSVG 
              value={qrCodeUrl}
              size={256}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"H"}
              includeMargin={false}
              className="w-64 h-64"
            />
            <button
              onClick={handleOpenExternalUrl}
              className="mt-4 flex items-center text-sm text-indigo-600 hover:text-indigo-800"
            >
              <span>Open Payment Page</span>
              <FaExternalLinkAlt className="ml-1 h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="w-64 h-64 flex items-center justify-center text-gray-400 text-sm">
            QR Code not available
          </div>
        )}
        
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}
      </div>
      
      <div className="flex flex-col items-center space-y-3">
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-colors duration-200"
        >
          <FaSync className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
          Refresh QR Code
        </button>
        
        <div className="text-xs text-gray-500 text-center max-w-xs">
          After scanning and completing payment, your order will be processed automatically
        </div>
      </div>
    </div>
  );
};

PaymentQRCode.propTypes = {
  qrCodeUrl: PropTypes.string,
  onRefresh: PropTypes.func.isRequired,
  totalAmount: PropTypes.number.isRequired
};

export default PaymentQRCode; 