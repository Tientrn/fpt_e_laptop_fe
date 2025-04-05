import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`/api/products/shop/${user.userId}`);
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) fetchProducts();
  }, [user?.userId]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-amber-600">My Products</h1>
      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-slate-200 rounded-lg p-4 shadow hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-black">
                {product.name}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {product.description}
              </p>
              <p className="text-sm text-gray-800 mt-2 font-medium">
                Price: ${product.price}
              </p>
              <div className="mt-4 flex gap-2">
                <button className="text-blue-600 hover:text-blue-800">
                  <FaEdit />
                </button>
                <button className="text-red-600 hover:text-red-800">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProducts;
