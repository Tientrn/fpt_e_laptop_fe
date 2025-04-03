import React, { useState, useEffect } from "react";

const PaymentInformation = () => {
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

  return (
    <div className="space-y-6 bg-white p-6 rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-black">Payment Information</h2>

      {/* Payment Method Selection */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Select Payment Method
        </label>
        <div className="flex gap-4">
          <button
            className={`p-3 rounded-lg border text-black transition-all ${
              paymentMethod === "shipCode"
                ? "border-amber-600"
                : "border-gray-300"
            }`}
            onClick={() => setPaymentMethod("shipCode")}
          >
            Ship with Code
          </button>

          <button
            className={`p-3 rounded-lg border text-black transition-all ${
              paymentMethod === "creditCard"
                ? "border-amber-600"
                : "border-gray-300"
            }`}
            onClick={() => setPaymentMethod("creditCard")}
          >
            Credit Card
          </button>
        </div>
      </div>

      {/* Shipping Code Section */}
      {paymentMethod === "shipCode" && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Shipping Code
          </label>
          <input
            type="text"
            value={shippingCode}
            onChange={(e) => setShippingCode(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600"
            placeholder="Enter your shipping code (optional)"
          />
        </div>
      )}

      {/* Credit Card Section */}
      {paymentMethod === "creditCard" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Card Number
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600"
              placeholder="1234 5678 9012 3456"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                placeholder="MM/YY"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                CVV
              </label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                placeholder="123"
              />
            </div>
          </div>

          {/* QR Code Section */}
          <div className="mt-8 text-center space-y-4">
            <h3 className="text-lg font-medium text-black">
              Scan QR Code to Pay
            </h3>
            <div className="p-4 bg-gray-100 rounded-lg shadow-sm border border-gray-300 inline-block">
              <img
                src="/path/to/your-qr-code-image.png"
                alt="QR Code"
                className="w-48 h-48 object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentInformation;
