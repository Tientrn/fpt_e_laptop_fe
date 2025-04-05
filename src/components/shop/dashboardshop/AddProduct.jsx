import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import productApi from "../../../api/productApi"; // createProduct, createProductImage
import categoryApi from "../../../api/categoryApi"; // getAllCategories
import { jwtDecode } from "jwt-decode";
import productimageApi from "../../../api/productimageApi";

const AddProduct = () => {
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
  const [extraImages, setExtraImages] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getAllCategories();
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
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
    setMainImage(e.target.files[0]);
  };

  const handleExtraImagesChange = (e) => {
    setExtraImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const userId = Number(
      decoded[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ]
    );
    const shopId = parseInt(localStorage.getItem("shopId"));

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

    console.log("📝 FormData to send:");
    for (let pair of form.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    try {
      const response = await productApi.createProduct(form);
      console.log("✅ Product Created Response:", response);

      const newProductId = response?.data?.data?.productId;
      toast.success("Product created successfully!");

      if (newProductId && extraImages.length > 0) {
        for (const file of extraImages) {
          const imgForm = new FormData();
          imgForm.append("ImageFile", file);
          console.log("📷 Uploading extra image:", file.name);
          await productimageApi.createProductImage(newProductId, imgForm);
        }
        toast.success("Extra images uploaded!");
      }

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
      setExtraImages([]);
    } catch (err) {
      console.error("❌ Create Product Error:", err);
      if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat();
        errorMessages.forEach((msg) => toast.error(msg));
      } else {
        toast.error("Failed to create product.");
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-amber-600">
        Add New Product
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: "Product Name", name: "productName" },
          { label: "Quantity", name: "quantity", type: "number" },
          { label: "Price", name: "price", type: "number" },
          { label: "Screen Size", name: "screenSize" },
          { label: "Storage", name: "storage" },
          { label: "RAM", name: "ram" },
          { label: "CPU", name: "cpu" },
        ].map(({ label, name, type = "text" }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-black mb-1">
              {label}
            </label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Category
          </label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
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

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Main Product Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleMainImageChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Additional Images (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleExtraImagesChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition"
        >
          Submit Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
