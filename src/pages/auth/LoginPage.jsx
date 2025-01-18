import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loginApi from "../../api/loginApi";
import roleApi from "../../api/roleApi";
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.showRegisterSuccess) {
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.', {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      // Xóa state sau khi hiển thị toast
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Đăng nhập
      const response = await loginApi.login({
        email,
        password,
      });
      
      console.log('Full Login Response:', response);
      
      const token = response.token || response.data?.token;
      
      if (!token) {
        throw new Error('Token không tồn tại trong response');
      }

      // Decode JWT token để lấy thông tin user
      const decodedToken = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);

      // Xác định roleId dựa trên role trong token
      let userRoleId;
      if (decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Admin') {
        userRoleId = 1;
      } else {
        userRoleId = 3; // Mặc định là Customer
      }

      // Lấy thông tin role của user dựa vào roleId
      try {
        const roleResponse = await roleApi.getRoleById(userRoleId);
        const userRole = roleResponse.data || roleResponse;
        console.log('User Role:', userRole);
        
        // Lưu thông tin user và token
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({
          email: decodedToken.email,
          username: decodedToken.username,
          userId: decodedToken.userid,
          roleId: userRoleId,
          role: userRole
        }));
        
        setError("");
        
        // Hiển thị toast thành công
        toast.success('Đăng nhập thành công!', {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Chờ toast hiển thị xong rồi mới chuyển trang
        setTimeout(() => {
          // Kiểm tra roleId và điều hướng
          if (userRoleId === 1) {
            navigate("/dashboard");
          } else {
            navigate("/");
          }
        }, 1300);
      } catch (roleError) {
        console.error("Error fetching role:", roleError);
        toast.error("Không thể xác thực quyền người dùng");
      }
      
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "Đăng nhập thất bại");
      toast.error(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-blue-100 bg-center"
      style={{
        backgroundImage: "url(https://source.unsplash.com/1600x900/?technology)",
      }}
    >
      <ToastContainer />
      <div className="w-full max-w-md p-6 bg-white bg-opacity-90 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">Welcome Back</h1>
        <p className="mt-2 text-center text-gray-600">
          Login to continue to your account
        </p>

        {error && (
          <div className="mb-4 text-sm text-center text-red-700 bg-red-100 p-2 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6">
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>

        <div className="flex items-center justify-center mt-4">
          <hr className="flex-1 border-gray-300" />
          <span className="px-2 text-gray-600 text-sm">Or login with</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <button
          className="mt-4 flex items-center justify-center w-full px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md shadow focus:outline-none"
        >
          <img
            src="https://img.icons8.com/color/24/000000/google-logo.png"
            alt="Google Logo"
            className="mr-2"
          />
          Login with Google
        </button>

        <div className="flex justify-center mt-6 gap-4">
          <a href="#" className="text-gray-600 hover:text-gray-900">
            <img
              src="https://img.icons8.com/fluency/48/000000/facebook-new.png"
              alt="Facebook Logo"
              className="h-6 w-6"
            />
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            <img
              src="https://img.icons8.com/fluency/48/000000/instagram-new.png"
              alt="Instagram Logo"
              className="h-6 w-6"
            />
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            <img
              src="https://img.icons8.com/fluency/48/000000/tiktok.png"
              alt="TikTok Logo"
              className="h-6 w-6"
            />
          </a>
        </div>

        <p className="mt-6 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-700 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
