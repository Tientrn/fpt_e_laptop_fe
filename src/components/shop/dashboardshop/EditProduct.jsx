import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import productApi from "../../../api/productApi";
import productimageApi from "../../../api/productimageApi";
import { FaLaptop, FaUpload, FaTrash, FaImage, FaCheck, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imagesPerPage = 4;
  const [product, setProduct] = useState({
    productId: "",
    productName: "",
    price: "",
    quantity: "",
    cpu: "",
    ram: "",
    storage: "",
    screenSize: "",
    categoryId: "",
    shopId: "",
    imageProduct: "",
    imageFile: null
  });

  useEffect(() => {
    const fetchProductAndImages = async () => {
      try {
        setLoading(true);
        const [productResponse, imagesResponse] = await Promise.all([
          productApi.getProductById(productId),
          productimageApi.getProductImagesById(productId)
        ]);

        if (productResponse && productResponse.isSuccess) {
          setProduct({
            ...productResponse.data,
            productId: productResponse.data.productId || productId
          });
          setImagePreview(productResponse.data.imageProduct);
        }

        if (imagesResponse && imagesResponse.isSuccess) {
          setAdditionalImages(imagesResponse.data);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        toast.error("Error loading product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndImages();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct(prev => ({
        ...prev,
        imageFile: file
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAdditionalImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    for (const file of files) {
      try {
        // Tạo preview URL ngay lập tức
        const previewUrl = URL.createObjectURL(file);
        
        // Thêm ảnh tạm thời vào state với trạng thái đang tải
        const tempImage = {
          productImageId: `temp_${Date.now()}`,
          imageUrl: previewUrl,
          isUploading: true
        };
        setAdditionalImages(prev => [...prev, tempImage]);

        const formData = new FormData();
        formData.append('file', file);
        
        // Hiển thị toast loading
        const toastId = toast.loading(
          <div className="flex items-center">
            <FaImage className="mr-2" />
            <span>Uploading image...</span>
          </div>
        );

        const response = await productimageApi.addProductImage(productId, formData);
        
        if (response && response.isSuccess) {
          // Xóa ảnh tạm và thêm ảnh mới từ response
          setAdditionalImages(prev => {
            const filtered = prev.filter(img => img.productImageId !== tempImage.productImageId);
            return [...filtered, {
              productImageId: response.data.productImageId,
              imageUrl: response.data.imageUrl,
              productId: response.data.productId,
              createdDate: response.data.createdDate
            }];
          });

          // Cập nhật toast thành công
          toast.update(toastId, {
            render: (
              <div className="flex items-center">
                <FaCheck className="mr-2 text-green-500" />
                <span>Image uploaded successfully!</span>
              </div>
            ),
            type: "success",
            isLoading: false,
            autoClose: 3000
          });

          // Giải phóng URL tạm thời
          URL.revokeObjectURL(previewUrl);
        } else {
          // Xóa ảnh tạm nếu upload thất bại
          setAdditionalImages(prev => prev.filter(img => img.productImageId !== tempImage.productImageId));
          
          toast.update(toastId, {
            render: (
              <div className="flex items-center">
                <FaImage className="mr-2 text-red-500" />
                <span>Failed to upload image. Please try again.</span>
              </div>
            ),
            type: "error",
            isLoading: false,
            autoClose: 3000
          });

          // Giải phóng URL tạm thời
          URL.revokeObjectURL(previewUrl);
        }
      } catch (error) {
        console.error("Error uploading additional image:", error);
        toast.error(
          <div className="flex items-center">
            <FaImage className="mr-2 text-red-500" />
            <span>Error uploading image. Please try again.</span>
          </div>,
          { autoClose: 3000 }
        );
      }
    }
  };

  const handleDeleteAdditionalImage = async (imageId) => {
    try {
      // Lưu trữ ảnh cần xóa để có thể khôi phục nếu cần
      const imageToDelete = additionalImages.find(img => img.productImageId === imageId);
      
      // Cập nhật UI ngay lập tức (optimistic update)
      setAdditionalImages(prev => prev.filter(img => img.productImageId !== imageId));

      // Hiển thị toast loading
      const toastId = toast.loading(
        <div className="flex items-center">
          <FaTrash className="mr-2" />
          <span>Deleting image...</span>
        </div>
      );

      const response = await productimageApi.deleteProductImage(imageId);
      
      if (response.isSuccess) {
        // Cập nhật toast thành công
        toast.update(toastId, {
          render: (
            <div className="flex items-center">
              <FaCheck className="mr-2 text-green-500" />
              <span>Image deleted successfully!</span>
            </div>
          ),
          type: "success",
          isLoading: false,
          autoClose: 3000
        });
      } else {
        // Khôi phục lại ảnh nếu xóa thất bại
        setAdditionalImages(prev => [...prev, imageToDelete]);
        
        toast.update(toastId, {
          render: (
            <div className="flex items-center">
              <FaTrash className="mr-2 text-red-500" />
              <span>{response.message || "Failed to delete image"}</span>
            </div>
          ),
          type: "error",
          isLoading: false,
          autoClose: 3000
        });
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error(
        <div className="flex items-center">
          <FaTrash className="mr-2 text-red-500" />
          <span>{error.response?.data?.message || "Failed to delete image"}</span>
        </div>,
        { autoClose: 3000 }
      );
    }
  };

  // Thêm hàm điều hướng
  const nextImages = () => {
    setCurrentImageIndex(prevIndex => 
      Math.min(prevIndex + imagesPerPage, additionalImages.length - imagesPerPage)
    );
  };

  const previousImages = () => {
    setCurrentImageIndex(prevIndex => 
      Math.max(0, prevIndex - imagesPerPage)
    );
  };

  // Thêm CSS cho ảnh đang tải
  const getImageStyles = (image) => {
    return {
      opacity: image.isUploading ? '0.6' : '1',
      filter: image.isUploading ? 'grayscale(50%)' : 'none'
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requiredFields = [
        'productId',
        'productName',
        'price',
        'quantity',
        'cpu',
        'ram',
        'storage',
        'screenSize',
        'categoryId',
        'shopId'
      ];
      
      const emptyFields = requiredFields.filter(field => !product[field]);
      if (emptyFields.length > 0) {
        toast.error(`Please fill in all required fields`);
        return;
      }

      const formData = new FormData();
      formData.append('ProductId', product.productId);
      formData.append('ProductName', product.productName);
      formData.append('Price', Number(product.price));
      formData.append('Quantity', Number(product.quantity));
      formData.append('Cpu', product.cpu);
      formData.append('Ram', product.ram);
      formData.append('Storage', product.storage);
      formData.append('ScreenSize', product.screenSize);
      formData.append('CategoryId', product.categoryId);
      formData.append('ShopId', product.shopId);
      
      if (product.imageFile) {
        formData.append('ImageFile', product.imageFile);
      }

      const response = await productApi.updateProduct(product.productId, formData);
      if (response && response.isSuccess) {
        toast.success("Product updated successfully!");
        navigate("/shop/products");
      } else {
        toast.error(response?.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update product. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-amber-600 mb-8 flex items-center">
          <FaLaptop className="mr-3" />
          Edit Product
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {/* Combined Image Gallery Section */}
          <div className="mb-6">
            <div className="flex flex-col items-center space-y-4">
              {/* Main Image Container */}
              <div className="w-full max-w-3xl bg-gray-50 rounded-lg p-4">
                <img
                  src={imagePreview || "https://via.placeholder.com/160?text=No+Image"}
                  alt="Main Preview"
                  className="w-full h-[400px] object-contain rounded-lg"
                />
              </div>

              {/* Image Upload Buttons Row */}
              <div className="flex gap-4 justify-center w-full">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center justify-center px-4 py-2 bg-amber-600 text-white rounded-lg cursor-pointer hover:bg-amber-700 transition duration-300"
                  >
                    <FaUpload className="mr-2" />
                    Choose Main Image
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAdditionalImageUpload}
                    className="hidden"
                    id="additional-images-upload"
                    multiple
                  />
                  <label
                    htmlFor="additional-images-upload"
                    className="flex items-center justify-center px-4 py-2 bg-amber-600 text-white rounded-lg cursor-pointer hover:bg-amber-700 transition duration-300"
                  >
                    <FaUpload className="mr-2" />
                    Add More Images
                  </label>
                </div>
              </div>

              {/* Additional Images Carousel */}
              {additionalImages && additionalImages.length > 0 && (
                <div className="w-full max-w-3xl bg-gray-50 rounded-lg p-4">
                  <div className="relative">
                    <div className="flex items-center justify-center">
                      {/* Previous Button */}
                      {currentImageIndex > 0 && (
                        <button
                          type="button"
                          onClick={previousImages}
                          className="absolute left-2 z-10 p-2 bg-gray-800 bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all duration-200"
                        >
                          <FaChevronLeft size={16} />
                        </button>
                      )}

                      {/* Images Container */}
                      <div className="flex gap-4 overflow-hidden px-12">
                        {additionalImages
                          .slice(currentImageIndex, currentImageIndex + imagesPerPage)
                          .map((img, index) => (
                            <div 
                              key={img.productImageId || index} 
                              className="relative group w-32 h-32 flex-shrink-0"
                            >
                              <img
                                src={img.imageUrl}
                                alt={`Additional ${currentImageIndex + index + 1}`}
                                className="w-full h-full object-cover rounded-lg border-2 border-gray-200 hover:border-amber-500 transition-all duration-200"
                                style={getImageStyles(img)}
                              />
                              {img.isUploading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500" />
                                </div>
                              )}
                              {!img.isUploading && (
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteAdditionalImage(img.productImageId)}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                                  >
                                    <FaTrash size={12} />
                                  </button>
                                </div>
                              )}
                            </div>
                        ))}
                      </div>

                      {/* Next Button */}
                      {currentImageIndex + imagesPerPage < additionalImages.length && (
                        <button
                          type="button"
                          onClick={nextImages}
                          className="absolute right-2 z-10 p-2 bg-gray-800 bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all duration-200"
                        >
                          <FaChevronRight size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Product Name
              </label>
              <input
                type="text"
                name="productName"
                value={product.productName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={product.quantity}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                CPU
              </label>
              <input
                type="text"
                name="cpu"
                value={product.cpu}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                RAM
              </label>
              <input
                type="text"
                name="ram"
                value={product.ram}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Storage
              </label>
              <input
                type="text"
                name="storage"
                value={product.storage}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Screen Size
              </label>
              <input
                type="text"
                name="screenSize"
                value={product.screenSize}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={() => navigate("/shop/products")}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition duration-300"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct; 