import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import donateitemsApi from "../../../api/donateitemsApi";
import itemimagesApi from "../../../api/itemimagesApi";

const CardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [laptop, setLaptop] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch laptop details with timeout handling
        const laptopResponse = await Promise.race([
          donateitemsApi.getDonateItemById(id),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timed out")), 15000)
          ),
        ]);

        if (!isMounted) return;

        if (laptopResponse.isSuccess) {
          setLaptop(laptopResponse.data);
          setSelectedImage(laptopResponse.data.itemImage);

          // Only fetch images if laptop data is successful
          const imagesResponse = await itemimagesApi.getItemImagesById(id);
          if (isMounted && imagesResponse.isSuccess) {
            setImages(imagesResponse.data);
          }
        }
      } catch (error) {
        if (isMounted) {
          setError(
            error.message === "Request timed out"
              ? "Connection timeout. Please try again."
              : "Failed to load data. Please check your connection."
          );
          console.error("Error fetching data:", error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id]);

  const handleBorrowClick = () => {
    if (!isLoggedIn) {
      navigate("/login", {
        state: { from: `/borrow/${id}` },
      });
      return;
    }
    navigate(`/borrow-request/create/${id}`);
  };

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-gray-200 rounded mb-6"></div>
          <div className="bg-white rounded-xl p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-96 bg-gray-200 rounded-lg"></div>
                <div className="flex space-x-4">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="w-24 h-24 bg-gray-200 rounded-lg"
                    ></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div key={n} className="h-6 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !laptop) {
    return (
      <div className="h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {error || "Failed to load laptop details"}
          </h2>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4 sm:p-6 lg:p-8 flex flex-col">
      {/* Main Content - Reduced size with max-width */}
      <div className="flex-1 overflow-hidden bg-white rounded-xl shadow-lg max-w-6xl mx-auto w-full">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-auto p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Image Section with Back Button inside */}
              <div className="flex flex-col">
                {/* Back Button */}
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 transition-colors mb-2 self-start"
                >
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
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  <span className="font-medium">Back to Listing</span>
                </button>
                
                {/* Image - Adjusted to fill container */}
                <div className="rounded-lg overflow-hidden flex-1 bg-white relative">
                  <img
                    src={selectedImage}
                    alt={laptop.itemName}
                    className="absolute inset-0 w-full h-full object-contain p-4"
                  />
                </div>
              </div>

              {/* Details Section - With thumbnails and borrow button */}
              <div className="flex flex-col h-full">
                {/* Title and Status - Changed to horizontal layout */}
                <div className="flex justify-between items-center mb-7">
                  <h1 className="text-2xl font-bold text-gray-900">{laptop.itemName}</h1>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium
                    ${laptop.status === 'Available' ? 'bg-teal-100 text-teal-800' : 'bg-red-100 text-red-800'}`}>
                    {laptop.status}
                  </div>
                </div>

                {/* Thumbnail Gallery - Added mb-6 */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {/* Main image thumbnail */}
                  <button
                    onClick={() => setSelectedImage(laptop.itemImage)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 
                      ${selectedImage === laptop.itemImage ? 'border-teal-500' : 'border-transparent'}`}
                  >
                    <img
                      src={laptop.itemImage}
                      alt="Main"
                      className="w-full h-full object-cover"
                    />
                  </button>
                  
                  {/* Additional images thumbnails - Show max 4 */}
                  {images.slice(0, 4).map((image) => (
                    <button
                      key={image.itemImageId}
                      onClick={() => setSelectedImage(image.imageUrl)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 
                        ${selectedImage === image.imageUrl ? 'border-teal-500' : 'border-transparent'}`}
                    >
                      <img
                        src={image.imageUrl}
                        alt={`View ${image.itemImageId}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                {/* Specifications - Added mb-6 */}
                <div className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <DetailItem icon="cpu" label="CPU" value={laptop.cpu} />
                    <DetailItem icon="ram" label="RAM" value={laptop.ram} />
                    <DetailItem icon="storage" label="Storage" value={laptop.storage} />
                    <DetailItem icon="screen" label="Screen Size" value={laptop.screenSize} />
                    <DetailItem icon="condition" label="Condition" value={laptop.conditionItem} />
                    <DetailItem 
                      icon="status" 
                      label="Status" 
                      value={laptop.status === 'Available' ? 'In Stock' : 'Out of Stock'} 
                      valueClassName={laptop.status === 'Available' ? 'text-teal-600 font-semibold' : 'text-red-600 font-semibold'}
                    />
                  </div>
                </div>

                {/* Description - Added mb-6 */}
                <div className="border-t pt-4 mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                  <p className="text-gray-600 text-md whitespace-pre-line">
                    {laptop.description || `This ${laptop.itemName} is in ${laptop.conditionItem} condition and ready for use.
                    
Features:
• ${laptop.cpu} processor for smooth performance
• ${laptop.ram} memory for multitasking
• ${laptop.storage} storage capacity
• ${laptop.screenSize} display for comfortable viewing

Perfect for students and professionals alike.`}
                  </p>
                </div>
                
                {/* Borrow Button - Right aligned */}
                <div className="mt-auto pt-4 flex justify-end">
                  <button
                    onClick={handleBorrowClick}
                    disabled={laptop.status !== 'Available'}
                    className={`px-8 py-2 rounded-lg text-white font-medium
                      ${laptop.status === 'Available' 
                        ? 'bg-teal-600 hover:bg-teal-700' 
                        : 'bg-gray-400 cursor-not-allowed'}
                      transition-colors duration-200 shadow-md`}
                  >
                    {laptop.status === 'Available' ? 'Borrow Now' : 'Not Available'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Cập nhật DetailItem component để hỗ trợ custom className cho value
const DetailItem = ({ icon, label, value, valueClassName = "" }) => {
  const icons = {
    cpu: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
      />
    ),
    ram: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    ),
    storage: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
      />
    ),
    screen: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    ),
    condition: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
    status: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    ),
  };

  return (
    <div className="flex items-center space-x-3 text-gray-700">
      <div className="flex-shrink-0">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {icons[icon]}
        </svg>
      </div>
      <div>
        <span className="text-sm text-gray-500">{label}:</span>
        <span className={`ml-1 font-medium text-base ${valueClassName}`}>{value}</span>
      </div>
    </div>
  );
};

export default CardDetail;
