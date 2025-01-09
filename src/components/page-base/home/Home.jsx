//The entire home page

import React from "react";
import Hero from "./Hero";
import HighlightFeatureCard from "./HighlightFeatureCard";
import HighlightFeatureSection from "./HighlightFeatureSection";
import HighlightFeatureSection2 from "./HighlightFeatureSection_2";
import ListLaptop from "./ListLaptop";
import ListLaptopBorrow from "./ListLaptopBorrow";

export default function DefaultHomePage() {
  return (
    <section>
      <Hero />
      <div className="relative max-h-[480px] my-8">
        <div className="w-full flex justify-around items-center gap-4 p-4">
          <HighlightFeatureCard title={"Highlight feature 1"} />
          <HighlightFeatureCard title={"Highlight feature 2"} />
          <HighlightFeatureCard title={"Highlight feature 3"} />
          <HighlightFeatureCard title={"Highlight feature 4"} />
        </div>
      </div>
      <div className="px-20 py-10">
        <HighlightFeatureSection />
        <HighlightFeatureSection2 />
      </div>
      <div className="">
        <ListLaptop />
      </div>
      <div className="">
        <ListLaptopBorrow />
      </div>
    </section>
  );
}
