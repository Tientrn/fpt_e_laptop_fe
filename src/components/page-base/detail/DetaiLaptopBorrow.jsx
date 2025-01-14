//

import React from "react";
import Breadcrumb from "../../reuse/breadscumb/Breadcrumb";
import ProductImage from "./ProductImage";
import ProductInfo from "./ProductInfo";
import ProductRelated from "./ProductRelated";
import Review from "./Review";

const DetaiLaptopBorrow = () => {
  return (
    <section>
      <Breadcrumb />
      <div className="flex justify-center space-x-24 mx-32">
        <ProductImage />
        <ProductInfo />
      </div>
      <hr />
      <div className="mb-14">
        <ProductRelated />
      </div>
      <hr />
      <div>
        <Review />
      </div>
    </section>
  );
};

export default DetaiLaptopBorrow;
