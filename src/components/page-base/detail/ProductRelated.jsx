import React from "react";
import Card from "../../reuse/cards/Card";

const ProductRelated = () => {
  return (
    <div className="mt-6  ">
      <h1 className="text-2xl font-bold mx-32">Product Related</h1>
      <div className="flex justify-start items-center gap-6 mt-12 w-full overflow-x-auto mx-20">
        <div className="flex ">
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </div>
  );
};

export default ProductRelated;
