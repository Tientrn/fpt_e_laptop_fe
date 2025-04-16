import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import donateitemsApi from "../../api/donateitemsApi";
import itemimagesApi from "../../api/itemimagesApi";
import { FaLaptop, FaUpload, FaTrash, FaImage, FaCheck, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const EditDonateItem = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [item, setItem] = useState({
    itemId: "",
    itemName: "",
    cpu: "",
    ram: "",
    storage: "",
    screenSize: "",
    conditionItem: "",
    totalBorrowedCount: 0,
    status: "",
    itemImage: "",
    color: "",
    model: "",
    ports: "",
    battery: "",
    categoryId: "",
    description: "",
    graphicsCard: "",
    serialNumber: "",
    productionYear: "",
    operatingSystem: "",
    userId: "",
    donateFormId: ""
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imagesPerPage = 4; // Số ảnh hiển thị mỗi lần

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch item details
        const itemResponse = await donateitemsApi.getDonateItemById(itemId);
        if (itemResponse.isSuccess) {
          setItem(itemResponse.data);
          setImagePreview(itemResponse.data.itemImage);
        } else {
          toast.error("Failed to fetch item details");
        }

        // Fetch all images and filter for this item
        const imagesResponse = await itemimagesApi.getAllItemImages();
        if (imagesResponse.isSuccess) {
          const itemImages = imagesResponse.data.filter(img => img.itemId === parseInt(itemId));
          setAdditionalImages(itemImages);
        }
        
        // Fetch categories
        // This is a placeholder - you'll need to implement this API call
        const fetchCategories = async () => {
          try {
            // Replace with your actual API call to get categories
            const response = { isSuccess: true, data: [
              { id: 1, name: "MACOS" },
              { id: 2, name: "HP" },
              { id: 3, name: "DELL" }
            ]};
            
            if (response.isSuccess) {
              setCategories(response.data);
            }
          } catch (error) {
            console.error("Error fetching categories:", error);
          }
        };
        
        fetchCategories();
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error loading item details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [itemId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
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
          itemImageId: `temp_${Date.now()}`,
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

        const response = await itemimagesApi.addItemImage(itemId, formData);
        
        if (response && response.data) {
          // Xóa ảnh tạm và thêm ảnh mới từ response
          setAdditionalImages(prev => {
            const filtered = prev.filter(img => img.itemImageId !== tempImage.itemImageId);
            return [...filtered, {
              itemImageId: response.data.itemImageId,
              imageUrl: response.data.imageUrl,
              itemId: response.data.itemId,
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
          setAdditionalImages(prev => prev.filter(img => img.itemImageId !== tempImage.itemImageId));
          
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
      const imageToDelete = additionalImages.find(img => img.itemImageId === imageId);
      
      // Cập nhật UI ngay lập tức (optimistic update)
      setAdditionalImages(prev => prev.filter(img => img.itemImageId !== imageId));

      // Hiển thị toast loading
      const toastId = toast.loading(
        <div className="flex items-center">
          <FaTrash className="mr-2" />
          <span>Deleting image...</span>
        </div>
      );

      const response = await itemimagesApi.deleteItemImage(imageId);
      
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
      const formData = new FormData();
      
      // Add file first if selected
      const imageInput = document.querySelector('input[type="file"]');
      if (imageInput && imageInput.files[0]) {
        formData.append('file', imageInput.files[0]);
      }

      // Add other fields with exact names matching the API
      formData.append('itemId', item.itemId);
      formData.append('itemName', item.itemName);
      formData.append('cpu', item.cpu);
      formData.append('ram', item.ram);
      formData.append('storage', item.storage);
      formData.append('screenSize', item.screenSize);
      formData.append('conditionItem', item.conditionItem);
      formData.append('totalBorrowedCount', item.totalBorrowedCount.toString());
      formData.append('status', item.status);
      formData.append('color', item.color);
      formData.append('model', item.model);
      formData.append('ports', item.ports);
      formData.append('battery', item.battery);
      formData.append('categoryId', item.categoryId);
      formData.append('description', item.description);
      formData.append('graphicsCard', item.graphicsCard);
      formData.append('serialNumber', item.serialNumber);
      formData.append('productionYear', item.productionYear);
      formData.append('operatingSystem', item.operatingSystem);
      formData.append('userId', item.userId);
      formData.append('donateFormId', item.donateFormId);

      const response = await donateitemsApi.updateDonateItem(itemId, formData);
      if (response.isSuccess) {
        toast.success("Item updated successfully!");
        navigate("/staff/items");
      } else {
        toast.error(response?.message || "Failed to update item");
      }
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Failed to update item. Please try again.");
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
          <FaLaptop className="mr-3 text-blue-600" />
          Edit Donated Laptop
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {/* Combined Image Gallery Section */}
          <div className="mb-6">
            <div className="flex flex-col items-center space-y-4">
              {/* Main Image Container */}
              <div className="w-full max-w-3xl bg-gray-50 rounded-lg p-4">
                <img
                  src={imagePreview}
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
                    className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition duration-300"
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
                    className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700 transition duration-300"
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
                              key={img.itemImageId || index} 
                              className="relative group w-32 h-32 flex-shrink-0"
                            >
                              <img
                                src={img.imageUrl}
                                alt={`Additional ${currentImageIndex + index + 1}`}
                                className="w-full h-full object-cover rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-all duration-200"
                                style={getImageStyles(img)}
                              />
                              {img.isUploading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
                                </div>
                              )}
                              {!img.isUploading && (
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteAdditionalImage(img.itemImageId)}
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
                Laptop Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="itemName"
                value={item.itemName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="categoryId"
                value={item.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                CPU <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="cpu"
                value={item.cpu}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                RAM <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ram"
                value={item.ram}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Storage <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="storage"
                value={item.storage}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Screen Size <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="screenSize"
                value={item.screenSize}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Condition <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="conditionItem"
                value={item.conditionItem}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Status
              </label>
              <select
                name="status"
                value={item.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Status</option>
                <option value="Available">Available</option>
                <option value="Borrowed">Borrowed</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Color <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="color"
                value={item.color}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Model <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="model"
                value={item.model}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Ports <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ports"
                value={item.ports}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Battery <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="battery"
                value={item.battery}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Graphics Card <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="graphicsCard"
                value={item.graphicsCard}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Serial Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="serialNumber"
                value={item.serialNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Production Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="productionYear"
                value={item.productionYear}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1990"
                max={new Date().getFullYear()}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Operating System <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="operatingSystem"
                value={item.operatingSystem}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Description Field (Full Width) */}
          <div className="mt-6">
            <label className="block text-gray-700 font-medium mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={item.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={() => navigate("/staff/items")}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDonateItem; 