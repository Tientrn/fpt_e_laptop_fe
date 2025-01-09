import React from "react";
import Card from "../../reuse/cards/Card";

const ListLaptopBorrow = () => {
  return (
    <div className="p-6 space-y-10">
      <h1 className="text-center font-bold text-3xl p-4 font-serif">
        Laptops Borrow
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
      <div className="flex justify-center ">
        <a
          href="/laptop-shop"
          className=" text-center px-4 py-2 rounded-full bg-red-500 text-white hover:bg-gray-600  hover:text-black transition-colors duration-300"
        >
          Explore Laptop Borrow
        </a>
      </div>
    </div>
  );
};

export default ListLaptopBorrow;
