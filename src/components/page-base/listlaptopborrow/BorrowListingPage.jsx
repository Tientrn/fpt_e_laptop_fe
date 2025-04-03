import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import SortOptions from "./SortOptions";
import donateitemsApi from "../../../api/donateitemsApi";
import CardBorrow from "./CardBorrow";

const BorrowListingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [laptops, setLaptops] = useState([]);
  const [allLaptops, setAllLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLaptops = async () => {
      try {
        setLoading(true);
        const response = await donateitemsApi.getAllDonateItems();
        if (response.isSuccess) {
          setAllLaptops(response.data || []);
          setLaptops(response.data || []);
        } else {
          setError("Failed to fetch laptops");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLaptops();
  }, []);

  useEffect(() => {
    let filteredLaptops = [...allLaptops];

    if (searchQuery) {
      filteredLaptops = filteredLaptops.filter((laptop) =>
        laptop.itemName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filteredLaptops.sort((a, b) => {
      switch (sortOption) {
        case "ram-high-to-low":
          return parseInt(b.ram) - parseInt(a.ram);
        case "ram-low-to-high":
          return parseInt(a.ram) - parseInt(b.ram);
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        default:
          return 0;
      }
    });

    setLaptops(filteredLaptops);
  }, [searchQuery, sortOption, allLaptops]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-600"></div>
        <p className="ml-4 text-black">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-black">
        <p>Lỗi: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-black">Laptop Borrow</h1>
        <div className="w-32 h-1 bg-amber-600 mx-auto rounded-full"></div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
        <SearchBar
          onSearch={setSearchQuery}
          className="w-full sm:w-2/3 mb-4 sm:mb-0"
        />
        <SortOptions onSort={setSortOption} className="w-full sm:w-1/3" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {laptops.map((laptop) => (
          <CardBorrow
            key={laptop.itemId}
            laptop={laptop}
            className="transition-transform transform hover:scale-105"
          />
        ))}
      </div>

      {laptops.length === 0 && (
        <div className="text-center text-gray-600 mt-8">
          <p>Không tìm thấy laptop phù hợp.</p>
        </div>
      )}
    </div>
  );
};

export default BorrowListingPage;
