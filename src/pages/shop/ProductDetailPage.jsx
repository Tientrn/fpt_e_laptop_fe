import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaStar } from "react-icons/fa";
import productApi from "../../api/productApi";
import productimageApi from "../../api/productimageApi";
import useCartStore from "../../store/useCartStore";
import ProductFeedback from "../../components/product/ProductFeedback";

// Detail Item Component
const DetailItem = ({ icon, label, value, valueClassName = "text-black" }) => {
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
    category: (
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
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
        />
      </svg>
    ),
    price: (
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
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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

// Related Product Card Component
const RelatedProductCard = ({ product, onClick }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div
      onClick={onClick}
      className="border border-gray-200 rounded p-4 hover:border-amber-600 cursor-pointer transition-colors"
    >
      <img
        src={product.imageProduct || "https://via.placeholder.com/150"}
        alt={product.productName}
        className="w-full h-40 object-contain mb-2"
      />
      <h3 className="text-sm font-medium text-black truncate">
        {product.productName}
      </h3>
      <p className="text-amber-600 font-semibold text-sm">
        {formatPrice(product.price)}
      </p>
    </div>
  );
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]); // Nhận feedbacks từ ProductFeedback
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

          if (productData.imageProduct) {
            setSelectedImage(productData.imageProduct);
          }

          try {
            // Fetch product images
            const imagesResponse = await productimageApi.getProductImagesById(
              id
            );
            if (isMounted && imagesResponse.isSuccess && imagesResponse.data) {
              setImages(
                Array.isArray(imagesResponse.data)
                  ? imagesResponse.data
                  : [imagesResponse.data]
              );
            }
          } catch (imageError) {
            console.error("Error fetching product images:", imageError);
          }

          // Fetch related products
          try {
            const relatedResponse = await productApi.getRelatedProducts(id); // Placeholder API call
            if (
              isMounted &&
              relatedResponse.isSuccess &&
              relatedResponse.data
            ) {
              setRelatedProducts(
                Array.isArray(relatedResponse.data) ? relatedResponse.data : []
              );
            }
          } catch (relatedError) {
            console.error("Error fetching related products:", relatedError);
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

  // Nhận feedbacks từ ProductFeedback
  const handleFeedbacksLoaded = (feedbackData) => {
    setFeedbacks(feedbackData);
  };

  // Tính trung bình số sao
  const calculateAverageRating = () => {
    if (feedbacks.length === 0) return 0;
    const totalRating = feedbacks.reduce(
      (sum, feedback) => sum + (feedback.rating || 0),
      0
    );
    return (totalRating / feedbacks.length).toFixed(1);
  };

  const averageRating = calculateAverageRating();
  const isAvailable = product && product.quantity > 0;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2 h-96 bg-gray-200 rounded"></div>
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
        <div className="border border-gray-200 text-black p-4 rounded">
          <p className="font-medium">Error</p>
          <p>{error}</p>
          <button
            onClick={() => navigate("/laptopshop")}
            className="mt-4 px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700"
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
        <div className="border border-gray-200 text-black p-4 rounded">
          <p className="font-medium">Product Not Found</p>
          <p>
            The product you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/laptopshop")}
            className="mt-4 px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Product Main Image */}
          <div className="w-full md:w-1/2">
            <button
              onClick={() => navigate("/laptopshop")}
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
              Back to Shop
            </button>
            <div className="bg-white border border-gray-200 rounded overflow-hidden">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.productName}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-96 flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>
            <div className="flex space-x-2 mt-4 overflow-x-auto">
              {product.imageProduct && (
                <button
                  onClick={() => setSelectedImage(product.imageProduct)}
                  className={`w-16 h-16 rounded overflow-hidden border-2 
                    ${
                      selectedImage === product.imageProduct
                        ? "border-amber-600"
                        : "border-gray-200"
                    }`}
                >
                  <img
                    src={product.imageProduct}
                    alt={product.productName}
                    className="w-full h-full object-cover"
                  />
                </button>
              )}
              {images.slice(0, 4).map((image, index) => (
                <button
                  key={image.productImageId || index}
                  onClick={() => setSelectedImage(image.imageUrl)}
                  className={`w-16 h-16 rounded overflow-hidden border-2 
                    ${
                      selectedImage === image.imageUrl
                        ? "border-amber-600"
                        : "border-gray-200"
                    }`}
                >
                  <img
                    src={image.imageUrl}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="w-full md:w-1/2 flex flex-col">
            <h1 className="text-3xl font-bold text-black mb-4">
              {product.productName}
            </h1>

            <div className="flex items-center mb-4 space-x-4">
              <span
                className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                  isAvailable
                    ? "bg-amber-100 text-amber-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {isAvailable ? "In Stock" : "Out of Stock"}
              </span>
              {product.quantity > 0 && (
                <span className="text-sm text-gray-500">
                  {product.quantity} available
                </span>
              )}
              {feedbacks.length > 0 && (
                <div className="flex items-center">
                  <FaStar className="text-amber-600 mr-1" />
                  <span className="text-sm text-black font-medium">
                    {averageRating} ({feedbacks.length} reviews)
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
              <DetailItem icon="cpu" label="CPU" value={product.cpu} />
              <DetailItem icon="ram" label="RAM" value={product.ram} />
              <DetailItem
                icon="storage"
                label="Storage"
                value={product.storage}
              />
              <DetailItem
                icon="screen"
                label="Screen Size"
                value={`${product.screenSize}"`}
              />
              <DetailItem
                icon="category"
                label="Category"
                value={product.categoryName}
              />
              <DetailItem
                icon="price"
                label="Price"
                value={formatPrice(product.price)}
                valueClassName="text-amber-600 font-semibold"
              />
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-black mb-2">
                Description
              </h2>
              <p className="text-black text-sm whitespace-pre-line">
                {`This ${product.productName} features:
                
Features:
• ${product.cpu || "N/A"} processor for smooth performance
• ${product.ram || "N/A"} memory for multitasking
• ${product.storage || "N/A"} storage capacity
• ${product.screenSize || "N/A"}" display for comfortable viewing

Perfect for students and professionals alike.`}
              </p>
            </div>

            <div className="mt-auto">
              <button
                onClick={handleAddToCart}
                disabled={!isAvailable}
                className={`w-full px-6 py-3 rounded text-white font-medium
                  ${
                    isAvailable
                      ? "bg-slate-600 hover:bg-amber-600"
                      : "bg-gray-300 cursor-not-allowed"
                  }
                  transition-colors duration-200 flex items-center justify-center space-x-2`}
              >
                <FaShoppingCart />
                <span>{isAvailable ? "Add to Cart" : "Out of Stock"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <ProductFeedback
            productId={id}
            onFeedbacksLoaded={handleFeedbacksLoaded}
          />
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-black mb-4">
              Related Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <RelatedProductCard
                  key={relatedProduct.productId}
                  product={relatedProduct}
                  onClick={() =>
                    navigate(`/product/${relatedProduct.productId}`)
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
