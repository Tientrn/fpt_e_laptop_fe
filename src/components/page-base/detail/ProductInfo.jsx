import React from "react";
import Rating from "../../reuse/rating/Rating";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { AttachMoney } from "@mui/icons-material";

const ProductInfo = () => {
  return (
    <div className="">
      <div>
        <h1 className="text-xl font-semibold">
          Lenovo IdeaPad 1 14 Laptop, 14.0" HD Display, Intel Celeron N4020, 4GB
          RAM, 64GB Storage, Intel UHD Graphics 600, Win 11 in S Mode, Cloud
          Grey
        </h1>
        <p>
          <Rating />
        </p>
        <hr />
      </div>
      <div>
        <h5 className="text-2xl font-bold text-red-500">14.900.000 VND</h5>
        <h5 className="text-sm font-bold text-gray-400 line-through">
          20.200.000 VND
        </h5>
        <table className="border-separate border-spacing-4">
          <tr>
            <td className="font-bold">
              <span>Brand</span>
            </td>
            <td>
              <span>Lenovo</span>
            </td>
          </tr>
          <tr>
            <td className="font-bold">
              <span>Model Name</span>
            </td>
            <td>
              <span>IdeaPad 1 14</span>
            </td>
          </tr>
          <tr>
            <td className="font-bold">
              <span>Screen Size</span>
            </td>
            <td>
              <span>14.0" HD</span>
            </td>
          </tr>
          <tr>
            <td className="font-bold">
              <span>Hard Disk Size</span>
            </td>
            <td>
              <span>64GB</span>
            </td>
          </tr>
          <tr>
            <td className="font-bold">
              <span>CPU Model</span>
            </td>
            <td>
              <span>Intel Celeron N4020</span>
            </td>
          </tr>
          <tr>
            <td className="font-bold">
              <span>RAM Memory</span>
            </td>
            <td>
              <span>4GB</span>
            </td>
          </tr>
          <tr>
            <td className="font-bold">
              <span>Operating System</span>
            </td>
            <td>
              <span>Windows 11 in S Mode</span>
            </td>
          </tr>
          <tr>
            <td className="font-bold">
              <span>Graphics Card</span>
            </td>
            <td>
              <span>Intel UHD Graphics 600</span>
            </td>
          </tr>
        </table>
        <div className="flex space-x-4 m-4">
          {/* Buy Now Button */}
          <button
            type="button"
            className=" flex flex-row items-center justify-center rounded-md border border-transparent bg-gray-700 px-4 py-2 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2  focus:ring-offset-2"
          >
            <AttachMoney />
            Buy now
          </button>

          {/* Add to Bag Button */}
          <button
            type="submit"
            className=" items-center justify-center rounded-md border border-transparent bg-gray-700 px-4 py-2 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2  focus:ring-offset-2"
          >
            <AddShoppingCartIcon />
            Add to bag
          </button>
        </div>
        <hr />
      </div>
      <div>
        <h4 className="font-bold">About this item</h4>
        <ul class="list-disc pl-5 space-y-2">
          <li>
            <span>
              ALL-DAY PERFORMANCE – Tackle your busiest days with the dual-core,
              Intel Celeron N4020—the perfect processor for performance, power
              consumption, and value (3).
            </span>
          </li>
          <li>
            <span>
              LONG BATTERY LIFE – Enjoy up to 8 hours of battery life for work,
              study, and entertainment without worrying about charging.
            </span>
          </li>
          <li>
            <span>
              HD DISPLAY – The 14.0" HD display delivers crisp visuals for all
              your tasks, from browsing to streaming.
            </span>
          </li>
          <li>
            <span>
              WINDOWS 11 IN S MODE – With enhanced security and performance
              optimized for everyday tasks, Windows 11 in S Mode ensures a
              seamless experience.
            </span>
          </li>
          <li>
            <span>
              PORTABLE DESIGN – Weighing just 1.4kg, the Lenovo IdeaPad 1 14 is
              lightweight and easy to carry for on-the-go use.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProductInfo;
