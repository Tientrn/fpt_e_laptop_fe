import React from "react";

export default function HighlightFeatureSection() {
  return (
    <div className=" mt-14 flex space-x-40 p-4 justify-start">
      <div>
        <img src="https://via.placeholder.com/150x150" alt="Feature Image" />
        <img
          src="https://via.placeholder.com/150x150"
          alt="Feature Image"
          className="relative bottom-10 left-20"
        />
      </div>
      <div>
        <h1 className="font-bold text-3xl font-serif">
          Hightlight Feature Name
        </h1>
        <p>Highlight Feature Description</p>
      </div>
    </div>
  );
}
