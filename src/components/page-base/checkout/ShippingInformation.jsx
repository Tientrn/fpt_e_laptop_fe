import React, { useState } from "react";

const ShippingInformation = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value.trim()) error = "Full Name is required";
        break;
      case "address":
        if (!value.trim()) error = "Address is required";
        break;
      case "city":
        if (!value.trim()) error = "City is required";
        break;
      case "postalCode":
        if (!value.trim()) {
          error = "Postal Code is required";
        } else if (!/^\d{5}$/.test(value)) {
          error = "Postal Code must be 5 digits";
        }
        break;
      case "phone":
        if (!value.trim()) {
          error = "Phone number is required";
        } else if (!/^[0-9]{10}$/.test(value)) {
          error = "Invalid phone number format";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Invalid email format";
        }
        break;
      default:
        break;
    }
    setErrors({ ...errors, [name]: error });
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-teal-700">
            Full Name
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-teal-200 rounded-lg
              focus:ring-2 focus:ring-teal-500 focus:border-teal-500
              placeholder-teal-300 text-teal-800
              transition-all duration-200"
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-teal-700">
            Phone Number
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border border-teal-200 rounded-lg
              focus:ring-2 focus:ring-teal-500 focus:border-teal-500
              placeholder-teal-300 text-teal-800
              transition-all duration-200"
            placeholder="0123456789"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-teal-700">
          Email Address
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border border-teal-200 rounded-lg
            focus:ring-2 focus:ring-teal-500 focus:border-teal-500
            placeholder-teal-300 text-teal-800
            transition-all duration-200"
          placeholder="john@example.com"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Address Information */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-teal-700">
          Street Address
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full p-3 border border-teal-200 rounded-lg
            focus:ring-2 focus:ring-teal-500 focus:border-teal-500
            placeholder-teal-300 text-teal-800
            transition-all duration-200"
          placeholder="123 Main St"
        />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address}</p>
        )}
      </div>

      {/* City and Postal Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-teal-700">
            City
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full p-3 border border-teal-200 rounded-lg
              focus:ring-2 focus:ring-teal-500 focus:border-teal-500
              placeholder-teal-300 text-teal-800
              transition-all duration-200"
            placeholder="Your City"
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-teal-700">
            Postal Code
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className="w-full p-3 border border-teal-200 rounded-lg
              focus:ring-2 focus:ring-teal-500 focus:border-teal-500
              placeholder-teal-300 text-teal-800
              transition-all duration-200"
            placeholder="12345"
          />
          {errors.postalCode && (
            <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShippingInformation;
