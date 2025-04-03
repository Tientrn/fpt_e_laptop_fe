import React from "react";
import Hero from "./Hero";
import HighlightFeatureCard from "./HighlightFeatureCard";
import HighlightFeatureSection from "./HighlightFeatureSection";
import HighlightFeatureSection2 from "./HighlightFeatureSection_2";
import ListLaptopShop from "./ListLaptopShop";
import ListLaptopBorrow from "./ListLaptopBorrow";
import laptopsellImage from "../../../assets/laptopsell.jpg";
import laptopsellImage1 from "../../../assets/laptopsell1.jpg";
import laptopsellImage2 from "../../../assets/laptopsell2.jpg";
import laptopborrowImage from "../../../assets/laptopborrow.jpg";
import laptopborrowImage1 from "../../../assets/laptopborrow1.jpg";

export default function DefaultHomePage() {
  return (
    <section className="bg-white text-gray-800 font-sans">
      {/* Hero Section */}
      <Hero />

      {/* Highlight Feature Section */}
      <div className="flex justify-center ">
        <div className="w-full max-w-screen-lg flex justify-between items-center gap-8 px-6">
          <HighlightFeatureCard
            title="Budget-Friendly Student Laptops"
            image={laptopsellImage}
            sectionId="budget-laptops"
          />
          <HighlightFeatureCard
            title="Easy Borrowing Process"
            image={laptopborrowImage}
            sectionId="easy-borrow"
          />
        </div>
      </div>
      <div>
        <h1 className="text-4xl font-bold text-center py-6">Our Laptop Shop</h1>
        {/* Hiển thị danh sách laptop cho mượn */}
        <ListLaptopBorrow />
        {/* Hiển thị danh sách laptop để bán */}
        <ListLaptopShop />
      </div>

      {/* Highlight Feature Sections */}
      <div className="container mx-auto my-12 px-6">
        <HighlightFeatureSection
          images={{ img1: laptopsellImage1, img2: laptopsellImage2 }}
        />
        <HighlightFeatureSection2 images={laptopborrowImage1} />
      </div>
    </section>
  );
}
