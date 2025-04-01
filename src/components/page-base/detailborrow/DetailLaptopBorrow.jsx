import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const DetailLaptopBorrow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [laptop, setLaptop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchLaptopDetails = async () => {
      try {
        // Mock data - replace with API call
        const mockLaptop = {
          id: id,
          name: "HP Pavilion 14",
          image: "https://example.com/laptop.jpg",
          status: "Available",
          shortDescription: "Perfect for students and professionals",
          processor: "Intel Core i7-1165G7",
          ram: "16GB DDR4",
          storage: "512GB SSD",
          display: "14-inch FHD IPS",
          graphics: "Intel Iris Xe Graphics",
          battery: "Up to 8 hours",
          ports: [
            "2 x USB 3.0",
            "1 x USB-C",
            "HDMI",
            "Headphone/Microphone combo"
          ],
          additionalFeatures: [
            "Backlit Keyboard",
            "HD Webcam",
            "Wi-Fi 6",
            "Bluetooth 5.0"
          ],
          condition: "Excellent",
          previousBorrowers: 3,
          averageRating: 4.5,
          reviews: [
            {
              user: "John Doe",
              rating: 5,
              comment: "Excellent laptop for development work",
              date: "2024-02-15"
            },
            // Add more reviews
          ]
        };
        setLaptop(mockLaptop);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load laptop details");
        setLoading(false);
      }
    };

    fetchLaptopDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-teal-600 hover:text-teal-700 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Laptops
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Left Column - Image and Basic Info */}
            <div className="md:w-1/2 p-6">
              <div className="relative">
                <img
                  src={laptop.image}
                  alt={laptop.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <span className={`absolute top-4 right-4 px-4 py-2 rounded-full text-white ${
                  laptop.status === 'Available' ? 'bg-teal-500' : 'bg-red-500'
                }`}>
                  {laptop.status}
                </span>
              </div>

              {/* Basic Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Previous Borrowers</p>
                  <p className="text-xl font-semibold text-teal-600">{laptop.previousBorrowers}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Average Rating</p>
                  <div className="flex justify-center items-center">
                    <span className="text-xl font-semibold text-teal-600">{laptop.averageRating}</span>
                    <svg className="w-5 h-5 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="md:w-1/2 p-6 bg-gray-50">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{laptop.name}</h1>
              <p className="text-gray-600 mb-6">{laptop.shortDescription}</p>

              {/* Specifications */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Technical Specifications</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Processor:</span>
                        <span className="ml-2 text-gray-600">{laptop.processor}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">RAM:</span>
                        <span className="ml-2 text-gray-600">{laptop.ram}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Storage:</span>
                        <span className="ml-2 text-gray-600">{laptop.storage}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Display:</span>
                        <span className="ml-2 text-gray-600">{laptop.display}</span>
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Graphics:</span>
                        <span className="ml-2 text-gray-600">{laptop.graphics}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Battery:</span>
                        <span className="ml-2 text-gray-600">{laptop.battery}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Condition:</span>
                        <span className="ml-2 text-gray-600">{laptop.condition}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ports & Connectivity */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Ports & Connectivity</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {laptop.ports.map((port, index) => (
                      <p key={index} className="text-sm text-gray-600">{port}</p>
                    ))}
                  </div>
                </div>

                {/* Additional Features */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Additional Features</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {laptop.additionalFeatures.map((feature, index) => (
                      <p key={index} className="text-sm text-gray-600">{feature}</p>
                    ))}
                  </div>
                </div>

                {/* Reviews Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Recent Reviews</h2>
                  <div className="space-y-4">
                    {laptop.reviews.map((review, index) => (
                      <div key={index} className="bg-white p-3 rounded-lg shadow">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-700">{review.user}</span>
                          <div className="flex items-center">
                            <span className="text-yellow-400">{review.rating}/5</span>
                            <svg className="w-4 h-4 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{review.comment}</p>
                        <p className="text-xs text-gray-400 mt-2">{review.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Borrow Button */}
              <button
                onClick={() => navigate(`/borrow/${laptop.id}/confirm`)}
                className="mt-8 w-full bg-teal-600 text-white py-3 px-6 rounded-lg
                          hover:bg-teal-700 transition-all duration-300
                          transform hover:scale-105 active:scale-95"
              >
                Request to Borrow
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailLaptopBorrow; 