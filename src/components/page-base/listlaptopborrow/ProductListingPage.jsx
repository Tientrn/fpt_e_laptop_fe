import React, { useState } from "react";
import SearchBar from "./SearchBar";
import FiltersSidebar from "./FiltersSidebar";
import SortOptions from "./SortOptions";
import CardBorrow from "../../reuse/cards/CardBorrow";

const ProductListingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");

  // Sample product data
  const products = [
    {
      id: 1,
      name: "HP Pavilion 14",
      price: "15,000,000",
      image: "hp_pavilion.jpg",
      shortDescription: "Laptop mỏng nhẹ, cấu hình mạnh.",
    },
    {
      id: 2,
      name: "Asus ZenBook 13",
      price: "18,000,000",
      image: "asus_zenbook.jpg",
      shortDescription: "Laptop với thiết kế tinh tế và hiệu năng cao.",
    },
    {
      id: 3,
      name: "Lenovo ThinkPad X1",
      price: "22,000,000",
      image: "lenovo_thinkpad.jpg",
      shortDescription: "Máy tính xách tay chuyên nghiệp.",
    },
    {
      id: 4,
      name: "Lenovo ThinkPad X1",
      price: "22,000,000",
      image: "lenovo_thinkpad.jpg",
      shortDescription: "Máy tính xách tay chuyên nghiệp.",
    },
    {
      id: 5,
      name: "Lenovo ThinkPad X1",
      price: "22,000,000",
      image: "lenovo_thinkpad.jpg",
      shortDescription: "Máy tính xách tay chuyên nghiệp.",
    },
    {
      id: 6,
      name: "Lenovo ThinkPad X1",
      price: "22,000,000",
      image: "lenovo_thinkpad.jpg",
      shortDescription: "Máy tính xách tay chuyên nghiệp.",
    },
    {
      id: 7,
      name: "Lenovo ThinkPad X1",
      price: "22,000,000",
      image: "lenovo_thinkpad.jpg",
      shortDescription: "Máy tính xách tay chuyên nghiệp.",
    },
  ];

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Handle sorting
  const handleSort = (option) => {
    setSortOption(option);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProducts = filteredProducts.sort((a, b) => {
    if (sortOption === "price-low-to-high") return a.price - b.price;
    if (sortOption === "price-high-to-low") return b.price - a.price;
    return 0;
  });

  return (
    <div className="flex">
      <FiltersSidebar />
      <div className="w-3/4 p-6">
        <SearchBar onSearch={handleSearch} />
        <SortOptions onSort={handleSort} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product) => (
            <CardBorrow key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;
