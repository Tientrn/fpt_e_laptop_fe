import React, { useEffect, useState } from "react";
import productApi from "../../api/productApi";
import { toast } from "react-toastify";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productApi.getAllProducts();
        if (response.isSuccess) {
          setProducts(response.data);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDeleteConfirm = async (productId) => {
    try {
      await productApi.deleteProduct(productId);
      toast.success("Product deleted successfully!");
      setProducts(products.filter(product => product.productId !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleDelete = (productId) => {
    toast.info(
      <div>
        <p>Are you sure you want to delete this product?</p>
        <button onClick={() => handleDeleteConfirm(productId)} className="bg-red-500 text-white px-3 py-1 rounded mt-2">Confirm</button>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleUpdate = (updatedProduct) => {
    setProducts(products.map(p => p.productId === updatedProduct.productId ? updatedProduct : p));
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl text-center font-bold mb-12">Product Management</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.productId} className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
              <img src={product.imageProduct} alt={product.productName} className="w-full h-48 object-cover" />
              <div className="p-4 bg-gray-50 h-40 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold mb-2" style={{ maxHeight: '4rem', overflow: 'hidden' }}>{product.productName}</h2>
                  <p className="text-gray-600 mb-4">Price: {product.price.toLocaleString()}</p>
                </div>
                <div className="flex justify-between">
                  <button onClick={() => handleEdit(product)} className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
                  <button onClick={() => handleDelete(product.productId)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
