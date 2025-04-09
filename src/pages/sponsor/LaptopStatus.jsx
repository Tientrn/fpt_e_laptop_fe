import React, { useState, useEffect } from "react";
import donateitemsApi from "../../api/donateitemsApi";
import { jwtDecode } from "jwt-decode";

const LaptopStatus = () => {
  const [laptops, setLaptops] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const id = Number(decoded.userId);
        setUserId(id);
      } catch (error) {
        console.error("❌ Token decode failed:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchLaptops = async () => {
      try {
        const response = await donateitemsApi.getAllDonateItems();
        const data = response.data || [];
        const filteredLaptops = data.filter((item) => item.userId === userId);
        setLaptops(filteredLaptops);
      } catch (error) {
        console.error("Failed to fetch donate items", error);
      }
    };

    if (userId !== null) {
      fetchLaptops();
    }
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Your Laptops Status
        </h1>

        <div className="flex flex-col gap-6">
          {laptops.map((laptop) => (
            <div
              key={laptop.itemId}
              className="bg-white rounded-xl shadow-lg p-6 w-full"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {laptop.itemName}
                </h2>
                <span
                  className={`mt-2 md:mt-0 px-4 py-1 rounded-full text-sm font-medium ${
                    laptop.status === "Available"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {laptop.status}
                </span>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <img
                  src={laptop.itemImage}
                  alt={laptop.itemName}
                  className="w-full md:w-64 h-48 object-cover rounded-lg"
                />

                <div className="space-y-2 text-gray-700 text-sm md:text-base">
                  <p>
                    <strong>CPU:</strong> {laptop.cpu}
                  </p>
                  <p>
                    <strong>RAM:</strong> {laptop.ram}
                  </p>
                  <p>
                    <strong>Storage:</strong> {laptop.storage}
                  </p>
                  <p>
                    <strong>Screen Size:</strong> {laptop.screenSize} inch
                  </p>
                  <p>
                    <strong>Condition:</strong> {laptop.conditionItem}
                  </p>
                  <p>
                    <strong>Times Borrowed:</strong> {laptop.totalBorrowedCount}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LaptopStatus;
