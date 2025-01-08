import React, { useState } from "react";
import { Search, Laptop2, Star } from "lucide-react";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

const laptops = [
  {
    id: 1,
    name: "MacBook Pro 14",
    image:
      "https://images.apple.com/v/macbook-pro-14/6/images/overview/design__ctwfzpp4cda6_large.jpg",
    price: 1299,
    specs: {
      cpu: "M2 Pro",
      ram: "16GB",
      storage: "512GB SSD",
    },
    rating: 4.8,
    stock: 12,
  },
  {
    id: 2,
    name: "Dell XPS 15",
    image:
      "https://www.dell.com/sites/csimages/Merchandizing_Imagery/all/xps-15-9500-laptop.png",
    price: 1599,
    specs: {
      cpu: "Intel i9-12900H",
      ram: "32GB",
      storage: "1TB SSD",
    },
    rating: 4.7,
    stock: 8,
  },
  {
    id: 3,
    name: "ThinkPad X1 Carbon",
    image:
      "https://www.lenovo.com/medias/lenovo-laptop-thinkpad-x1-carbon-gen-9-hero.png?context=bWFzdGVyfHJvb3R8MjAxNjA3fGltYWdlL3BuZ3xoZmEvaDUxLzg4MjM2Nzg0NzM1NzYucG5nfGZiYzI2ZjA4M2EwYmVhZjQ3NzY5MmZlYmZlZmM2YjRiMjMwNzU5MTQzMWUzZTgwNzZmZTIzNzI0YjgyZDNlYmNlYjk",
    price: 1399,
    specs: {
      cpu: "Intel i7-1260P",
      ram: "16GB",
      storage: "512GB SSD",
    },
    rating: 4.6,
    stock: 15,
  },
  {
    id: 4,
    name: "ROG Zephyrus G14",
    image: "https://rog.asus.com/media/1637317112872.jpg",
    price: 1699,
    specs: {
      cpu: "AMD Ryzen 9 6900HS",
      ram: "32GB",
      storage: "1TB NVMe SSD",
    },
    rating: 4.9,
    stock: 5,
  },
  {
    id: 5,
    name: "Razer Blade 15",
    image:
      "https://www.razer.com/-/media/razer/20-articles/razer-blade-15/razor-blade-15-hero-image.jpg",
    price: 2099,
    specs: {
      cpu: "Intel i7-12800H",
      ram: "32GB",
      storage: "1TB SSD",
    },
    rating: 4.7,
    stock: 10,
  },
  {
    id: 6,
    name: "MSI GE76 Raider",
    image:
      "https://www.msi.com/img/2022/03/GE76-Raider-Ti-11th-Gen-V0-Screen-1.jpg",
    price: 2499,
    specs: {
      cpu: "Intel i9-12900HK",
      ram: "64GB",
      storage: "2TB SSD",
    },
    rating: 4.8,
    stock: 3,
  },
  {
    id: 7,
    name: "Alienware x17",
    image:
      "https://www.dell.com/sites/csimages/Merchandizing_Imagery/all/alienware-x17-hero.png",
    price: 2799,
    specs: {
      cpu: "Intel i9-12900H",
      ram: "64GB",
      storage: "2TB NVMe SSD",
    },
    rating: 4.6,
    stock: 7,
  },
  {
    id: 8,
    name: "ThinkPad X1 Carbon",
    image:
      "https://www.lenovo.com/medias/lenovo-laptop-thinkpad-x1-carbon-gen-9-hero.png?context=bWFzdGVyfHJvb3R8MjAxNjA3fGltYWdlL3BuZ3xoZmEvaDUxLzg4MjM2Nzg0NzM1NzYucG5nfGZiYzI2ZjA4M2EwYmVhZjQ3NzY5MmZlYmZlZmM2YjRiMjMwNzU5MTQzMWUzZTgwNzZmZTIzNzI0YjgyZDNlYmNlYjk",
    price: 1399,
    specs: {
      cpu: "Intel i7-1260P",
      ram: "16GB",
      storage: "512GB SSD",
    },
    rating: 4.6,
    stock: 15,
  },
];

const LaptoppurchasePage = () => {
  const [filter, setFilter] = useState("");
  const [filters, setFilters] = useState({
    laptopType: [],
    showOnly: [],
    brand: [],
    operatingSystem: [],
  });

  const handleFilterChange = (filterCategory, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (updatedFilters[filterCategory].includes(value)) {
        updatedFilters[filterCategory] = updatedFilters[filterCategory].filter(
          (item) => item !== value
        );
      } else {
        updatedFilters[filterCategory].push(value);
      }
      return updatedFilters;
    });
  };

  const filteredLaptops = laptops.filter((laptop) => {
    return (
      laptop.name.toLowerCase().includes(filter.toLowerCase()) &&
      (filters.laptopType.length === 0 ||
        filters.laptopType.some((type) =>
          laptop.specs.cpu.toLowerCase().includes(type.toLowerCase())
        )) &&
      (filters.showOnly.length === 0 ||
        filters.showOnly.some((show) =>
          laptop.specs.ram.toLowerCase().includes(show.toLowerCase())
        )) &&
      (filters.brand.length === 0 ||
        filters.brand.some((brand) =>
          laptop.name.toLowerCase().includes(brand.toLowerCase())
        ))
    );
  });

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* <div className="border-r border-white-200"></div> */}

      {/* Laptop Grid */}
      <div className="container mx-auto py-8 px-2 w-full ml-15">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-center">
            Featured Gaming Laptops
          </h1>
          <p className="text-gray-400 text-center">
            Discover our premium selection of high-performance laptops
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative">
          <div className="relative max-w-xl mx-auto">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search laptops by name..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 border-2 border-gray-700 text-white placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500 transition-all duration-200"
            />
          </div>
        </div>

        {/* Laptop Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredLaptops.map((laptop) => (
            <div
              key={laptop.id}
              className="bg-gray-800 rounded-xl border-2 border-gray-700 hover:border-white transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
            >
              <div className="p-4 h-auto">
                {/* Image Container */}
                <div className="relative mb-4">
                  <img
                    src="https://cdn.tgdd.vn/Files/2022/07/24/1450033/laptop-man-hinh-full-hd-la-gi-kinh-nghiem-chon-mu-2.jpg"
                    alt={laptop.name}
                    className="w-full h-48 object-cover rounded-lg border border-gray-600"
                  />
                  {laptop.stock < 10 && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      Only {laptop.stock} left
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{laptop.name}</h3>
                    <div className="flex items-center bg-gray-700 px-2 py-1 rounded-full">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm">{laptop.rating}</span>
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="space-y-2 bg-gray-700 p-3 rounded-md">
                    <p className="text-sm">CPU: {laptop.specs.cpu}</p>
                    <p className="text-sm">RAM: {laptop.specs.ram}</p>
                    <p className="text-sm">Storage: {laptop.specs.storage}</p>
                  </div>

                  {/* Price and Button */}
                  <div className="pt-4 flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      ${laptop.price.toLocaleString()}
                    </span>
                    <button className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200">
                      <span>Purchase</span>
                      <ShoppingCartOutlinedIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LaptoppurchasePage;
