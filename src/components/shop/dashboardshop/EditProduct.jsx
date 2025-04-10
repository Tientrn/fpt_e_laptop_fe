import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import productApi from "../../../api/productApi";

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({
    productId: "",
    productName: "",
    price: "",
    quantity: "",
    cpu: "",
    ram: "",
    storage: "",
    screenSize: "",
    categoryId: "",
    shopId: ""
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productApi.getProductById(productId);
        if (response && response.isSuccess) {
          setProduct({
            ...response.data,
            productId: response.data.productId || productId
          });
        } else {
          toast.error("Failed to fetch product details");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Error loading product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requiredFields = [
        'productId',
        'productName',
        'price',
        'quantity',
        'cpu',
        'ram',
        'storage',
        'screenSize',
        'categoryId',
        'shopId'
      ];
      
      const emptyFields = requiredFields.filter(field => !product[field]);
      if (emptyFields.length > 0) {
        toast.error(`Please fill in all required fields`);
        return;
      }

      const formData = new FormData();
      formData.append('ProductId', product.productId);
      formData.append('ProductName', product.productName);
      formData.append('Price', Number(product.price));
      formData.append('Quantity', Number(product.quantity));
      formData.append('Cpu', product.cpu);
      formData.append('Ram', product.ram);
      formData.append('Storage', product.storage);
      formData.append('ScreenSize', product.screenSize);
      formData.append('CategoryId', product.categoryId);
      formData.append('ShopId', product.shopId);

      const response = await productApi.updateProduct(product.productId, formData);
      if (response && response.isSuccess) {
        toast.success("Product updated successfully!");
        navigate("/shop/my-products");
      } else {
        toast.error(response?.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update product. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-amber-600 mb-8">Edit Product</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Product Name
            </label>
            <input
              type="text"
              name="productName"
              value={product.productName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              CPU
            </label>
            <input
              type="text"
              name="cpu"
              value={product.cpu}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              RAM
            </label>
            <input
              type="text"
              name="ram"
              value={product.ram}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Storage
            </label>
            <input
              type="text"
              name="storage"
              value={product.storage}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Screen Size
            </label>
            <input
              type="text"
              name="screenSize"
              value={product.screenSize}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={() => navigate("/shop/products")}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition duration-300"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct; 