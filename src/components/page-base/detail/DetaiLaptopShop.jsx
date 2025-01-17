import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import productApi from "../../../api/productApi";
import productImageApi from "../../../api/productImageApi";

import Breadcrumb from "../../reuse/breadscumb/Breadcrumb";
import ProductImage from "./ProductImage";
import ProductInfo from "./ProductInfo";
import ProductRelated from "./ProductRelated";
import Review from "./Review";

const DetaiLaptopShop = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [productImage, setProductImage] = useState(null);

  useEffect(() => {
    const fetchProductbyid = async () => {
      const productdetail = await productApi.getProductById(productId);

      setProduct(productdetail);
    };
    const fetchProductImagebyid = async () => {
      const productImageDetail = await productImageApi.getProductImageById(
        productId
      );

      setProductImage(productImageDetail);
    };
    fetchProductbyid();
    fetchProductImagebyid();
  }, []);
  return (
    <section>
      <Breadcrumb />
      <div className="flex justify-center space-x-24 mx-32">
        <ProductImage productImage={productImage || []} />
        <ProductInfo product={product} />
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

export default DetaiLaptopShop;
