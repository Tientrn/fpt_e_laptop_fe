import React from "react";

const HeaderRegisterShop = ({ currentStep }) => {
  const steps = [
    { number: 1, title: "Nhập thông tin" },
    { number: 2, title: "Xác minh" },
    { number: 3, title: "Ký hợp đồng" },
  ];

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-800 shadow-lg">
      <div className="flex items-center space-x-8">
        <span className="self-center text-xl font-bold whitespace-nowrap text-white">
          <div className="flex items-center">
            <i className="fas fa-laptop mr-2 text-2xl"></i>
            <h1 className="text-lg text-white font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              FPT E-Laptop
            </h1>
          </div>
        </span>

        <div className="bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20">
          <span className="text-white font-medium">Đăng ký trở thành Shop</span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <span className="flex items-center">
              <span
                className={`
                w-8 h-8 rounded-full flex items-center justify-center font-semibold
                ${
                  currentStep === step.number
                    ? "bg-white text-emerald-600"
                    : currentStep > step.number
                    ? "bg-emerald-300 text-white"
                    : "bg-emerald-400/50 text-white/70"
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
                    ? "text-white"
                    : currentStep > step.number
                    ? "text-emerald-100"
                    : "text-emerald-200"
                }`}
              >
                {step.title}
              </span>
            </span>
            {index < steps.length - 1 && (
              <span
                className={`h-[2px] w-12 mx-4 ${
                  currentStep > step.number + 1
                    ? "bg-emerald-300"
                    : currentStep > step.number
                    ? "bg-white"
                    : "bg-emerald-400/30"
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
