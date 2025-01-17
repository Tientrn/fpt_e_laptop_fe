import React, { useEffect, useState } from "react";
import productApi from "../../../api/productApi";
import SearchBar from "./SearchBar";
import FiltersSidebar from "./FiltersSidebar";
import SortOptions from "./SortOptions";
import Card from "../../reuse/cards/Card";

const ProductListingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productList = await productApi.getAll();
      setProductList(productList);
    };

    fetchProducts();
  }, []);
  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Handle sorting
  const handleSort = (option) => {
    setSortOption(option);
  };

  const filteredProducts = productList.filter((product) =>
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
            <Card key={product.productId} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;
