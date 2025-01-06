import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      <main>{children}</main>
    </div>
  );
};

export default AuthLayout;
