import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import donateitemsApi from '../../../api/donateitemsApi';
import itemimagesApi from '../../../api/itemimagesApi';

const CardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [laptop, setLaptop] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch laptop details
        const laptopResponse = await donateitemsApi.getDonateItemById(id);
        if (laptopResponse.isSuccess) {
          setLaptop(laptopResponse.data);
          setSelectedImage(laptopResponse.data.itemImage);
        }

        // Fetch additional images using correct endpoint
        const imagesResponse = await itemimagesApi.getItemImagesById(id);
        if (imagesResponse.isSuccess) {
          setImages(imagesResponse.data);
        }
      } catch (error) {
        setError(error.message);
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error || !laptop) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        <p>{error || 'Failed to load laptop details'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto mb-6">
        <button
          onClick={() => navigate('/laptopborrow')}
          className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 transition-colors"
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
          <span className="font-medium"> Choose another laptop</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="aspect-w-16 aspect-h-12 rounded-lg overflow-hidden">
              <img
                src={selectedImage}
                alt={laptop.itemName}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {/* Main image thumbnail */}
              <button
                onClick={() => setSelectedImage(laptop.itemImage)}
                className={`flex-none w-24 h-24 rounded-lg overflow-hidden border-2 
                  ${selectedImage === laptop.itemImage ? 'border-teal-500' : 'border-transparent'}`}
              >
                <img
                  src={laptop.itemImage}
                  alt="Main"
                  className="w-full h-full object-cover"
                />
              </button>
              
              {/* Additional images thumbnails */}
              {images.map((image) => (
                <button
                  key={image.itemImageId}
                  onClick={() => setSelectedImage(image.imageUrl)}
                  className={`flex-none w-24 h-24 rounded-lg overflow-hidden border-2 
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
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{laptop.itemName}</h1>
              <div className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium
                ${laptop.status === 'Available' ? 'bg-teal-100 text-teal-800' : 'bg-red-100 text-red-800'}`}>
                {laptop.status}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem icon="cpu" label="CPU" value={laptop.cpu} />
                <DetailItem icon="ram" label="RAM" value={laptop.ram} />
                <DetailItem icon="storage" label="Storage" value={laptop.storage} />
                <DetailItem icon="screen" label="Screen Size" value={laptop.screenSize} />
                <DetailItem icon="condition" label="Condition" value={laptop.conditionItem} />
              </div>
            </div>

            <div className="border-t pt-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 whitespace-pre-line">{laptop.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for detail items
const DetailItem = ({ icon, label, value }) => {
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
  };

  return (
    <div className="flex items-center space-x-3 text-gray-700">
      <div className="flex-shrink-0">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icons[icon]}
        </svg>
      </div>
      <div>
        <span className="text-sm text-gray-500">{label}:</span>
        <span className="ml-1 font-medium">{value}</span>
      </div>
    </div>
  );
};

export default CardDetail; 