import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaStar } from "react-icons/fa";
import productApi from "../../api/productApi";
import productimageApi from "../../api/productimageApi";
import useCartStore from "../../store/useCartStore";
import ProductFeedback from "../../components/product/ProductFeedback";
import shopApi from "../../api/shopApi";

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
    model: (
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
          d="M12 6v6l4 2"
        />
      </svg>
    ),
    color: (
      <svg
        className="w-5 h-5 text-amber-600"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <circle cx="10" cy="10" r="8" />
      </svg>
    ),
    graphicsCard: (
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
          d="M9 14l6-4-6-4v8z"
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
        <rect
          width="16"
          height="10"
          x="2"
          y="7"
          rx="2"
          ry="2"
          strokeWidth="2"
        />
        <path d="M22 11v2" strokeWidth="2" />
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
          d="M4 7h16M4 17h16M4 12h8"
        />
      </svg>
    ),
    operatingSystem: (
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
          d="M12 4v16m8-8H4"
        />
      </svg>
    ),
    productionYear: (
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
          d="M12 8v4l3 3"
        />
        <circle cx="12" cy="12" r="9" strokeWidth="2" />
      </svg>
    ),
    shop: (
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
          d="M3 9l9-6 9 6v6a9 9 0 11-18 0V9z"
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
      className="bg-white border border-gray-200 rounded-xl overflow-hidden 
                 cursor-pointer transform transition duration-300 
                 hover:scale-105 hover:shadow-md group"
    >
      {/* Ảnh zoom riêng bên trong */}
      <div className="w-full h-52 overflow-hidden">
        <img
          src={product.imageProduct}
          alt={product.productName}
          className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
        />
      </div>

      {/* Nội dung sản phẩm */}
      <div className="p-4 space-y-1">
        <h3 className="text-base font-semibold text-black truncate">
          {product.productName}
        </h3>

        <div className="text-sm text-gray-600 space-y-0.5">
          <p>
            <span className="font-medium">CPU:</span> {product.cpu}
          </p>
          <p>
            <span className="font-medium">RAM:</span> {product.ram}
          </p>
          <p>
            <span className="font-medium">Storage:</span> {product.storage}
          </p>
          <p>
            <span className="font-medium">Screen:</span> {product.screenSize}"
          </p>
        </div>

        <div className="pt-2">
          <p className="text-amber-600 font-bold text-base">
            {formatPrice(product.price)}
          </p>
        </div>
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
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]); // Nhận feedbacks từ ProductFeedback
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const addToCart = useCartStore((state) => state.addToCart);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const getCurrentCart = useCartStore((state) => state.getCurrentCart);
  const [shopName, setShopName] = useState("Loading...");

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
          if (productData.shopId) {
            try {
              const shopResponse = await shopApi.getShopById(
                productData.shopId
              );
              if (shopResponse.isSuccess && shopResponse.data?.shopName) {
                setShopName(shopResponse.data.shopName);
              } else {
                setShopName("Unknown");
              }
            } catch (shopError) {
              console.error("Error fetching shop:", shopError);
              setShopName("Unknown");
            }
          }

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
            const relatedResponse = await productApi.getAllProducts(id);
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
    if (!product || product.quantity <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    const cart = getCurrentCart();
    const existingItem = cart.find(
      (item) => item.productId === product.productId
    );
    const currentQty = existingItem ? existingItem.quantity : 0;

    if (currentQty >= product.quantity) {
      toast.error(
        "The number of items in the cart has reached the inventory limit!",
        {
          position: "top-right",
          autoClose: 2000,
          style: { fontSize: "14px", fontWeight: "500" },
        }
      );
      return;
    }

    addToCart({
      productId: product.productId,
      productName: product.productName,
      price: product.price,
      imageProduct: product.imageProduct,
      quantity: 1,
      cpu: product.cpu,
      ram: product.ram,
      storage: product.storage,
      quantityAvailable: product.quantity,
    });

    toast.success("Successfully added to cart!", {
      position: "top-right",
      autoClose: 2000,
      style: { fontSize: "14px", fontWeight: "500" },
    });
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

  // Thêm hàm xử lý next/prev image
  const handlePrevImage = () => {
    const allImages = [
      product.imageProduct,
      ...images.map((img) => img.imageUrl),
    ];
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
    const allImages = [
      product.imageProduct,
      ...images.map((img) => img.imageUrl),
    ];
    setCurrentImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
    setSelectedImage(
      allImages[
        currentImageIndex === allImages.length - 1 ? 0 : currentImageIndex + 1
      ]
    );
  };
  const sameCategoryProducts = relatedProducts.filter(
    (p) =>
      p.categoryName === product?.categoryName &&
      p.productId !== product?.productId
  );

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
    <div className="bg-gradient-to-b from-amber-50 to-white min-h-screen animate-fade-in">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-14">
          {/* Left Column - Product Main Image */}
          <div className="w-full md:w-1/2">
            <button
              onClick={() => navigate("/laptopshop")}
              className="flex items-center text-gray-700 hover:text-amber-600 mb-8 font-semibold text-lg transition-all"
            >
              <svg
                className="w-6 h-6 mr-2"
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
            <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden relative shadow-2xl animate-fade-in">
              {selectedImage ? (
                <>
                  <img
                    src={selectedImage}
                    alt={product.productName}
                    className="w-full h-[440px] object-contain bg-gradient-to-br from-amber-50 to-white rounded-3xl shadow-xl transition-transform duration-500 ease-in-out animate-fade-in"
                  />
                  {/* Navigation Buttons */}
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-amber-100 text-amber-600 p-3 rounded-full shadow-lg border border-amber-200 transition-all scale-100 hover:scale-110"
                    aria-label="Previous image"
                  >
                    <svg
                      className="w-7 h-7"
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
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-amber-100 text-amber-600 p-3 rounded-full shadow-lg border border-amber-200 transition-all scale-100 hover:scale-110"
                    aria-label="Next image"
                  >
                    <svg
                      className="w-7 h-7"
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
                  {/* Image Counter */}
                  <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2">
                    <div className="bg-black bg-opacity-70 text-white px-5 py-1.5 rounded-full text-lg font-bold shadow-lg">
                      {currentImageIndex + 1} /{" "}
                      {
                        [
                          product.imageProduct,
                          ...images.map((img) => img.imageUrl),
                        ].length
                      }
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-3xl">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>
            <div className="flex space-x-4 mt-8 overflow-x-auto pb-2">
              {product.imageProduct && (
                <button
                  onClick={() => setSelectedImage(product.imageProduct)}
                  className={`w-24 h-24 rounded-2xl overflow-hidden border-2 shadow-md transition-all duration-200 hover:scale-110 ${
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
              {images.map((image, index) => (
                <button
                  key={image.productImageId || index}
                  onClick={() => setSelectedImage(image.imageUrl)}
                  className={`w-24 h-24 rounded-2xl overflow-hidden border-2 shadow-md transition-all duration-200 hover:scale-110 ${
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
          <div className="w-full md:w-1/2 flex flex-col animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-amber-100 mb-8">
              <h1 className="text-5xl font-extrabold text-amber-700 mb-6 drop-shadow-xl tracking-tight animate-fade-in">
                {product.productName}
              </h1>

              <div className="flex items-center mb-8 space-x-5">
                <span
                  className={`inline-flex items-center px-4 py-1.5 rounded-full text-lg font-bold shadow-lg border border-amber-300 transition-all duration-200 ${
                    isAvailable
                      ? "bg-gradient-to-r from-amber-300 to-amber-500 text-amber-900 animate-fade-in"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {isAvailable ? "In Stock" : "Out of Stock"}
                </span>
                {product.quantity > 0 && (
                  <span className="text-lg text-gray-500 font-semibold animate-fade-in">
                    {product.quantity} available
                  </span>
                )}
                {feedbacks.length > 0 && (
                  <div className="flex items-center animate-fade-in">
                    <FaStar className="text-amber-500 mr-2 text-xl" />
                    <span className="text-lg text-black font-bold">
                      {averageRating} ({feedbacks.length} reviews)
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
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
                  valueClassName="text-amber-600 font-extrabold text-2xl animate-fade-in"
                />
                <DetailItem icon="model" label="Model" value={product.model} />
                <DetailItem icon="color" label="Color" value={product.color} />
                <DetailItem
                  icon="graphicsCard"
                  label="Graphics Card"
                  value={product.graphicsCard}
                />
                <DetailItem
                  icon="battery"
                  label="Battery"
                  value={product.battery}
                />
                <DetailItem icon="ports" label="Ports" value={product.ports} />
                <DetailItem
                  icon="operatingSystem"
                  label="OS"
                  value={product.operatingSystem}
                />
                <DetailItem
                  icon="productionYear"
                  label="Year"
                  value={product.productionYear}
                />
                <DetailItem icon="shop" label="Shop" value={shopName} />
              </div>

              <div className="mb-10 bg-white border-l-8 border-amber-400 p-7 rounded-2xl shadow-lg animate-fade-in">
                <h2 className="text-2xl font-bold text-amber-700 mb-4 flex items-center gap-3">
                  <svg
                    className="w-7 h-7 text-amber-500"
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
                  Product Description
                </h2>
                <p className="text-gray-800 text-lg whitespace-pre-line leading-relaxed">
                  {`This ${product.productName} by ${
                    product.shopName || "Unknown Shop"
                  } features:\n\nFeatures:\n• CPU: ${
                    product.cpu || "N/A"
                  } – for smooth performance\n• RAM: ${
                    product.ram || "N/A"
                  } – handles multitasking easily\n• Storage: ${
                    product.storage || "N/A"
                  } – enough space for your files\n• Screen Size: ${
                    product.screenSize || "N/A"
                  }" – crisp, clear display\n• Graphics Card: ${
                    product.graphicsCard || "N/A"
                  } – for better visual experience\n• Battery: ${
                    product.battery || "N/A"
                  } – long-lasting usage\n• Ports: ${
                    product.ports || "N/A"
                  } – connect all your devices\n• OS: ${
                    product.operatingSystem || "N/A"
                  } – optimized for productivity\n• Color: ${
                    product.color || "N/A"
                  } – stylish and sleek\n• Model: ${
                    product.model || "N/A"
                  }\n• Year: ${
                    product.productionYear || "N/A"
                  }\n\nPerfect for students, professionals, or anyone needing reliable performance.`}
                </p>
              </div>

              <div className="mt-auto animate-fade-in">
                <button
                  onClick={handleAddToCart}
                  disabled={!isAvailable}
                  className={`w-full px-10 py-5 rounded-2xl text-white font-extrabold text-2xl shadow-2xl transition-all duration-200 flex items-center justify-center space-x-4
                    ${
                      isAvailable
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 hover:scale-105"
                        : "bg-gray-300 cursor-not-allowed"
                    }
                  `}
                >
                  <FaShoppingCart className="text-2xl" />
                  <span>{isAvailable ? "Add to Cart" : "Out of Stock"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="mt-16 border-t border-gray-200 pt-12 animate-fade-in">
          <ProductFeedback
            productId={id}
            onFeedbacksLoaded={handleFeedbacksLoaded}
          />
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-gray-200 pt-12 animate-fade-in">
            <h2 className="text-3xl font-extrabold text-amber-700 mb-8 tracking-tight">
              Related Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
              {sameCategoryProducts.slice(0, 4).map((relatedProduct) => (
                <div className="transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-2xl bg-gradient-to-br from-white to-amber-50">
                  <RelatedProductCard
                    key={relatedProduct.productId}
                    product={relatedProduct}
                    onClick={() =>
                      navigate(`/laptopshop/${relatedProduct.productId}`)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
};

export default ProductDetailPage;
