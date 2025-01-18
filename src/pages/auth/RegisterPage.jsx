import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import registerApi from "../../api/registerApi";

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
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center text-gray-800">Register</h1>
      <form onSubmit={handleSubmit} className="mt-6">
        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Full Name */}
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Is Student */}
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isStudent"
              checked={formData.isStudent}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Are you a student?</span>
          </label>
        </div>

        {formData.isStudent && (
          <>
            {/* Student Code */}
            <div className="mb-4">
              <label htmlFor="studentCode" className="block text-sm font-medium text-gray-700">
                Student Code
              </label>
              <input
                type="text"
                id="studentCode"
                name="studentCode"
                value={formData.studentCode}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* University */}
            <div className="mb-4">
              <label htmlFor="university" className="block text-sm font-medium text-gray-700">
                University
              </label>
              <input
                type="text"
                id="university"
                name="university"
                value={formData.university}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Student Card Image URL */}
            <div className="mb-4">
              <label htmlFor="studentCardImage" className="block text-sm font-medium text-gray-700">
                Student Card Image URL
              </label>
              <input
                type="url"
                id="studentCardImage"
                name="studentCardImage"
                value={formData.studentCardImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Register
        </button>
      </form>

      {/* Redirect to Login */}
      <p className="mt-4 text-sm text-center text-gray-600">
        Already have an account?{" "}
        <a href="/login" className="text-blue-700 hover:underline">
          Login
        </a>
      </p>
    </div>
  );
};

export default RegisterPage;
