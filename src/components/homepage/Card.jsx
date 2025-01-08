import React from "react";

const Card = () => {
  return (
    <div className="block max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg rounded-lg border shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 mx-auto sm:mx-4">
      <img
        src="https://cdn.tgdd.vn/Files/2022/07/24/1450033/laptop-man-hinh-full-hd-la-gi-kinh-nghiem-chon-mu-2.jpg"
        alt="..."
        className="w-full h-48 object-cover sm:h-56 md:h-64 lg:h-72"
      />
      <div className="p-4 bg-gray-700">
        <h5 className="text-lg font-bold text-white">Card title</h5>
        <p className="text-white mt-2">
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </p>
      </div>
    </div>
  );
};
export default Card;
