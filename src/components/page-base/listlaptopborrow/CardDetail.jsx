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
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <div className="animate-pulse max-w-6xl mx-auto w-full">
          <div className="h-8 w-32 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="flex space-x-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="w-16 h-16 bg-gray-200 rounded"></div>
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
    );
  }

  if (error || !laptop) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <div className="border border-gray-200 p-6 rounded text-black">
          <h2 className="text-xl font-semibold mb-4">
            {error || "Failed to load laptop details"}
          </h2>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 flex flex-col">
      <div className="flex-1 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section with Thumbnails Below */}
          <div className="flex flex-col">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-black hover:text-amber-600 mb-4"
            >
              <svg
                className="w-5 h-5 mr-1"
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
              Back to Listing
            </button>
            <div className="border border-gray-200 rounded overflow-hidden mb-4">
              <img
                src={selectedImage}
                alt={laptop.itemName}
                className="w-full h-96 object-contain"
              />
            </div>
            <div className="flex space-x-2 overflow-x-auto">
              <button
                onClick={() => setSelectedImage(laptop.itemImage)}
                className={`w-16 h-16 rounded overflow-hidden border-2 ${
                  selectedImage === laptop.itemImage
                    ? "border-amber-600"
                    : "border-gray-200"
                }`}
              >
                <img
                  src={laptop.itemImage}
                  alt="Main"
                  className="w-full h-full object-cover"
                />
              </button>
              {images.slice(0, 4).map((image) => (
                <button
                  key={image.itemImageId}
                  onClick={() => setSelectedImage(image.imageUrl)}
                  className={`w-16 h-16 rounded overflow-hidden border-2 ${
                    selectedImage === image.imageUrl
                      ? "border-amber-600"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={image.imageUrl}
                    alt={`View ${image.itemImageId}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-black">
                {laptop.itemName}
              </h1>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  laptop.status === "Available"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {laptop.status}
              </span>
            </div>

            {/* Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
              <DetailItem icon="cpu" label="CPU" value={laptop.cpu} />
              <DetailItem icon="ram" label="RAM" value={laptop.ram} />
              <DetailItem
                icon="storage"
                label="Storage"
                value={laptop.storage}
              />
              <DetailItem
                icon="screen"
                label="Screen Size"
                value={laptop.screenSize}
              />
              <DetailItem
                icon="condition"
                label="Condition"
                value={laptop.conditionItem}
              />
              <DetailItem
                icon="status"
                label="Status"
                value={
                  laptop.status === "Available" ? "In Stock" : "Out of Stock"
                }
                valueClassName={
                  laptop.status === "Available"
                    ? "text-amber-600 font-semibold"
                    : "text-gray-600 font-semibold"
                }
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-black mb-2">
                Description
              </h2>
              <p className="text-black text-sm whitespace-pre-line">
                {laptop.description ||
                  `This ${laptop.itemName} is in ${laptop.conditionItem} condition and ready for use.
                  
Features:
• ${laptop.cpu} processor for smooth performance
• ${laptop.ram} memory for multitasking
• ${laptop.storage} storage capacity
• ${laptop.screenSize} display for comfortable viewing

Perfect for students and professionals alike.`}
              </p>
            </div>

            {/* Borrow Button */}
            <div className="mt-auto">
              <button
                onClick={handleBorrowClick}
                disabled={laptop.status !== "Available"}
                className={`w-full px-6 py-3 rounded text-white font-medium ${
                  laptop.status === "Available"
                    ? "bg-slate-600 hover:bg-amber-600"
                    : "bg-gray-300 cursor-not-allowed"
                } transition-colors duration-200`}
              >
                {laptop.status === "Available" ? "Borrow Now" : "Not Available"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// DetailItem Component
const DetailItem = ({ icon, label, value, valueClassName = "" }) => {
  const icons = {
    cpu: (
      <svg
        className="w-5 h-5 text-amber-600"
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
    ),
    ram: (
      <svg
        className="w-5 h-5 text-amber-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
    storage: (
      <svg
        className="w-5 h-5 text-amber-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
        />
      </svg>
    ),
    screen: (
      <svg
        className="w-5 h-5 text-amber-600"
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
    ),
    condition: (
      <svg
        className="w-5 h-5 text-amber-600"
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
    ),
    status: (
      <svg
        className="w-5 h-5 text-amber-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  return (
    <div className="flex items-center p-2">
      <div className="mr-2">{icons[icon]}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className={`text-sm font-medium ${valueClassName}`}>
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default CardDetail;
