import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import registerApi from "../../api/registerApi";
import { ToastContainer } from 'react-toastify';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    address: "",
    roleId: 3,
    isStudent: false,
    studentCode: "",
    university: "",
    studentCardImage: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Tạo object data để gửi đi
      const registerData = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        roleId: formData.roleId,
        isStudent: formData.isStudent,
        studentCode: formData.isStudent ? formData.studentCode : null,
        university: formData.isStudent ? formData.university : null,
        studentCardImage: formData.isStudent ? formData.studentCardImage : null
      };

      console.log("Sending registration data:", registerData);
      
      const response = await registerApi.register(registerData);
      console.log("Registration successful:", response);

      navigate("/login", { 
        state: { showRegisterSuccess: true },
        replace: true
      });
      
    } catch (err) {
      console.error("Registration failed:", err);
      if (err.response) {
        console.log("Error response:", err.response.data);
      }
      
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Đăng ký không thành công. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 via-gray-800 to-blue-900"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1537498425277-c283d32ef9db?ixlib=rb-4.0.3')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
      }}>
      
      {/* Main Content */}
      <div className="w-full max-w-md p-6 bg-black/50 backdrop-blur-sm rounded-lg shadow-xl m-4">
        <h2 className="text-3xl font-bold text-center text-white mb-2">Register</h2>
        <p className="text-center text-gray-300 mb-6">Create your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg 
                       text-white placeholder-gray-400
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg 
                       text-white placeholder-gray-400
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg 
                       text-white placeholder-gray-400
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg 
                       text-white placeholder-gray-400
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg 
                       text-white placeholder-gray-400
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Is Student */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isStudent"
              checked={formData.isStudent}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label className="ml-2 block text-sm text-gray-300">
              Are you a student?
            </label>
          </div>

          {/* Student Fields */}
          {formData.isStudent && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Student Code
                </label>
                <input
                  type="text"
                  name="studentCode"
                  value={formData.studentCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg 
                           text-white placeholder-gray-400
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  University
                </label>
                <input
                  type="text"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg 
                           text-white placeholder-gray-400
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Student Card Image URL
                </label>
                <input
                  type="url"
                  name="studentCardImage"
                  value={formData.studentCardImage}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg 
                           text-white placeholder-gray-400
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 
                     text-white font-semibold rounded-lg transition duration-200"
          >
            Register
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-4 text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:text-blue-300 hover:underline">
            Login
          </a>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default RegisterPage;
