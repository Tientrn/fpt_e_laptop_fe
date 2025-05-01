import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import donateitemsApi from "../../../api/donateitemsApi";
import itemimagesApi from "../../../api/itemimagesApi";
import feedbackborrowApi from "../../../api/feedbackborrowApi";

const CardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [laptop, setLaptop] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllFeedbacks, setShowAllFeedbacks] = useState(false);

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
          const feedbackResponse =
            await feedbackborrowApi.getAllFeedbackBorrows();
          if (isMounted && feedbackResponse.isSuccess) {
            // Filter feedbacks for the current laptop
            const filteredFeedbacks = feedbackResponse.data.filter(
              (feedback) => feedback.itemId === parseInt(id)
            );
            setFeedbacks(filteredFeedbacks);
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

  const handlePrevImage = () => {
    const allImages = [laptop.itemImage, ...images.map((img) => img.imageUrl)];
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
    setSelectedImage(
      allImages[
        currentImageIndex === 0 ? allImages.length - 1 : currentImageIndex - 1
      ]
    );
  };

  const handleNextImage = () => {
    const allImages = [laptop.itemImage, ...images.map((img) => img.imageUrl)];
    setCurrentImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
    setSelectedImage(
      allImages[
        currentImageIndex === allImages.length - 1 ? 0 : currentImageIndex + 1
      ]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section with Thumbnails Below */}
          <div className="flex flex-col">
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-4 relative shadow-md">
              <img
                src={selectedImage}
                alt={laptop.itemName}
                className="w-full h-96 object-contain bg-white"
              />

              {/* Navigation Buttons */}
              <div className="absolute inset-y-0 left-0 flex items-center">
                <button
                  onClick={handlePrevImage}
                  className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-r transform transition-transform hover:scale-105 focus:outline-none"
                  aria-label="Previous image"
                >
                  <svg
                    className="w-6 h-6"
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
              </div>

              <div className="absolute inset-y-0 right-0 flex items-center">
                <button
                  onClick={handleNextImage}
                  className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-l transform transition-transform hover:scale-105 focus:outline-none"
                  aria-label="Next image"
                >
                  <svg
                    className="w-6 h-6"
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

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} /{" "}
                  {
                    [laptop.itemImage, ...images.map((img) => img.imageUrl)]
                      .length
                  }
                </div>
              </div>
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              <button
                onClick={() => {
                  setSelectedImage(laptop.itemImage);
                  setCurrentImageIndex(0);
                }}
                className={`w-16 h-16 rounded overflow-hidden border-2 flex-shrink-0 ${
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
              {images.map((image, index) => (
                <button
                  key={image.itemImageId}
                  onClick={() => {
                    setSelectedImage(image.imageUrl);
                    setCurrentImageIndex(index + 1);
                  }}
                  className={`w-16 h-16 rounded overflow-hidden border-2 flex-shrink-0 ${
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

            {/* Device Information Card */}
            <div className="mt-6 border border-gray-200 rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-black mb-3 flex items-center">
                <svg
                  className="w-5 h-5 text-amber-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Device Information
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <InfoItem label="Model" value={laptop.model} />
                <InfoItem label="Serial Number" value={laptop.serialNumber} />
                <InfoItem label="Color" value={laptop.color} />
                <InfoItem
                  label="Production Year"
                  value={laptop.productionYear}
                />
                <InfoItem
                  label="Operating System"
                  value={laptop.operatingSystem}
                />

                <InfoItem
                  label="Added"
                  value={formatDate(laptop.createdDate)}
                />
                <InfoItem
                  label="Last Updated"
                  value={formatDate(laptop.updatedDate)}
                />
              </div>
            </div>

            {/* Usage Statistics Card */}
            <div className="mt-4 border border-gray-200 rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-black mb-3 flex items-center">
                <svg
                  className="w-5 h-5 text-amber-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Usage Statistics
              </h2>
              <div className="flex items-center justify-center p-2">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Total Times Borrowed</p>
                  <p className="text-lg font-semibold text-amber-600">
                    {laptop.totalBorrowedCount || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-black">
                {laptop.itemName}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  laptop.status === "Available"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {laptop.status}
              </span>
            </div>

            {/* Main Specifications Card */}
            <div className="border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
              <h2 className="text-lg font-semibold text-black mb-3 flex items-center">
                <svg
                  className="w-5 h-5 text-amber-600 mr-2"
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
                Main Specifications
              </h2>
              <div className="grid grid-cols-2 gap-3">
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
                  icon="graphics"
                  label="Graphics Card"
                  value={laptop.graphicsCard}
                />
              </div>
            </div>

            {/* Connectivity Card */}
            <div className="border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
              <h2 className="text-lg font-semibold text-black mb-3 flex items-center">
                <svg
                  className="w-5 h-5 text-amber-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Connectivity
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <DetailItem icon="ports" label="Ports" value={laptop.ports} />
                <DetailItem
                  icon="battery"
                  label="Battery Life"
                  value={laptop.batteryLife}
                />
              </div>
            </div>

            {/* Description */}
            <div className="border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
              <h2 className="text-lg font-semibold text-black mb-3 flex items-center">
                <svg
                  className="w-5 h-5 text-amber-600 mr-2"
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
                Description
              </h2>
              <p className="text-black text-sm whitespace-pre-line">
                {laptop.description ||
                  `This ${laptop.itemName} is in ${
                    laptop.conditionItem
                  } condition and ready for use.
                  
Features:
• ${laptop.cpu} processor for smooth performance
• ${laptop.ram} memory for multitasking
• ${laptop.storage} storage capacity
• ${laptop.screenSize} display for comfortable viewing
${
  laptop.graphicsCard
    ? `• ${laptop.graphicsCard} for enhanced graphics performance`
    : ""
}
${
  laptop.operatingSystem ? `• Pre-installed with ${laptop.operatingSystem}` : ""
}

Perfect for students and professionals alike.`}
              </p>
            </div>

            {/* Borrow Button */}
            <div className="mt-auto">
              <button
                onClick={handleBorrowClick}
                disabled={laptop.status !== "Available"}
                className={`w-full px-6 py-3 rounded-lg text-white font-medium flex items-center justify-center ${
                  laptop.status === "Available"
                    ? "bg-slate-600 hover:bg-amber-600"
                    : "bg-gray-300 cursor-not-allowed"
                } transition-colors duration-200 shadow-sm`}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {laptop.status === "Available" ? "Borrow Now" : "Not Available"}
              </button>
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className="mt-12 border-t pt-10 w-full">
          <h2 className="text-2xl font-bold text-black mb-6 flex items-center">
            <svg
              className="w-6 h-6 text-amber-600 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            User Feedback
          </h2>

          {feedbacks.length === 0 ? (
            <div className="text-center p-8 border border-gray-200 rounded-lg bg-gray-50">
              <svg
                className="w-12 h-12 text-gray-300 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-500">
                No feedback available for this item.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center p-4 bg-amber-50 rounded-lg border border-amber-100">
                <div className="flex items-center justify-center mb-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <svg
                      key={index}
                      className={`w-5 h-5 ${
                        index <
                        Math.round(
                          feedbacks.reduce((sum, fb) => sum + fb.rating, 0) /
                            feedbacks.length
                        )
                          ? "text-amber-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-lg text-slate-800">
                  Average Rating:{" "}
                  <span className="text-amber-600 font-semibold text-xl">
                    {(
                      feedbacks.reduce((sum, fb) => sum + fb.rating, 0) /
                      feedbacks.length
                    ).toFixed(1)}{" "}
                    / 5
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Based on {feedbacks.length} user reviews
                </p>
              </div>

              <div className="space-y-4">
                {(showAllFeedbacks ? feedbacks : feedbacks.slice(0, 2)).map(
                  (fb) => (
                    <div
                      key={fb.feedbackBorrowId}
                      className="border border-gray-200 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-800 font-bold mr-2">
                          {fb.isAnonymous ? "A" : "U"}
                        </div>
                        <p className="text-sm font-medium text-black">
                          {fb.isAnonymous ? "Anonymous" : `User`}
                        </p>
                        <p className="text-xs text-gray-400 ml-auto">
                          {new Date(fb.feedbackDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center mb-2">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <svg
                            key={index}
                            className={`w-4 h-4 ${
                              index < fb.rating
                                ? "text-amber-400"
                                : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-2 text-sm text-amber-600 font-medium">
                          {fb.rating}/5
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg">
                        {fb.comments || "No additional comments provided."}
                      </p>
                    </div>
                  )
                )}
                {feedbacks.length > 2 && (
                  <div className="text-center mt-4">
                    <button
                      onClick={() => setShowAllFeedbacks(!showAllFeedbacks)}
                      className="text-sm text-amber-600 hover:underline"
                    >
                      {showAllFeedbacks ? "Hide" : "Show more"}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// DetailItem Component with Icon
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
    graphics: (
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
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    ports: (
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
          d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
        />
      </svg>
    ),
    battery: (
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
          d="M17 20H7V7a2 2 0 012-2h6a2 2 0 012 2v13zm-7-2h7M7 10h10M7 15h10"
        />
      </svg>
    ),
  };

  return (
    <div className="flex items-center p-2 bg-gray-50 rounded-lg">
      <div className="mr-2">{icons[icon]}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p
          className={`text-sm font-medium ${
            valueClassName || "text-slate-800"
          }`}
        >
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
};

// Simple Info Item without Icon
const InfoItem = ({ label, value }) => {
  return (
    <div className="flex flex-col">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-slate-800">{value || "N/A"}</p>
    </div>
  );
};

export default CardDetail;
