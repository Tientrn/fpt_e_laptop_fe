import { Navigate } from "react-router-dom";

export default function SponsorRegisterGuard({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user.role;

  if (!token) {
    // Chưa đăng nhập → chuyển về trang đăng ký tài khoản
    return <Navigate to="/register" replace />;
  }

  if (userRole === "Student") {
    // Đúng role student → cho phép truy cập
    return children;
  }

  // Đã đăng nhập nhưng không phải student → unauthorized
  return <Navigate to="/unauthorized" replace />;
} 