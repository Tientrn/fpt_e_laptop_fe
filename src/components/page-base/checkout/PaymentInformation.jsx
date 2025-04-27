import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaCreditCard, FaMoneyBillWave, FaQrcode } from "react-icons/fa";

const PaymentInformation = ({ onSelectPaymentMethod, selectedMethod }) => {
  const PAYMENT_METHODS = [
    { id: "shipCode", name: "Ship COD", icon: <FaMoneyBillWave className="w-4 h-4" /> },
    { id: "payos", name: "Payos QR", icon: <FaQrcode className="w-4 h-4" /> },
    { id: "creditCard", name: "Credit Card", icon: <FaCreditCard className="w-4 h-4" /> },
  ];

  const [paymentMethod, setPaymentMethod] = useState("shipCode");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [shippingCode, setShippingCode] = useState("");

  const [errors, setErrors] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    shippingCode: "",
  });

  // Validate card number (Luhn Algorithm)
  const validateCardNumber = (number) => {
    const regex = /^[0-9]{16}$/;
    return regex.test(number);
  };

  // Validate expiry date (MM/YY)
  const validateExpiryDate = (date) => {
    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    const [month, year] = date.split("/");
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    return (
      regex.test(date) &&
      (parseInt(year) > currentYear ||
        (parseInt(year) === currentYear && parseInt(month) >= currentMonth))
    );
  };

  // Validate CVV (3 digits for most cards, 4 digits for American Express)
  const validateCvv = (cvv) => {
    const regex = /^(?!000)[0-9]{3,4}$/;
    return regex.test(cvv);
  };

  useEffect(() => {
    const newErrors = {
      cardNumber: validateCardNumber(cardNumber)
        ? ""
        : "Card number must be 16 digits.",
      expiryDate: validateExpiryDate(expiryDate) ? "" : "Invalid expiry date.",
      cvv: validateCvv(cvv) ? "" : "CVV must be 3 or 4 digits.",
    };

    setErrors(newErrors);
  }, [cardNumber, expiryDate, cvv]);

  const handleSelectMethod = (methodId) => {
    if (onSelectPaymentMethod) {
      onSelectPaymentMethod(methodId);
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-black">Payment Information</h2>

      {/* Payment Method Selection */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Select Payment Method
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.id}
              className={`p-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${
                selectedMethod === method.id
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-300 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50"
              }`}
              onClick={() => handleSelectMethod(method.id)}
            >
              {method.icon}
              <span className="font-medium">{method.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Payment Method Information */}
      <div className="mt-4 text-sm text-gray-600">
        {selectedMethod === "shipCode" && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="mb-2 font-medium text-blue-700">Cash On Delivery</p>
            <p>
              You will pay when you receive your order. Please prepare the exact amount for a smoother transaction.
            </p>
          </div>
        )}

        {selectedMethod === "payos" && (
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="mb-2 font-medium text-green-700">Payos QR Payment</p>
            <p>
              A QR code will be generated for you to scan with your mobile banking app. The payment will be processed instantly.
            </p>
          </div>
        )}

        {selectedMethod === "creditCard" && (
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="mb-2 font-medium text-purple-700">Credit Card</p>
            <p>
              Your card details will be securely processed. We accept Visa, Mastercard, and JCB.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

PaymentInformation.propTypes = {
  onSelectPaymentMethod: PropTypes.func.isRequired,
  selectedMethod: PropTypes.string.isRequired
};

export default PaymentInformation;
