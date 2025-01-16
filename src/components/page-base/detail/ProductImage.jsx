import React, { useState } from "react";

const ProductImage = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]?.imageUrl);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="w-full space-y-4">
      {/* Main Image Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg group">
        {/* Zoom Lens Overlay */}
        <div
          className={`absolute inset-0 bg-black/60 z-20 transition-opacity duration-300
          ${isZoomed ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 text-white hover:text-teal-300 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Main Image */}
        <img
          src={selectedImage}
          alt="Main Product"
          onClick={() => setIsZoomed(!isZoomed)}
          className={`h-full w-full object-contain p-4 cursor-zoom-in
            transition-all duration-500 ease-out
            ${isZoomed ? "scale-125" : "group-hover:scale-105"}
            ${isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
        />

        {/* Hover Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent 
          opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        {/* Navigation Arrows */}
        <div
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 
          opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <button
            onClick={() => {
              const currentIndex = images.findIndex(
                (img) => img.imageUrl === selectedImage
              );
              const prevIndex =
                (currentIndex - 1 + images.length) % images.length;
              setSelectedImage(images[prevIndex].imageUrl);
            }}
            className="p-2 rounded-full bg-white/80 hover:bg-white shadow-lg 
              transform transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <svg
              className="w-5 h-5 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={() => {
              const currentIndex = images.findIndex(
                (img) => img.imageUrl === selectedImage
              );
              const nextIndex = (currentIndex + 1) % images.length;
              setSelectedImage(images[nextIndex].imageUrl);
            }}
            className="p-2 rounded-full bg-white/80 hover:bg-white shadow-lg 
              transform transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <svg
              className="w-5 h-5 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Thumbnails Container */}
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(image.imageUrl)}
            className={`relative aspect-square overflow-hidden rounded-lg 
              transform transition-all duration-300 
              hover:-translate-y-1 hover:shadow-lg
              ${
                selectedImage === image.imageUrl
                  ? "ring-2 ring-teal-500 ring-offset-2 scale-95"
                  : "hover:ring-2 hover:ring-teal-400 hover:ring-offset-1"
              }`}
          >
            <img
              src={image.imageUrl}
              alt={`Thumbnail ${index + 1}`}
              className={`h-full w-full object-cover transition-all duration-300
                ${
                  selectedImage === image.imageUrl
                    ? "opacity-100 scale-110"
                    : "opacity-70 hover:opacity-100 hover:scale-105"
                }`}
            />
            {/* Active Indicator */}
            {selectedImage === image.imageUrl && (
              <div className="absolute inset-0 bg-teal-500/10 animate-pulse" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImage;
