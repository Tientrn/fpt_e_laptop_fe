import React, { useRef, useState, useEffect } from "react";
import donateitemsApi from "../../../api/donateitemsApi";
import { Link, useNavigate } from "react-router-dom";

const ListLaptopBorrow = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLaptops = async () => {
      try {
        setLoading(true);
        const response = await donateitemsApi.getAllDonateItems();
        if (response.isSuccess) {
          setLaptops(response.data || []);
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
  }, []);

  const handleCardClick = (itemId) => {
    navigate(`/borrow/${itemId}`);
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600 mx-auto"></div>
        <p className="mt-2 text-amber-600">Loading laptops...</p>
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

  if (!laptops || laptops.length === 0) {
    return (
      <div className="p-6 text-center text-gray-600">
        <p>No laptops available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10 bg-white">
      <h1 className="text-center font-bold text-3xl p-4 text-black">
        Laptop Borrow
      </h1>

      <div className="relative max-w-[95%] mx-auto">
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
            border border-slate-600
            group"
        >
          <svg
            className="w-6 h-6 text-slate-600 group-hover:text-slate-700 transition-colors"
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

        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide scroll-smooth py-6 px-4"
        >
          <div className="flex space-x-8 w-fit">
            {laptops.map((laptop) => (
              <div
                key={laptop.itemId}
                className="flex-none w-80 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-[540px] flex flex-col cursor-pointer transform hover:scale-105"
                onClick={() => handleCardClick(laptop.itemId)}
              >
                <div className="relative h-52">
                  <img
                    src={laptop.itemImage}
                    alt={laptop.itemName}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={`absolute top-4 right-4 px-3 py-1 rounded-md text-sm font-medium text-white 
                ${
                  laptop.status === "Available" ? "bg-amber-600" : "bg-red-600"
                }`}
                  >
                    {laptop.status}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-bold text-xl mb-4 text-gray-800 line-clamp-2 min-h-[3.5rem]">
                    {laptop.itemName}
                  </h3>

                  <div className="space-y-2.5 flex-grow">
                    <div className="flex items-center text-gray-600">
                      <svg
                        className="w-5 h-5 mr-2 flex-shrink-0"
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
                        className="w-5 h-5 mr-2 flex-shrink-0"
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
                        className="w-5 h-5 mr-2 flex-shrink-0"
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
                        className="w-5 h-5 mr-2 flex-shrink-0"
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
                    <div className="flex items-center text-gray-600">
                      <svg
                        className="w-5 h-5 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="truncate">
                        Condition: {laptop.conditionItem || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Link
                      to={`/borrow/${laptop.itemId}`}
                      className="inline-flex items-center px-4 py-2 text-sm 
                           bg-slate-600 text-white rounded-full hover:bg-amber-600 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>View Details</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

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
            border border-slate-600
            group"
        >
          <svg
            className="w-6 h-6 text-slate-600 group-hover:text-slate-700 transition-colors"
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
      </div>

      <div className="flex justify-center pt-4">
        <Link
          to="/laptopborrow"
          className="px-6 py-3 rounded-full 
            bg-slate-600 text-white
            hover:bg-amber-600
            transition-all duration-300
            shadow-md hover:shadow-lg
            font-medium
            flex items-center space-x-2"
        >
          <span>Explore More Borrow Options</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default ListLaptopBorrow;
