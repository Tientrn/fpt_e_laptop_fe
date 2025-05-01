import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ListLaptopShop from "./ListLaptopShop";
import ListLaptopBorrow from "./ListLaptopBorrow";
import SponsorSection from "./SponsorSection";
import laptopImage from "../../../assets/laptopanimation.jpg";
import laptopsellImage from "../../../assets/laptopsell.jpg";
import laptopborrowImage from "../../../assets/laptopborrow.jpg";

export default function ModernHome() {
  return (
    <section className="bg-[#f8f5f2] text-[#232323] font-sans">
      {/* Hero Section - Streamlined */}
      <div className="relative min-h-[85vh] overflow-hidden bg-[#f8f5f2]">
        {/* Decorative elements - reduced size */}
        <div className="absolute inset-0 z-0">
          <motion.div
            className="absolute right-[-5%] top-[-5%] w-[35%] h-[35%] rounded-full bg-[#98c1d9] opacity-20"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 5, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-[10%] top-[25%] w-[18%] h-[18%] rounded-full bg-[#e0fbfc] opacity-20"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, -5, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute left-[-5%] bottom-[0%] w-[25%] h-[35%] rounded-full bg-[#ee6c4d] opacity-10"
            animate={{
              scale: [1, 1.08, 1],
              rotate: [0, -3, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 pt-12 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Text content in asymmetric layout */}
            <motion.div
              className="lg:col-span-5 lg:col-start-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <motion.span
                className="inline-block px-4 py-1.5 bg-[#ee6c4d]/10 text-[#ee6c4d] rounded-full text-sm font-medium tracking-wide mb-5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Elevating Student Tech
              </motion.span>

              <motion.h1
                className="text-4xl lg:text-6xl font-bold leading-tight mb-6 tracking-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Your<span className="text-[#3d5a80]">.</span>Tech
                <span className="text-[#ee6c4d]">.</span>
                <span className="block mt-1">
                  Your Future<span className="text-[#ee6c4d]">.</span>
                </span>
              </motion.h1>

              <motion.p
                className="text-lg text-[#293241]/80 mb-8 max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                Access premium laptop solutions through flexible purchase or
                borrowing options designed specifically for your academic
                journey.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <Link
                  to="/laptopshop"
                  className="px-7 py-2.5 bg-[#3d5a80] text-white font-medium rounded-full hover:bg-[#293241] transition-all shadow-md hover:shadow-lg"
                >
                  Explore Laptops
                </Link>
                <Link
                  to="/laptopborrow"
                  className="px-7 py-2.5 bg-transparent border-2 border-[#3d5a80] text-[#3d5a80] font-medium rounded-full hover:bg-[#3d5a80] hover:text-white transition-all"
                >
                  Borrow Options
                </Link>
              </motion.div>
            </motion.div>

            {/* Image with organic shapes */}
            <motion.div
              className="lg:col-span-5 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 1.2 }}
            >
              <div className="relative">
                {/* Background shape */}
                <div className="absolute -inset-3 bg-gradient-to-br from-[#e0fbfc] to-[#98c1d9] rounded-[30%_70%_70%_30%/30%_30%_70%_70%] rotate-6"></div>

                {/* Laptop image */}
                <img
                  src={laptopImage}
                  alt="Modern Laptop"
                  className="relative z-10 rounded-[20px] shadow-2xl max-w-full h-auto"
                />

                {/* Accent elements */}
                <motion.div
                  className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#ee6c4d] rounded-full opacity-20 blur-2xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.3, 0.2],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -top-10 -left-10 w-32 h-32 bg-[#3d5a80] rounded-full opacity-20 blur-2xl"
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.2, 0.25, 0.2],
                  }}
                  transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                />
              </div>

              {/* Stats overlay - more compact */}
              <motion.div
                className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-3 z-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                <div className="text-xs text-[#293241]/70 uppercase tracking-wider">
                  Students
                </div>
                <div className="text-xl font-bold text-[#3d5a80]">12,000+</div>
              </motion.div>

              <motion.div
                className="absolute -top-4 right-6 bg-white rounded-xl shadow-lg p-3 z-20"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.8 }}
              >
                <div className="text-xs text-[#293241]/70 uppercase tracking-wider">
                  Rating
                </div>
                <div className="text-xl font-bold text-[#ee6c4d] flex items-center">
                  4.9
                  <svg
                    className="w-4 h-4 ml-1 text-[#ee6c4d]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Natural curve separator */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg
            viewBox="0 0 1440 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 100L48 87.5C96 75 192 50 288 45.8C384 41.7 480 58.3 576 62.5C672 66.7 768 58.3 864 54.2C960 50 1056 50 1152 54.2C1248 58.3 1344 66.7 1392 70.8L1440 75V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </div>

      {/* Redesigned Top Sponsors Section - More compact */}
      <div className="py-16 px-4 sm:px-6 bg-white relative overflow-hidden">
        <div className="container mx-auto relative z-10 max-w-6xl">
          <div className="flex flex-col items-center mb-10">
            <motion.span
              className="inline-block px-4 py-1.5 bg-[#98c1d9]/30 text-[#3d5a80] rounded-full text-sm font-medium tracking-wide mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Our Champions
            </motion.span>

            <motion.h2
              className="text-3xl font-bold text-center mb-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Top <span className="text-[#ee6c4d]">Supporters</span>
            </motion.h2>

            <motion.p
              className="text-center text-[#293241]/70 max-w-2xl mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              We extend our gratitude to these generous individuals who have
              contributed to our mission
            </motion.p>
          </div>

          <SponsorSection />
        </div>

        {/* Background decoration - reduced size */}
        <motion.div
          className="absolute left-0 top-[20%] w-48 h-48 bg-[#e0fbfc] rounded-full opacity-40 blur-3xl"
          animate={{
            x: [0, 10, 0],
            y: [0, 15, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-0 bottom-[20%] w-64 h-64 bg-[#98c1d9] rounded-full opacity-30 blur-3xl"
          animate={{
            x: [0, -15, 0],
            y: [0, -10, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Featured Categories - More compact */}
      <div className="py-16 px-4 sm:px-6 bg-[#f8f5f2] relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Heading section */}
            <motion.div
              className="lg:col-span-4 lg:col-start-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1.5 bg-[#3d5a80]/10 text-[#3d5a80] rounded-full text-sm font-medium tracking-wide mb-4">
                Our Offerings
              </span>
              <h2 className="text-3xl font-bold mb-4 tracking-tight">
                Premium tech for every{" "}
                <span className="text-[#ee6c4d]">academic need</span>
              </h2>
              <p className="text-[#293241]/70 mb-8">
                Choose the option that best fits your needs, whether you&apos;re
                looking to purchase a premium laptop or borrow one for the
                semester.
              </p>
              <div className="hidden lg:block h-px w-20 bg-[#ee6c4d]"></div>
            </motion.div>

            {/* Services cards - more compact layout */}
            <div className="lg:col-span-8">
              <div className="space-y-6">
                <motion.div
                  className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-500"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/5 h-48 md:h-auto overflow-hidden">
                      <img
                        src={laptopsellImage}
                        alt="Laptop for Sale"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="md:w-3/5 p-6">
                      <h3 className="text-xl font-bold text-[#3d5a80] mb-3">
                        Premium Laptops
                      </h3>
                      <p className="text-[#293241]/70 mb-4">
                        Explore our selection of high-performance laptops
                        available for purchase. All models come with warranty
                        and technical support.
                      </p>
                      <Link
                        to="/laptopshop"
                        className="inline-flex items-center text-[#ee6c4d] font-medium transition-all hover:pl-2"
                      >
                        Explore options
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="ml-2 h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-500"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="flex flex-col md:flex-row-reverse">
                    <div className="md:w-2/5 h-48 md:h-auto overflow-hidden">
                      <img
                        src={laptopborrowImage}
                        alt="Laptop for Borrowing"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="md:w-3/5 p-6">
                      <h3 className="text-xl font-bold text-[#3d5a80] mb-3">
                        Laptop Borrowing
                      </h3>
                      <p className="text-[#293241]/70 mb-4">
                        Borrow laptops for your semester needs with flexible
                        timeframes and affordable rates. Perfect for temporary
                        academic projects.
                      </p>
                      <Link
                        to="/laptopborrow"
                        className="inline-flex items-center text-[#ee6c4d] font-medium transition-all hover:pl-2"
                      >
                        Learn more
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="ml-2 h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Laptops - More compact */}
      <div className="py-16 px-4 sm:px-6 bg-white relative overflow-hidden">
        {/* Background decorations - reduced size */}
        <div className="absolute right-0 bottom-0 w-[30%] h-[50%] bg-[#f8f5f2] rounded-tl-[60px] -z-0"></div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col items-center mb-10">
            <motion.span
              className="inline-block px-4 py-1.5 bg-[#ee6c4d]/10 text-[#ee6c4d] rounded-full text-sm font-medium tracking-wide mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Featured Collection
            </motion.span>

            <motion.h2
              className="text-3xl font-bold text-center mb-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Explore Our <span className="text-[#3d5a80]">Laptop Lineup</span>
            </motion.h2>

            <motion.p
              className="text-center text-[#293241]/70 max-w-2xl mb-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Browse our selection of high-performance laptops curated for
              students and professionals
            </motion.p>

            {/* Borrowing Options */}
            <div className="w-full mb-16">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#3d5a80]">
                  Borrowing Options
                </h3>
                <Link
                  to="/laptopborrow"
                  className="flex items-center text-[#ee6c4d] font-medium hover:underline"
                >
                  View all
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
              <ListLaptopBorrow />
            </div>

            {/* Laptops for Sale */}
            <div className="w-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#3d5a80]">
                  Laptops for Sale
                </h3>
                <Link
                  to="/laptopshop"
                  className="flex items-center text-[#ee6c4d] font-medium hover:underline"
                >
                  View all
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
              <ListLaptopShop />
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action - More compact */}
      <div className="relative py-16 bg-[#3d5a80] text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-[#ee6c4d] opacity-10 rounded-bl-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#98c1d9] opacity-20 rounded-tr-[100px]"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mx-auto">
            <motion.h2
              className="text-4xl font-bold mb-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              Ready to find your perfect tech companion?
            </motion.h2>
            <motion.p
              className="mb-8 text-[#e0fbfc] text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Choose from our selection of high-quality laptops tailored for
              students and professionals. Whether buying or borrowing,
              we&apos;ve got you covered.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Link
                to="/laptopshop"
                className="px-8 py-3 bg-[#ee6c4d] text-white rounded-full font-medium hover:bg-[#e0592e] transition-all shadow-lg text-center"
              >
                Shop Now
              </Link>
              <Link
                to="/laptopborrow"
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-medium hover:bg-white/10 transition-colors text-center"
              >
                Borrow a Laptop
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
