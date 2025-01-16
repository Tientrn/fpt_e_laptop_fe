//

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Breadcrumb from "../../reuse/breadscumb/Breadcrumb";
import ProductImage from "./ProductImage";
import ProductInfo from "./ProductInfo";
import ProductRelated from "./ProductRelated";
import Review from "./Review";

const DetaiLaptopShop = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [laptop, setLaptop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchLaptopDetails = async () => {
      try {
        const response = await axios.get(
          `http://testapi1.somee.com/api/Products/${id}`
        ); // API lấy chi tiết laptop theo ID
        setLaptop(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching laptop details:", err);
        setError("Failed to fetch laptop details");
        setLoading(false);
      }
    };

    const fetchLaptopImages = async () => {
      try {
        const response = await axios.get(
          `http://testapi1.somee.com/api/ProductImages/${id}` // API lấy ảnh theo ID
        );
        setImages(response.data); // Giả sử response.data chứa mảng ảnh
      } catch (err) {
        console.error("Error fetching laptop images:", err);
        setError("Failed to fetch laptop images");
        setLoading(false);
      }
    };

    fetchLaptopDetails();
    fetchLaptopImages();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <section>
      <Breadcrumb />
      <div className="flex justify-center space-x-24 mx-32">
        <ProductImage images={images} />
        <ProductInfo laptop={laptop} />
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
