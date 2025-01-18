import React from "react";

const HeaderRegisterShop = ({ currentStep }) => {
  const steps = [
    { number: 1, title: "Nhập thông tin" },
    { number: 2, title: "Xác minh" },
    { number: 3, title: "Ký hợp đồng" },
  ];

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white shadow-md border-b border-gray-100">
      <img src="/logo.png" alt="Logo" className="h-12 w-auto" />

      <div className="flex items-center gap-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <span className="flex items-center">
              <span
                className={`
                w-8 h-8 rounded-full flex items-center justify-center font-semibold
                ${
                  currentStep === step.number
                    ? "bg-blue-600 text-white"
                    : currentStep > step.number
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }
              `}
              >
                {currentStep > step.number ? (
                  // Checkmark icon for completed steps
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  step.number
                )}
              </span>
              <span
                className={`ml-3 font-medium ${
                  currentStep === step.number
                    ? "text-blue-600"
                    : currentStep > step.number
                    ? "text-green-500"
                    : "text-gray-500"
                }`}
              >
                {step.title}
              </span>
            </span>

            {/* Separator line (không hiển thị cho step cuối) */}
            {index < steps.length - 1 && (
              <span
                className={`h-[2px] w-12 mx-4 ${
                  currentStep > step.number + 1
                    ? "bg-green-500"
                    : currentStep > step.number
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </header>
  );
};

export default HeaderRegisterShop;
