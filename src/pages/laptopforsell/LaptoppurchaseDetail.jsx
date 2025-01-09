import React from "react";
import { useParams, useNavigate } from "react-router-dom";

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

const LaptoppurchaseDetail = () => {
  const { id } = useParams(); // Get laptop ID from URL params
  const navigate = useNavigate();
  const laptop = laptops.find((l) => l.id === parseInt(id)); // Find laptop by ID

  if (!laptop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-xl">Laptop not found!</p>
      </div>
    );
  }

  const handleBuyNow = () => {
    alert(`You are buying ${laptop.name}!`);
  };

  const handleAddToCart = () => {
    alert(`${laptop.name} added to your cart!`);
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Laptop Details */}
      <div className="w-2/3 p-8">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-400 hover:underline mb-4"
        >
          Back to Products
        </button>
        <div className="flex space-x-8">
          <img
            src={laptop.image}
            alt={laptop.name}
            className="w-96 h-auto object-cover rounded-lg border border-gray-600"
          />
          <div>
            <h1 className="text-4xl font-bold mb-4">{laptop.name}</h1>
            <div className="flex items-center space-x-2 mb-4">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-lg">{laptop.rating}</span>
            </div>
            <div className="space-y-3 bg-gray-800 p-4 rounded-lg">
              <p className="text-sm">CPU: {laptop.specs.cpu}</p>
              <p className="text-sm">RAM: {laptop.specs.ram}</p>
              <p className="text-sm">Storage: {laptop.specs.storage}</p>
            </div>
            <p className="mt-6 text-gray-400">
              <strong>Stock:</strong> {laptop.stock} units available
            </p>
          </div>
        </div>
      </div>

      {/* Purchase Section */}
      <div className="w-1/3 bg-gray-900 p-8">
        <div className="space-y-4">
          <p className="text-3xl font-bold">${laptop.price.toLocaleString()}</p>
          <button
            onClick={handleBuyNow}
            className="w-full bg-red-600 text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-red-700 transition-colors duration-200"
          >
            <CreditCardOutlinedIcon className="w-5 h-5" />
            <span>Buy Now</span>
          </button>
          <button
            onClick={handleAddToCart}
            className="w-full bg-gray-700 text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-600 transition-colors duration-200"
          >
            <ShoppingCartOutlinedIcon className="w-5 h-5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LaptoppurchaseDetail;
