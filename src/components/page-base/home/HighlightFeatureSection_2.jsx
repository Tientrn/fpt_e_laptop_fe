import React from "react";

export default function HighlightFeatureSection2({ images }) {
  return (
    <div
      id="easy-borrow"
      className="container mx-auto my-8 flex flex-col md:flex-row items-center md:space-x-20 p-8"
    >
      <div className="w-full md:w-1/2 text-center md:text-left">
        <h1 className="font-bold text-4xl font-serif mb-6 text-black">
          Easy Laptop Borrowing
        </h1>
        <p className="text-gray-800 text-lg leading-relaxed">
          <span className="font-semibold text-gray-800 text-xl">
            Experience hassle-free laptop borrowing for your academic needs.
          </span>
          <span className="font-medium text-gray-600">
            Our borrowing service offers numerous benefits, including a quick
            and simple process, flexible borrowing periods, well-maintained
            devices, technical support.
          </span>
        </p>
        <button className="mt-8 bg-slate-600 text-white border-2 border-slate-600 px-8 py-3 rounded-lg hover:bg-amber-600 hover:border-amber-600 transition-all duration-300 font-semibold">
          Borrow Now
        </button>
      </div>
      <div className="relative w-full md:w-1/2 mb-8 md:mb-0">
        <img
          src={images}
          alt="Borrowing Feature"
          className="w-[300px] h-auto object-cover rounded-lg shadow-xl hover:scale-105 transition-transform duration-300"
        />
      </div>
    </div>
  );
}
