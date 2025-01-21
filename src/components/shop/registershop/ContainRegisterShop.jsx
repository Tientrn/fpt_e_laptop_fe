import React, { useState } from "react";
import HeaderRegisterShop from "./HeaderRegisterShop";
import FooterRegisterShop from "./FooterRegisterShop";
import InputForm from "./InputForm";
import Verification from "./Verification";
import ContractSign from "./ContractSign";

const ContainRegisterShop = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    taxId: "",
    shopName: "",
    phone: "",
    email: "",
    cccdImage: "",
  });

  // Hàm xử lý chuyển bước
  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  // Render component tương ứng với step hiện tại
  const renderStep = () => {
    switch (step) {
      case 1:
        return <InputForm onNext={handleNext} />;
      case 2:
        return <Verification onBack={handleBack} onNext={handleNext} />;
      case 3:
        return <ContractSign onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <HeaderRegisterShop currentStep={step} />

          {/* Main Content */}
          <div className="min-h-[600px] flex flex-col">{renderStep()}</div>

          {/* Footer */}
          <FooterRegisterShop />
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${
                  i === step
                    ? "bg-blue-600"
                    : i < step
                    ? "bg-blue-400"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContainRegisterShop;
