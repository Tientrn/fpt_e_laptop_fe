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
    const currentYear = new Date().getFullYear() % 100; // Last two digits of current year
    const currentMonth = new Date().getMonth() + 1; // Months are 0-indexed
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

  // Validate shipping code (optional, can be empty)
  const validateShippingCode = (code) => {
    // Không yêu cầu shipping code phải có giá trị, có thể để trống
    return true;
  };

  // Effect hook to validate the fields whenever there's an input change
  useEffect(() => {
    const newErrors = {
      cardNumber: validateCardNumber(cardNumber)
        ? ""
        : "Card number must be 16 digits.",
      expiryDate: validateExpiryDate(expiryDate) ? "" : "Invalid expiry date.",
      cvv: validateCvv(cvv) ? "" : "CVV must be 3 or 4 digits.",
      shippingCode:
        paymentMethod === "shipCode" && !validateShippingCode(shippingCode)
          ? "Shipping code cannot be empty."
          : "",
    };

    setErrors(newErrors);
  }, [cardNumber, expiryDate, cvv, shippingCode, paymentMethod]);

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-teal-700">
          Select Payment Method
        </label>
        <div className="flex gap-4">
          <label
            className="flex items-center p-4 border border-teal-200 
            rounded-lg cursor-pointer transition-all duration-200
            hover:border-teal-400 hover:bg-teal-50
            peer-checked:border-teal-500 peer-checked:bg-teal-50"
          >
            <input
              type="radio"
              value="shipCode"
              checked={paymentMethod === "shipCode"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-4 h-4 text-teal-600 
                focus:ring-teal-500 border-teal-300"
            />
            <span className="ml-2 text-teal-700">Ship with Code</span>
          </label>

          <label
            className="flex items-center p-4 border border-teal-200 
            rounded-lg cursor-pointer transition-all duration-200
            hover:border-teal-400 hover:bg-teal-50
            peer-checked:border-teal-500 peer-checked:bg-teal-50"
          >
            <input
              type="radio"
              value="creditCard"
              checked={paymentMethod === "creditCard"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-4 h-4 text-teal-600 
                focus:ring-teal-500 border-teal-300"
            />
            <span className="ml-2 text-teal-700">Credit Card</span>
          </label>
        </div>
      </div>

      {/* Shipping Code Section */}
      {paymentMethod === "shipCode" && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-teal-700">
            Shipping Code
          </label>
          <input
            type="text"
            value={shippingCode}
            onChange={(e) => setShippingCode(e.target.value)}
            className="w-full p-3 border border-teal-200 rounded-lg
              focus:ring-2 focus:ring-teal-500 focus:border-teal-500
              placeholder-teal-300 text-teal-800
              transition-all duration-200"
            placeholder="Enter your shipping code (optional)"
          />
          {errors.shippingCode && (
            <p className="text-red-500 text-sm mt-1">{errors.shippingCode}</p>
          )}
        </div>
      )}

      {/* Credit Card Section */}
      {paymentMethod === "creditCard" && (
        <div className="space-y-4">
          {/* Card Number */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-teal-700">
              Card Number
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full p-3 border border-teal-200 rounded-lg
                focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                placeholder-teal-300 text-teal-800
                transition-all duration-200"
              placeholder="1234 5678 9012 3456"
            />
            {errors.cardNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
            )}
          </div>

          {/* Expiry Date and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-teal-700">
                Expiry Date
              </label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full p-3 border border-teal-200 rounded-lg
                  focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                  placeholder-teal-300 text-teal-800
                  transition-all duration-200"
                placeholder="MM/YY"
              />
              {errors.expiryDate && (
                <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-teal-700">
                CVV
              </label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-full p-3 border border-teal-200 rounded-lg
                  focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                  placeholder-teal-300 text-teal-800
                  transition-all duration-200"
                placeholder="123"
              />
              {errors.cvv && (
                <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
              )}
            </div>
          </div>

          {/* QR Code Section */}
          <div className="mt-8 text-center space-y-4">
            <h3 className="text-lg font-medium text-teal-800">
              Scan QR Code to Pay
            </h3>
            <div
              className="p-4 bg-white rounded-lg shadow-sm 
              border border-teal-100 inline-block"
            >
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
