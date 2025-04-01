import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import productApi from "../../api/productApi";
import productimageApi from "../../api/productimageApi";
import useCartStore from "../../store/useCartStore";
import ProductFeedback from "../../components/product/ProductFeedback";

// Detail Item Component
const DetailItem = ({ icon, label, value, valueClassName = "text-gray-700" }) => {
  const icons = {
    cpu: (
      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
    ram: (
      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    storage: (
      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    ),
    screen: (
      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    condition: (
      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    status: (
      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    category: (
      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    price: (
      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
      <div className="mr-3">{icons[icon]}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className={`font-medium ${valueClassName}`}>{value || "N/A"}</p>
      </div>
    </div>
  );
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch product details
        const productResponse = await productApi.getProductById(id);
        
        if (!isMounted) return;
        
        if (productResponse.isSuccess && productResponse.data) {
          const productData = productResponse.data;
          setProduct(productData);
          
          // Set default image
          if (productData.imageProduct) {
            setSelectedImage(productData.imageProduct);
          }
          
          try {
            // Fetch product images
            const imagesResponse = await productimageApi.getProductImagesById(id);
            if (isMounted && imagesResponse.isSuccess && imagesResponse.data) {
              setImages(Array.isArray(imagesResponse.data) ? imagesResponse.data : [imagesResponse.data]);
            }
          } catch (imageError) {
            console.error("Error fetching product images:", imageError);
            // Don't set error state here, just log it
          }
        } else {
          setError("Product not found or server error");
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching product:", err);
          setError("Failed to load product. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchData();
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id]);

  const handleAddToCart = () => {
    if (product && product.quantity > 0) {
      addToCart({
        id: product.productId,
        name: product.productName,
        price: product.price,
        image: product.imageProduct,
        quantity: 1,
      });
      toast.success("Added to cart successfully!");
    } else {
      toast.error("This product is out of stock");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const isAvailable = product && product.quantity > 0;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2 h-96 bg-gray-200 rounded-lg"></div>
            <div className="w-full md:w-1/2">
              <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error</p>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/laptopshop')}
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Product Not Found</p>
          <p>The product you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate('/laptopshop')}
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* <button
          onClick={() => navigate('/laptopshop')}
          className="flex items-center text-teal-600 hover:text-teal-800 mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Shop
        </button> */}

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Column - Product Main Image */}
              <div className="w-full md:w-1/2">
                <div className="mb-4">
                  <button
                    onClick={() => navigate('/laptopshop')}
                    className="flex items-center text-teal-600 hover:text-teal-800 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Shop
                  </button>
                </div>
                <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt={product.productName}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Right Column - Product Info */}
              <div className="w-full md:w-1/2 flex flex-col">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.productName}</h1>
                
                {/* Image thumbnails - Moved here */}
                <div className="flex space-x-2 overflow-x-auto pb-4 mb-6 mt-6">
                  {product.imageProduct && (
                    <button
                      onClick={() => setSelectedImage(product.imageProduct)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 
                        ${selectedImage === product.imageProduct ? 'border-teal-500' : 'border-transparent'}`}
                    >
                      <img
                        src={product.imageProduct}
                        alt={product.productName}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  )}
                  
                  {/* Additional images thumbnails - Show max 4 */}
                  {images.slice(0, 4).map((image, index) => (
                    <button
                      key={image.productImageId || index}
                      onClick={() => setSelectedImage(image.imageUrl)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 
                        ${selectedImage === image.imageUrl ? 'border-teal-500' : 'border-transparent'}`}
                    >
                      <img
                        src={image.imageUrl}
                        alt={`View ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {isAvailable ? 'In Stock' : 'Out of Stock'}
                  </span>
                  {product.quantity > 0 && (
                    <span className="text-sm text-gray-500 ml-2">
                      {product.quantity} available
                    </span>
                  )}
                </div>

                {/* Specifications */}
                <div className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <DetailItem icon="cpu" label="CPU" value={product.cpu} />
                    <DetailItem icon="ram" label="RAM" value={product.ram} />
                    <DetailItem icon="storage" label="Storage" value={product.storage} />
                    <DetailItem icon="screen" label="Screen Size" value={`${product.screenSize}"`} />
                    <DetailItem icon="category" label="Category" value={product.categoryName} />
                    <DetailItem 
                      icon="price" 
                      label="Price" 
                      value={formatPrice(product.price)} 
                      valueClassName="text-teal-600 font-semibold" 
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="border-t pt-4 mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                  <p className="text-gray-600 text-md whitespace-pre-line">
                    {`This ${product.productName} features:
                    
Features:
• ${product.cpu || 'N/A'} processor for smooth performance
• ${product.ram || 'N/A'} memory for multitasking
• ${product.storage || 'N/A'} storage capacity
• ${product.screenSize || 'N/A'}" display for comfortable viewing

Perfect for students and professionals alike.`}
                  </p>
                </div>
                
                {/* Add to Cart Button */}
                <div className="mt-auto pt-4 flex justify-end">
                  <button
                    onClick={handleAddToCart}
                    disabled={!isAvailable}
                    className={`px-8 py-2 rounded-lg text-white font-medium
                      ${isAvailable 
                        ? 'bg-teal-600 hover:bg-teal-700' 
                        : 'bg-gray-400 cursor-not-allowed'}
                      transition-colors duration-200 shadow-md flex items-center space-x-2`}
                  >
                    <FaShoppingCart />
                    <span>{isAvailable ? 'Add to Cart' : 'Out of Stock'}</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Feedback Section */}
            <div className="mt-8 border-t pt-6">
              <ProductFeedback productId={id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
