import React from "react";

const Card = () => {
  return (
    <div className="block w-60 rounded-lg border shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 mx-auto sm:mx-2">
      <img
        src="https://cdn.tgdd.vn/Files/2022/07/24/1450033/laptop-man-hinh-full-hd-la-gi-kinh-nghiem-chon-mu-2.jpg"
        alt="..."
        className="w-full h-48 object-cover aspect-square"
      />
      <div className="p-2 bg-gray-700">
        <h5 className="text-2xl font-bold text-red-500">14.900.000 VND</h5>
        <h5 className="text-sm font-bold text-white line-through">
          20.200.000 VND
        </h5>
        <a href="" className="text-white text-xs mt-1 hover:text-blue-300">
          Laptop Asus ExpertBook B1 B1402CVA-NK0177W (Core™ i7-1355U | 16GB |
          512GB | Intel® UHD Graphics | 14.0inch FHD | Win11 | Đen)
        </a>
      </div>
    </div>
  );
};
export default Card;
