import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import productApi from "../../../api/productApi";
import categoryApi from "../../../api/categoryApi";
import shopApi from "../../../api/shopApi";
import { jwtDecode } from "jwt-decode";
import productimageApi from "../../../api/productimageApi";
import { FaUpload, FaPlus, FaTrash, FaLaptop, FaMemory, FaMicrochip, FaRuler } from "react-icons/fa";
import { MdStorage, MdCategory, MdPriceCheck, MdDescription, MdColorLens } from "react-icons/md";
import { BsImages, BsBatteryFull, BsUsbDrive } from "react-icons/bs";
import { GiProcessor } from "react-icons/gi";
import { TbBrandWindows } from "react-icons/tb";
import { AiOutlineFieldTime } from "react-icons/ai";
import PropTypes from 'prop-types';

// Move the FormSection component outside of the main component
const FormSection = memo(({ title, active, icon, onClick, children }) => (
  <div className={`mb-8 transition-all duration-300 ${active ? 'opacity-100' : 'opacity-60'}`}>
    <div 
      className={`flex items-center space-x-2 cursor-pointer py-3 px-4 mb-6 rounded-lg hover:bg-indigo-50 transition-all ${active ? 'bg-indigo-100/70 text-indigo-700 shadow-sm' : 'border-l-4 border-transparent'}`}
      onClick={onClick}
    >
      <div className={`p-2 rounded-md ${active ? 'bg-indigo-200/70 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
        {icon}
      </div>
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
    <div className={`transition-all duration-500 ${active ? 'block' : 'hidden'}`}>
      {children}
    </div>
  </div>
));

// Fix linter error by setting display name
FormSection.displayName = 'FormSection';

FormSection.propTypes = {
  title: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  icon: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

// Create a memo'd text input component to prevent unnecessary rerenders
const InputField = memo(({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = true, 
  type = "text", 
  icon,
  maxLength,
  showCount = false,
  min,
  className = "",
  prefix
}) => (
  <div className="space-y-1">
    <label className="flex text-sm font-medium text-gray-700 mb-1 items-center">
      {icon && <span className="mr-2 text-indigo-500">{icon}</span>}
      {label}
    </label>
    <div className={`relative ${className}`}>
      {prefix && (
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">{prefix}</span>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
        min={min}
        className={`w-full ${prefix ? 'pl-10' : 'px-4'} py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:border-indigo-300 shadow-sm bg-white bg-opacity-80 backdrop-blur-sm`}
        placeholder={placeholder}
      />
    </div>
    {showCount && maxLength && (
      <p className="text-xs text-gray-500 mt-1">{value?.length || 0}/{maxLength} characters</p>
    )}
  </div>
));

InputField.displayName = 'InputField';

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.string,
  icon: PropTypes.node,
  maxLength: PropTypes.string,
  showCount: PropTypes.bool,
  min: PropTypes.string,
  className: PropTypes.string,
  prefix: PropTypes.node
};

// Create a textarea component 
const TextAreaField = memo(({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = true,
  rows = 6,
  maxLength,
  showCount = false
}) => (
  <div className="space-y-1">
    <label className="flex text-sm font-medium text-gray-700 items-center justify-between">
      <span>{label}</span>
      {showCount && maxLength && (
        <span className="text-xs text-gray-500">{value?.length || 0}/{maxLength}</span>
      )}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      rows={rows}
      maxLength={maxLength}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:border-indigo-300 shadow-sm bg-white bg-opacity-80 backdrop-blur-sm"
      placeholder={placeholder}
    ></textarea>
  </div>
));

TextAreaField.displayName = 'TextAreaField';

TextAreaField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  rows: PropTypes.number,
  maxLength: PropTypes.string,
  showCount: PropTypes.bool
};

const AddProduct = () => {
  const [userId, setUserId] = useState(null);
  const [shopId, setShopId] = useState(null);
  const [formData, setFormData] = useState({
    productName: "",
    quantity: "",
    price: "",
    screenSize: "",
    storage: "",
    ram: "",
    cpu: "",
    categoryId: "",
    color: "",
    model: "",
    battery: "",
    operatingSystem: "",
    ports: "",
    productionYear: "",
    graphicsCard: "",
    description: "",
  });
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [extraImages, setExtraImages] = useState([]);
  const [extraImagesPreview, setExtraImagesPreview] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Lấy token và decode để xác định user
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const decodedToken = jwtDecode(token);
        const id = Number(decodedToken.userId);
        setUserId(id);

        // Lấy thông tin shop của user
        const shopsRes = await shopApi.getAllShops();
        if (!shopsRes || !shopsRes.isSuccess) {
          throw new Error("Failed to fetch shops");
        }

        const userShop = shopsRes.data.find(
          (shop) => shop.userId === id
        );
        if (!userShop) {
          throw new Error("Shop not found for this user");
        }

        setShopId(userShop.shopId);
        console.log("Found user's shop ID:", userShop.shopId);
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
        toast.error(error.message || "Failed to load user data");
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getAllCategories();
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
        toast.error("Failed to load categories");
      }
    };

    fetchUserData();
    fetchCategories();
  }, []);

  // Further prevent unnecessary renders by using stable functions
  const handleInputChange = useCallback((e) => {
    const { name, value, type } = e.target;
    
    // Add validation for productName - max length 100 characters
    if (name === 'productName' && value.length > 100) {
      return;
    }
    
    // Add validation for description - max length 1000 characters
    if (name === 'description' && value.length > 1000) {
      return;
    }
    
    // Use functional state update to prevent unnecessary re-renders
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleNumberInputChange = useCallback((e) => {
    const { name, value } = e.target;
    // Only allow positive numbers
    if (value === '' || Number(value) >= 0) {
      // Use functional state update to prevent unnecessary re-renders
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  }, []);

  const handlePriceInputChange = useCallback((e) => {
    const value = e.target.value.replace(/,/g, '');
    
    // Only allow positive numbers
    if (value === '' || (Number(value) >= 0 && /^\d*$/.test(value))) {
      // Use functional state update to prevent unnecessary re-renders
      setFormData(prevData => ({
        ...prevData,
        price: value
      }));
    }
  }, []);

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtraImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setExtraImages([...extraImages, ...files]);
    
    const previews = files.map(file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
      });
    });

    Promise.all(previews).then(results => {
      setExtraImagesPreview([...extraImagesPreview, ...results]);
    });
  };

  const removeExtraImage = (index) => {
    const newImages = [...extraImages];
    const newPreviews = [...extraImagesPreview];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setExtraImages(newImages);
    setExtraImagesPreview(newPreviews);
  };

  const isFormValid = () => {
    const requiredFields = [
      'productName', 'quantity', 'price', 'screenSize', 'storage', 
      'ram', 'cpu', 'categoryId', 'color', 'model', 'battery', 
      'operatingSystem', 'ports', 'productionYear', 'graphicsCard', 'description'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field] || (typeof formData[field] === 'string' && !formData[field].trim())) {
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`);
        return false;
      }
    }
    
    if (!mainImage) {
      toast.error("Main product image is required");
      return false;
    }
    
    return true;
  };

  const formatPrice = (price) => {
    if (!price) return '';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!shopId) {
      toast.error("Shop information not found. Please try again or contact support.");
      return;
    }
    
    // Validate all required fields
    if (!isFormValid()) {
      return;
    }
    
    setIsSubmitting(true);

    const form = new FormData();
    // Map form fields to API fields with proper capitalization
    form.append("ProductName", formData.productName.trim());
    form.append("Quantity", parseInt(formData.quantity) || 1);
    // Remove commas from price before parsing
    form.append("Price", parseFloat(formData.price.toString().replace(/,/g, '')) || 0);
    form.append("ScreenSize", formData.screenSize.trim());
    form.append("Storage", formData.storage.trim());
    form.append("Ram", formData.ram.trim());
    form.append("Cpu", formData.cpu.trim());
    form.append("CategoryId", parseInt(formData.categoryId));
    form.append("ShopId", shopId);
    
    // Required API fields
    form.append("Color", formData.color.trim());
    form.append("Model", formData.model.trim());
    form.append("Battery", formData.battery.trim());
    form.append("OperatingSystem", formData.operatingSystem.trim());
    form.append("Ports", formData.ports.trim());
    form.append("ProductionYear", formData.productionYear.trim());
    form.append("GraphicsCard", formData.graphicsCard.trim());
    form.append("Description", formData.description.trim());
    
    if (mainImage) {
      form.append("ImageFile", mainImage);
    }

    try {
      console.log("Creating product with ShopId:", shopId);
      const response = await productApi.createProduct(form);
      const newProductId = response?.data?.data?.productId;
      toast.success("Product created successfully!");

      if (newProductId && extraImages.length > 0) {
        for (const file of extraImages) {
          const imgForm = new FormData();
          imgForm.append("ImageFile", file);
          await productimageApi.createProductImage(newProductId, imgForm);
        }
        toast.success("Extra images uploaded!");
      }

      // Reset form
      setFormData({
        productName: "",
        quantity: "",
        price: "",
        screenSize: "",
        storage: "",
        ram: "",
        cpu: "",
        categoryId: "",
        color: "",
        model: "",
        battery: "",
        operatingSystem: "",
        ports: "",
        productionYear: "",
        graphicsCard: "",
        description: "",
      });
      setMainImage(null);
      setMainImagePreview(null);
      setExtraImages([]);
      setExtraImagesPreview([]);
      setActiveSection('basic');
    } catch (err) {
      console.error("❌ Create Product Error:", err);
      if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat();
        errorMessages.forEach((msg) => toast.error(msg));
      } else {
        toast.error("Failed to create product.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Memoize section toggle handlers
  const handleSectionToggle = useCallback((section) => {
    setActiveSection(section);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100 backdrop-blur-sm bg-white/90">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute -inset-[10px] blur-xl bg-gradient-to-r from-indigo-300 to-purple-300 opacity-30"></div>
              <div className="absolute right-0 bottom-0 w-64 h-64 rounded-full bg-indigo-400 opacity-20 blur-2xl transform translate-x-1/3 translate-y-1/3"></div>
              <div className="absolute left-0 top-0 w-96 h-96 rounded-full bg-purple-400 opacity-10 blur-3xl transform -translate-x-1/3 -translate-y-1/3"></div>
            </div>
            <div className="relative z-10">
              <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center">
                <div className="p-2 bg-white/20 rounded-lg mr-3">
                  <FaLaptop className="text-white" />
                </div>
                Add New Product
              </h1>
              <p className="text-indigo-100 mt-2 ml-12">Fill out the form below to add a new laptop to your inventory</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <FormSection 
                  title="Basic Information" 
                  active={activeSection === 'basic'} 
                  icon={<MdCategory className="text-xl" />}
                  onClick={() => handleSectionToggle('basic')}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
                    <div className="col-span-2">
                      <InputField
                        label="Product Name"
                        name="productName"
                        value={formData.productName}
                        onChange={handleInputChange}
                        placeholder="Enter product name"
                        maxLength="100"
                        showCount={true}
                      />
                    </div>
                    
                    <div>
                      <label className="flex text-sm font-medium text-gray-700 mb-1 items-center">
                        <span className="mr-2 text-indigo-500"><MdCategory /></span>
                        Category
                      </label>
                      <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:border-indigo-300 shadow-sm bg-white bg-opacity-80 backdrop-blur-sm appearance-none"
                        style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}
                      >
                        <option value="">-- Select Category --</option>
                        {Array.isArray(categories) &&
                          categories.map((cat) => (
                            <option key={cat.categoryId} value={cat.categoryId}>
                              {cat.categoryName}
                            </option>
                          ))}
                      </select>
                    </div>
                    
                    <InputField
                      label="Model"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      placeholder="e.g. MacBook Pro, ThinkPad X1"
                    />
                    
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <InputField
                          label="Price (VND)"
                          name="price"
                          value={formatPrice(formData.price)}
                          onChange={handlePriceInputChange}
                          placeholder="0"
                          prefix="₫"
                          icon={<MdPriceCheck />}
                        />
                      </div>
                      
                      <div className="flex-1">
                        <InputField
                          label="Quantity"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleNumberInputChange}
                          type="number"
                          placeholder="1"
                          min="1"
                        />
                      </div>
                    </div>
                    
                    <InputField
                      label="Color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      placeholder="e.g. Black, Silver, Space Gray"
                      icon={<MdColorLens />}
                    />
                    
                    <InputField
                      label="Production Year"
                      name="productionYear"
                      value={formData.productionYear}
                      onChange={handleInputChange}
                      placeholder="e.g. 2023"
                      icon={<AiOutlineFieldTime />}
                    />
                  </div>
                </FormSection>

                <FormSection 
                  title="Technical Specifications" 
                  active={activeSection === 'specs'} 
                  icon={<FaMicrochip className="text-xl" />}
                  onClick={() => handleSectionToggle('specs')}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
                    <InputField
                      label="Screen Size"
                      name="screenSize"
                      value={formData.screenSize}
                      onChange={handleInputChange}
                      placeholder="e.g. 15.6 inch"
                      icon={<FaRuler />}
                    />

                    <InputField
                      label="Storage"
                      name="storage"
                      value={formData.storage}
                      onChange={handleInputChange}
                      placeholder="e.g. 512GB SSD"
                      icon={<MdStorage />}
                    />

                    <InputField
                      label="RAM"
                      name="ram"
                      value={formData.ram}
                      onChange={handleInputChange}
                      placeholder="e.g. 16GB DDR4"
                      icon={<FaMemory />}
                    />

                    <InputField
                      label="CPU"
                      name="cpu"
                      value={formData.cpu}
                      onChange={handleInputChange}
                      placeholder="e.g. Intel Core i7"
                      icon={<FaMicrochip />}
                    />
                    
                    <InputField
                      label="Graphics Card"
                      name="graphicsCard"
                      value={formData.graphicsCard}
                      onChange={handleInputChange}
                      placeholder="e.g. NVIDIA GeForce RTX 3050"
                      icon={<GiProcessor />}
                    />
                    
                    <InputField
                      label="Battery"
                      name="battery"
                      value={formData.battery}
                      onChange={handleInputChange}
                      placeholder="e.g. 4-cell, 54Wh"
                      icon={<BsBatteryFull />}
                    />
                    
                    <InputField
                      label="Operating System"
                      name="operatingSystem"
                      value={formData.operatingSystem}
                      onChange={handleInputChange}
                      placeholder="e.g. Windows 11 Home"
                      icon={<TbBrandWindows />}
                    />
                    
                    <InputField
                      label="Ports"
                      name="ports"
                      value={formData.ports}
                      onChange={handleInputChange}
                      placeholder="e.g. 2x USB-C, 2x USB-A, HDMI"
                      icon={<BsUsbDrive />}
                    />
                  </div>
                </FormSection>
                
                <FormSection 
                  title="Product Description" 
                  active={activeSection === 'description'} 
                  icon={<MdDescription className="text-xl" />}
                  onClick={() => handleSectionToggle('description')}
                >
                  <div className="p-2">
                    <TextAreaField
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={6}
                      maxLength="1000"
                      showCount={true}
                      placeholder="Enter a detailed description of the product"
                    />
                  </div>
                </FormSection>
              </div>

              <div className="md:col-span-1">
                <FormSection 
                  title="Product Images" 
                  active={activeSection === 'images' || activeSection === 'basic'} 
                  icon={<BsImages className="text-xl" />}
                  onClick={() => handleSectionToggle('images')}
                >
                  <div className="space-y-6 p-2">
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Main Product Image
                      </label>
                      <div className="flex flex-col items-center space-y-4">
                        {mainImagePreview ? (
                          <div className="relative w-full h-48 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-lg overflow-hidden border-2 border-indigo-300 shadow-md transition-all hover:shadow-lg hover:scale-[1.01]">
                            <img
                              src={mainImagePreview}
                              alt="Main product preview"
                              className="w-full h-full object-contain"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setMainImage(null);
                                setMainImagePreview(null);
                              }}
                              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition transform hover:scale-110 shadow-md"
                            >
                              <FaTrash className="text-xs" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-full">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleMainImageChange}
                              className="hidden"
                              id="mainImage"
                              required
                            />
                            <label
                              htmlFor="mainImage"
                              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-indigo-300 rounded-lg cursor-pointer hover:bg-indigo-50 transition-all bg-gradient-to-r from-gray-50 to-indigo-50/30 shadow-sm hover:shadow-md group"
                            >
                              <div className="p-3 rounded-full bg-indigo-100 group-hover:bg-indigo-200 transition-all mb-2">
                                <FaUpload className="text-2xl text-indigo-500 group-hover:text-indigo-600" />
                              </div>
                              <span className="text-sm text-gray-700 font-medium group-hover:text-indigo-700">Upload main image</span>
                              <span className="text-xs text-gray-500 mt-1">Click or drag & drop</span>
                            </label>
                            {!mainImage && <p className="text-xs text-red-500 mt-1">Main image is required</p>}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="flex text-sm font-medium text-gray-700 justify-between items-center">
                        <span>Additional Images</span>
                        <span className="text-xs bg-indigo-100 text-indigo-800 py-1 px-2 rounded-full">{extraImagesPreview.length} added</span>
                      </label>
                      
                      <div className="w-full">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleExtraImagesChange}
                          className="hidden"
                          id="extraImages"
                        />
                        <label
                          htmlFor="extraImages"
                          className="flex items-center justify-center w-full py-3 border-2 border-dashed border-indigo-300 rounded-lg cursor-pointer hover:bg-indigo-50 transition bg-gray-50 group"
                        >
                          <div className="p-1 rounded-full bg-indigo-100 mr-2 group-hover:bg-indigo-200 transition-all">
                            <FaPlus className="text-indigo-500 group-hover:text-indigo-600" />
                          </div>
                          <span className="text-sm text-gray-600 group-hover:text-indigo-700">Add more images</span>
                        </label>
                      </div>
                      
                      {extraImagesPreview.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-3 mt-3">
                          {extraImagesPreview.map((preview, index) => (
                            <div key={index} className="relative group">
                              <div className="h-20 w-full overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md hover:border-indigo-300 hover:scale-[1.03]">
                                <img
                                  src={preview}
                                  alt={`Extra image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeExtraImage(index)}
                                className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                              >
                                <FaTrash className="text-xs" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </FormSection>
                
                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all transform hover:translate-y-[-2px] shadow-lg relative overflow-hidden ${
                      isSubmitting ? "bg-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    }`}
                  >
                    <span className="relative z-10">
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating Product...
                        </span>
                      ) : (
                        "Create Product"
                      )}
                    </span>
                    {!isSubmitting && (
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute -inset-[10px] blur-xl bg-gradient-to-r from-indigo-300 to-purple-300 opacity-30"></div>
                        <div className="absolute right-0 bottom-0 w-24 h-24 rounded-full bg-indigo-400 opacity-20 blur-2xl transform translate-x-1/3 translate-y-1/3"></div>
                        <div className="absolute left-0 top-0 w-24 h-24 rounded-full bg-purple-400 opacity-10 blur-2xl transform -translate-x-1/3 -translate-y-1/3"></div>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </div>
  );
};

export default AddProduct;
