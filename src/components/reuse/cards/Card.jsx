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
        <h5 className="text-sm font-bold text-white">Card title</h5>
        <p className="text-white text-xs mt-1">
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </p>
      </div>
    </div>
  );
};
export default Card;
