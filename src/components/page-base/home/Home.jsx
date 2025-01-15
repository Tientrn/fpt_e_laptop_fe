//The entire home page

import React from "react";
import Hero from "./Hero";
import HighlightFeatureCard from "./HighlightFeatureCard";
import HighlightFeatureSection from "./HighlightFeatureSection";
import HighlightFeatureSection2 from "./HighlightFeatureSection_2";
import ListLaptop from "./ListLaptop";
import ListLaptopBorrow from "./ListLaptopBorrow";
import laptopsellImage from "../../../assets/laptopsell.jpg";
import laptopsellImage1 from "../../../assets/laptopsell1.jpg";
import laptopsellImage2 from "../../../assets/laptopsell2.jpg";
import laptopborrowImage from "../../../assets/laptopborrow.jpg";
import laptopborrowImage1 from "../../../assets/laptopborrow1.jpg";

export default function DefaultHomePage() {
  return (
    <section>
      <Hero />
      <div className="relative max-h-[480px] my-8">
        <div className="w-full flex justify-around items-center gap-4 p-4">
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
      <div className="container mx-auto my-8">
        <HighlightFeatureSection
          images={{ img1: laptopsellImage1, img2: laptopsellImage2 }}
        />
        <HighlightFeatureSection2 images={laptopborrowImage1} />
      </div>
      <div className="my-8">
        <ListLaptop />
      </div>
      <div className="my-8">
        <ListLaptopBorrow />
      </div>
    </section>
  );
}
