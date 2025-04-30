import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import productApi from "../../../api/productApi";
import categoryApi from "../../../api/categoryApi";
import { jwtDecode } from "jwt-decode";
import productimageApi from "../../../api/productimageApi";
import { FaUpload, FaPlus, FaTrash } from "react-icons/fa";

const AddProduct = () => {
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    productName: "",
    quantity: "",
    price: "",
    screenSize: "",
    storage: "",
    ram: "",
    cpu: "",
    categoryId: "",
  });
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [extraImages, setExtraImages] = useState([]);
  const [extraImagesPreview, setExtraImagesPreview] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getAllCategories();
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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
    setExtraImages(files);
    
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
      setExtraImagesPreview(results);
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const id = Number(decoded.userId);
        setUserId(id);
      } catch (error) {
        console.error("❌ Token decode failed:", error);
        toast.error("Authentication error");
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const shopId = parseInt(userId);

    const form = new FormData();
    form.append("ProductName", formData.productName.trim());
    form.append("Quantity", parseInt(formData.quantity));
    form.append("Price", parseFloat(formData.price));
    form.append("ScreenSize", formData.screenSize.trim());
    form.append("Storage", formData.storage.trim());
    form.append("Ram", formData.ram.trim());
    form.append("Cpu", formData.cpu.trim());
    form.append("CategoryId", parseInt(formData.categoryId));
    form.append("ShopId", shopId);
    if (mainImage) {
      form.append("ImageFile", mainImage);
    }

    try {
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
      });
      setMainImage(null);
      setMainImagePreview(null);
      setExtraImages([]);
      setExtraImagesPreview([]);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-amber-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Add New Product</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Product Name", name: "productName", type: "text" },
                { label: "Quantity", name: "quantity", type: "number" },
                { label: "Price (VND)", name: "price", type: "number" },
                { label: "Screen Size", name: "screenSize", type: "text" },
                { label: "Storage", name: "storage", type: "text" },
                { label: "RAM", name: "ram", type: "text" },
                { label: "CPU", name: "cpu", type: "text" },
              ].map(({ label, name, type }) => (
                <div key={name} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                  />
                </div>
              ))}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
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
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Main Product Image
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageChange}
                      className="hidden"
                      id="mainImage"
                    />
                    <label
                      htmlFor="mainImage"
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                    >
                      <FaUpload className="mr-2" />
                      Choose Image
                    </label>
                  </div>
                  {mainImagePreview && (
                    <div className="relative w-24 h-24">
                      <img
                        src={mainImagePreview}
                        alt="Main product preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Additional Images (optional)
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative">
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
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                    >
                      <FaPlus className="mr-2" />
                      Add Images
                    </label>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  {extraImagesPreview.map((preview, index) => (
                    <div key={index} className="relative w-24 h-24 group">
                      <img
                        src={preview}
                        alt={`Extra image ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeExtraImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition ${
                  isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Creating Product..." : "Create Product"}
              </button>
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
      />
    </div>
  );
};

export default AddProduct;
