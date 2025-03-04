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
            navigate("/home");
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
      className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 via-gray-800 to-blue-900"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1537498425277-c283d32ef9db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2078&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
      }}
    >
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-900/80 backdrop-blur-md rounded-xl shadow-2xl m-4 border border-gray-700">
        <h1 className="text-3xl font-bold text-center text-gray-100 mb-2">Welcome to LaptopSharing</h1>
        <p className="text-center text-gray-300 mb-6">
          Sign in to access your account
        </p>

        {error && (
          <div className="mb-4 text-sm text-center text-red-400 bg-red-900/50 p-3 rounded-lg border border-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-800/90 border border-gray-600 rounded-lg 
                       text-gray-100 placeholder-gray-400
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                       transition duration-200"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-800/90 border border-gray-600 rounded-lg 
                       text-gray-100 placeholder-gray-400
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                       transition duration-200"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 text-white bg-blue-600 hover:bg-blue-700 
                     rounded-lg transition duration-200 transform hover:scale-[1.02] 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                     focus:ring-offset-gray-900"
          >
            Login
          </button>
        </form>

        <div className="flex items-center justify-center mt-6">
          <hr className="flex-1 border-gray-600" />
          <span className="px-4 text-gray-400 text-sm">Or login with</span>
          <hr className="flex-1 border-gray-600" />
        </div>

        <button
          className="w-full flex items-center justify-center px-4 py-3 
                   text-gray-300 bg-gray-800/90 border border-gray-600 
                   rounded-lg hover:bg-gray-700 transition duration-200 
                   transform hover:scale-[1.02]"
        >
          <img
            src="https://img.icons8.com/color/24/000000/google-logo.png"
            alt="Google Logo"
            className="mr-2 h-5 w-5"
          />
          Login with Google
        </button>

        <div className="flex justify-center space-x-4">
          <a href="#" className="text-gray-400 hover:text-gray-200 transition duration-200">
            <img
              src="https://img.icons8.com/fluency/48/000000/facebook-new.png"
              alt="Facebook Logo"
              className="h-8 w-8 hover:scale-110 transition duration-200"
            />
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-200 transition duration-200">
            <img
              src="https://img.icons8.com/fluency/48/000000/instagram-new.png"
              alt="Instagram Logo"
              className="h-8 w-8 hover:scale-110 transition duration-200"
            />
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-200 transition duration-200">
            <img
              src="https://img.icons8.com/fluency/48/000000/tiktok.png"
              alt="TikTok Logo"
              className="h-8 w-8 hover:scale-110 transition duration-200"
            />
          </a>
        </div>

        <p className="text-center text-gray-400 text-sm">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-400 hover:text-blue-300 hover:underline">
            Sign up
          </a>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}
