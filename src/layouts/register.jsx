import React from "react";

const RegisterLayout = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  );
};

export default RegisterLayout;
