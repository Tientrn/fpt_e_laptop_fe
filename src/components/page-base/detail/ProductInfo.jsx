import React from "react";
import Rating from "../../reuse/rating/Rating";
import { AttachMoney } from "@mui/icons-material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

const ProductInfo = ({ product }) => {
  return (
    <div className="space-y-6 p-4">
      {/* Product Title and Rating */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-gray-800 leading-tight">
          {product?.name}
          <span className="text-gray-500 text-lg ml-2">{product?.specs}</span>
        </h1>
        <div className="flex items-center space-x-2">
          <Rating />
          <span className="text-sm text-gray-500">(150 đánh giá)</span>
        </div>
        <hr className="border-gray-200" />
      </div>

      {/* Price Section */}
      <div className="space-y-2">
        <h5 className="text-3xl font-bold text-red-500">
          {new Intl.NumberFormat("vi-VN").format(product?.price)} VND
        </h5>
        <h5 className="text-sm font-medium text-gray-400 line-through">
          20.200.000 VND
        </h5>
      </div>

      {/* Specifications Table */}
      <div className="bg-gray-50 rounded-xl p-4">
        <table className="w-full">
          <tbody className="divide-y divide-gray-200">
            {[
              { label: "Brand", value: "Lenovo" },
              { label: "Model Name", value: product?.name },
              { label: "Screen Size", value: '14.0" HD' },
              { label: "Hard Disk Size", value: "64GB" },
              { label: "CPU Model", value: "Intel Celeron N4020" },
              { label: "RAM Memory", value: "4GB" },
              { label: "Operating System", value: "Windows 11 in S Mode" },
              { label: "Graphics Card", value: "Intel UHD Graphics 600" },
            ].map((spec, index) => (
              <tr key={index} className="group">
                <td className="py-3 w-1/3">
                  <span className="font-medium text-gray-700 group-hover:text-teal-600 transition-colors">
                    {spec.label}
                  </span>
                </td>
                <td className="py-3 text-gray-600">
                  <span className="group-hover:text-gray-900 transition-colors">
                    {spec.value}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          type="button"
          className="flex-1 flex items-center justify-center space-x-2 
            px-6 py-3 rounded-lg bg-teal-600 text-white font-medium
            transform transition-all duration-300
            hover:bg-teal-700 hover:shadow-lg hover:-translate-y-0.5
            active:translate-y-0 active:shadow-md"
        >
          <AttachMoney className="text-2xl" />
          <span>Buy Now</span>
        </button>

        <button
          type="button"
          className="flex-1 flex items-center justify-center space-x-2
            px-6 py-3 rounded-lg bg-gray-800 text-white font-medium
            transform transition-all duration-300
            hover:bg-gray-900 hover:shadow-lg hover:-translate-y-0.5
            active:translate-y-0 active:shadow-md"
        >
          <AddShoppingCartIcon className="text-2xl" />
          <span>Add to cart</span>
        </button>
      </div>

      {/* Product Description */}
      <div className="space-y-4">
        <h4 className="text-xl font-bold text-gray-800">Về sản phẩm này</h4>
        <ul className="space-y-3 text-gray-600">
          <li className="flex space-x-3">
            <svg
              className="w-6 h-6 flex-none text-teal-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>
              ALL-DAY PERFORMANCE – Tackle your busiest days with the dual-core,
              Intel Celeron N4020.
            </span>
          </li>
          <li className="flex space-x-3">
            <svg
              className="w-6 h-6 flex-none text-teal-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>
              LONG BATTERY LIFE – Enjoy up to 8 hours of battery life for work
              and entertainment.
            </span>
          </li>
          <li className="flex space-x-3">
            <svg
              className="w-6 h-6 flex-none text-teal-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>
              HD DISPLAY – The 14.0" HD display delivers crisp visuals for all
              your tasks.
            </span>
          </li>
          <li className="flex space-x-3">
            <svg
              className="w-6 h-6 flex-none text-teal-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>
              WINDOWS 11 IN S MODE – Enhanced security and performance optimized
              for everyday tasks.
            </span>
          </li>
          <li className="flex space-x-3">
            <svg
              className="w-6 h-6 flex-none text-teal-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>
              PORTABLE DESIGN – Weighing just 1.4kg, perfect for on-the-go use.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProductInfo;
