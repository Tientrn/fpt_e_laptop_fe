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
    <section className="bg-gradient-to-b from-white to-indigo-50 text-gray-800 font-sans">
      {/* Hero Section */}
      <Hero />

      {/* Feature Cards Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-indigo-900">
            Our <span className="text-purple-600">Services</span>
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 max-w-4xl mx-auto">
            <HighlightFeatureCard
              title="Premium Student Laptops"
              image={laptopsellImage}
              sectionId="premium-laptops"
            />
            <HighlightFeatureCard
              title="Easy Borrowing Process"
              image={laptopborrowImage}
              sectionId="easy-borrow"
            />
          </div>
        </div>
      </div>

      {/* Shop Section */}
      <div className="py-16 bg-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-screen-xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-2 text-indigo-900">
              Latest <span className="text-purple-600">Laptops</span>
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Discover our selection of high-performance laptops available for purchase or borrowing
            </p>
            
            {/* Featured Borrow Laptops */}
            <div className="mb-16">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-indigo-800">Featured Borrowing Options</h3>
                <a href="/laptopborrow" className="text-purple-600 hover:text-purple-700 font-medium flex items-center">
                  View all 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
              <ListLaptopBorrow />
            </div>
            
            {/* Featured Shop Laptops */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-indigo-800">Featured Laptops for Sale</h3>
                <a href="/laptopshop" className="text-purple-600 hover:text-purple-700 font-medium flex items-center">
                  View all 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
              <ListLaptopShop />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Sections */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-screen-xl">
          <h2 className="text-3xl font-bold text-center mb-16 text-indigo-900">
            Why Choose <span className="text-purple-600">FPT E-Laptop</span>
          </h2>
          <HighlightFeatureSection
            images={{ img1: laptopsellImage1, img2: laptopsellImage2 }}
          />
          <div className="py-12"></div>
          <HighlightFeatureSection2 images={laptopborrowImage1} />
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="py-16 bg-gradient-to-r from-indigo-800 to-purple-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to find your perfect laptop?</h2>
          <p className="mb-8 max-w-2xl mx-auto text-gray-300">
            Browse our selection of high-quality laptops or explore our borrowing options tailored for students.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/laptopshop" className="px-8 py-3 bg-amber-500 text-indigo-900 rounded-lg font-semibold hover:bg-amber-400 transition-colors">
              Shop Now
            </a>
            <a href="/laptopborrow" className="px-8 py-3 bg-indigo-700 text-white rounded-lg font-semibold hover:bg-indigo-600 transition-colors">
              Borrow a Laptop
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
