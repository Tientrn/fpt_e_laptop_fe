import { useRef, useState, useEffect } from "react";
import productApi from "../../../api/productApi";
import { useNavigate } from "react-router-dom";
import formatPrice from "../../../utils/formatPrice";
import PropTypes from "prop-types";
import shopApi from "../../../api/shopApi";

const ListLaptopShop = ({ limit }) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayedLaptops, setDisplayedLaptops] = useState([]);

  useEffect(() => {
    const fetchLaptops = async () => {
      try {
        setLoading(true);
        const response = await productApi.getAllProducts();
        if (response.isSuccess) {
          let laptopData = response.data || [];

          // Gọi API shop cho từng product (song song)
          const enrichedData = await Promise.all(
            laptopData.map(async (item) => {
              try {
                const shopRes = await shopApi.getShopById(item.shopId);
                return {
                  ...item,
                  shopName: shopRes.data?.shopName || "Unknown Shop",
                };
              } catch {
                return { ...item, shopName: "Unknown Shop" };
              }
            })
          );

          if (limit && limit > 0) {
            setDisplayedLaptops(enrichedData.slice(0, limit));
          } else {
            setDisplayedLaptops(enrichedData);
          }
        } else {
          setError("Failed to fetch laptops");
        }
      } catch (error) {
        setError(error.message);
        console.error("Error fetching laptops:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaptops();
  }, [limit]);

  const handleCardClick = (productId) => {
    navigate(`/laptopshop/${productId}`);
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-2 text-purple-600">Loading laptops...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!displayedLaptops || displayedLaptops.length === 0) {
    return (
      <div className="p-6 text-center text-gray-600">
        <p>No laptops available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {!limit && (
        <h1 className="text-center font-bold text-3xl p-4 text-indigo-900">
          Laptop Shop
        </h1>
      )}

      <div className="relative max-w-[95%] mx-auto">
        {displayedLaptops.length > 2 && (
          <button
            onClick={() => {
              if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollBy({
                  left: -300,
                  behavior: "smooth",
                });
              }
            }}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 
              w-10 h-10 flex items-center justify-center
              bg-white/90 rounded-full shadow-lg 
              hover:bg-white hover:shadow-xl
              transition-all duration-300 
              border border-indigo-300
              group"
          >
            <svg
              className="w-6 h-6 text-indigo-600 group-hover:text-indigo-700 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide scroll-smooth py-6 px-4"
        >
          <div className="flex space-x-8 w-fit">
            {displayedLaptops.map((laptop) => (
              <div
                key={laptop.productId}
                className="flex-none w-80 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-[540px] flex flex-col cursor-pointer transform hover:scale-105"
                onClick={() => handleCardClick(laptop.productId)}
              >
                <div className="relative h-52">
                  <img
                    src={laptop.imageProduct}
                    alt={laptop.productName}
                    className="w-full h-full object-cover"
                  />
                  {laptop.discountPercentage > 0 && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-purple-600 text-white rounded-md text-sm font-medium">
                      -{laptop.discountPercentage}%
                    </div>
                  )}
                  <div
                    className={`absolute top-4 right-4 px-3 py-1 rounded-md text-sm font-medium text-white 
                  ${laptop.quantity > 0 ? "bg-purple-600" : "bg-gray-600"}`}
                  >
                    {laptop.quantity > 0 ? "In Stock" : "Out of Stock"}
                  </div>
                  <div className="absolute top-4 left-4 px-3 py-1 bg-indigo-500 text-white rounded-md text-sm font-medium">
                    {laptop.shopName}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-bold text-xl mb-4 text-indigo-900 line-clamp-2 min-h-[3.5rem]">
                    {laptop.productName}
                  </h3>

                  <div className="space-y-2.5 flex-grow">
                    <div className="flex items-center text-gray-600">
                      <svg
                        className="w-5 h-5 mr-2 flex-shrink-0 text-indigo-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                        />
                      </svg>
                      <span className="truncate">CPU: {laptop.cpu}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg
                        className="w-5 h-5 mr-2 flex-shrink-0 text-indigo-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <span className="truncate">RAM: {laptop.ram}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg
                        className="w-5 h-5 mr-2 flex-shrink-0 text-indigo-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                        />
                      </svg>
                      <span className="truncate">
                        Storage: {laptop.storage}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg
                        className="w-5 h-5 mr-2 flex-shrink-0 text-indigo-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="truncate">
                        Screen Size: {laptop.screenSize}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4">
                    <div className="flex items-center justify-between">
                      {laptop.discountPercentage > 0 ? (
                        <div>
                          <p className="text-lg font-bold text-purple-600">
                            {formatPrice(
                              laptop.price *
                                (1 - laptop.discountPercentage / 100)
                            )}
                          </p>
                          <p className="text-sm text-gray-500 line-through">
                            {formatPrice(laptop.price)}
                          </p>
                        </div>
                      ) : (
                        <p className="text-lg font-bold text-purple-600">
                          {formatPrice(laptop.price)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {displayedLaptops.length > 2 && (
          <button
            onClick={() => {
              if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollBy({
                  left: 300,
                  behavior: "smooth",
                });
              }
            }}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 
              w-10 h-10 flex items-center justify-center
              bg-white/90 rounded-full shadow-lg 
              hover:bg-white hover:shadow-xl
              transition-all duration-300 
              border border-indigo-300
              group"
          >
            <svg
              className="w-6 h-6 text-indigo-600 group-hover:text-indigo-700 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// Prop type validation
ListLaptopShop.propTypes = {
  limit: PropTypes.number,
};

// Default prop for when limit is not provided
ListLaptopShop.defaultProps = {
  limit: 0, // 0 means show all laptops
};

export default ListLaptopShop;
