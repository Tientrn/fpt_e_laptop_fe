import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import donateitemsApi from "../../api/donateitemsApi";
import donateformApi from "../../api/donateformApi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import { FaLaptop, FaUpload, FaArrowLeft, FaSave } from "react-icons/fa";

const CreateDonateItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const donateFormId =
    searchParams.get("donateFormId") || location.state?.donateFormId;
  const [sponsorId, setSponsorId] = useState(
    searchParams.get("sponsorId") || location.state?.sponsorId || ""
  );
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch donation form details to get sponsorId
  useEffect(() => {
    const fetchDonationForm = async () => {
      if (donateFormId) {
        try {
          console.log("Fetching donation form with ID:", donateFormId); // Debug log
          const response = await donateformApi.getDonateFormById(donateFormId);
          console.log("API Response:", response); // Debug log
          if (response.isSuccess) {
            console.log("Donation form data:", response.data); // Debug log
            setSponsorId(response.data.sponsorId);
            setForm((prev) => ({
              ...prev,
              userId: response.data.sponsorId,
              donateFormId: donateFormId,
            }));
          } else {
            console.error("API call failed:", response); // Debug log
            toast.error("Failed to fetch donation form details");
          }
        } catch (error) {
          console.error("Error fetching donation form:", error);
          toast.error("Error fetching donation form details");
        }
      }
    };

    fetchDonationForm();
    
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
  }, [donateFormId]);

  // Redirect if no donateFormId
  useEffect(() => {
    if (!donateFormId) {
      toast.error("No donation form ID provided");
      navigate("/staff/donate-items");
    }
  }, [donateFormId, navigate]);

  const [form, setForm] = useState({
    itemName: "",
    cpu: "",
    ram: "",
    storage: "",
    screenSize: "",
    conditionItem: "",
    userId: sponsorId || "",
    donateFormId: donateFormId || "",
    itemImageFile: null,
    color: "",
    model: "",
    ports: "",
    battery: "",
    categoryId: "",
    description: "",
    graphicsCard: "",
    serialNumber: "",
    productionYear: "",
    operatingSystem: ""
  });

  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Prevent changing userId and donateFormId
    if (name === "userId" || name === "donateFormId") return;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, itemImageFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      if (form.itemImageFile) {
        formData.append("file", form.itemImageFile);
      }
      formData.append("ItemName", form.itemName);
      formData.append("Cpu", form.cpu);
      formData.append("Ram", form.ram);
      formData.append("Storage", form.storage);
      formData.append("ScreenSize", form.screenSize);
      formData.append("ConditionItem", form.conditionItem);
      formData.append("UserId", sponsorId);
      formData.append("DonateFormId", donateFormId);
      formData.append("Color", form.color);
      formData.append("Model", form.model);
      formData.append("Ports", form.ports);
      formData.append("Battery", form.battery);
      formData.append("CategoryId", form.categoryId);
      formData.append("Description", form.description);
      formData.append("GraphicsCard", form.graphicsCard);
      formData.append("SerialNumber", form.serialNumber);
      formData.append("ProductionYear", form.productionYear);
      formData.append("OperatingSystem", form.operatingSystem);

      const response = await donateitemsApi.createDonateItem(formData);
      if (response.code === 201) {
        toast.success("Donation item created successfully", {
          onClose: () => {
            navigate("/staff/donate-items");
          },
        });
        setForm({
          itemName: "",
          cpu: "",
          ram: "",
          storage: "",
          screenSize: "",
          conditionItem: "",
          userId: sponsorId || "",
          donateFormId: donateFormId || "",
          itemImageFile: null,
          color: "",
          model: "",
          ports: "",
          battery: "",
          categoryId: "",
          description: "",
          graphicsCard: "",
          serialNumber: "",
          productionYear: "",
          operatingSystem: ""
        });
        setPreviewImage(null);
      } else {
        toast.error("Creation failed");
      }
    } catch (error) {
      console.error("Error creating donate item:", error);
      toast.error("Error creating item");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaLaptop className="mr-3 text-blue-600" />
              Create Donated Laptop
      </h1>
            <button
              onClick={() => navigate("/staff/donate-items")}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              <FaArrowLeft size={16} />
              Back to Donations
            </button>
          </div>
          <p className="mt-2 text-gray-600">
            Enter the details of the donated laptop
          </p>
        </div>

        {/* Main Form Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Image Upload */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <label className="block text-lg font-semibold text-gray-700 mb-4">
                    Device Image <span className="text-red-500">*</span>
                  </label>
                  
                  <div className="flex flex-col items-center space-y-4">
                    {previewImage ? (
                      <div className="relative w-full h-48 bg-white rounded-lg overflow-hidden mb-4 border-2 border-blue-400">
                        <img
                          src={previewImage}
                          alt="Device Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4 border-2 border-dashed border-gray-300">
                        <span className="text-gray-400 text-center px-4">
                          No image selected
                        </span>
                      </div>
                    )}
                    
                    <label className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition duration-300">
                      <FaUpload className="mr-2" />
                      Select Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        required
                      />
                    </label>
                    
                    <p className="text-xs text-gray-500 text-center">
                      Upload a clear image of the device. Supported formats: JPG, PNG, WebP (max 5MB)
                    </p>
                  </div>
                </div>
      </div>

              {/* Right Column - Fields */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {/* Basic Information Section */}
                  <div className="md:col-span-2">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
                      Basic Information
                    </h2>
                  </div>
                  
            <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="itemName"
                value={form.itemName}
                onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="categoryId"
                      value={form.categoryId}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Model <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={form.model}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Serial Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="serialNumber"
                      value={form.serialNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="color"
                      value={form.color}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Condition <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="conditionItem"
                      value={form.conditionItem}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Production Year <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="productionYear"
                      value={form.productionYear}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="1990"
                      max={new Date().getFullYear()}
                required
              />
            </div>

                  {/* Technical Specifications Section */}
                  <div className="md:col-span-2 mt-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
                      Technical Specifications
                    </h2>
                  </div>

            <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CPU <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="cpu"
                value={form.cpu}
                onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      RAM <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ram"
                value={form.ram}
                onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Storage <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="storage"
                value={form.storage}
                onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Graphics Card <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="graphicsCard"
                      value={form.graphicsCard}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Screen Size <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="screenSize"
                value={form.screenSize}
                onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Operating System <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="operatingSystem"
                      value={form.operatingSystem}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Battery <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="battery"
                      value={form.battery}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ports <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                      name="ports"
                      value={form.ports}
                onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

                {/* Description Section */}
          <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
            </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
        </div>

          {/* Form Actions */}
            <div className="mt-8 border-t border-gray-200 pt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/staff/donate-items")}
                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center gap-2"
                disabled={isSubmitting}
            >
                <FaArrowLeft size={16} />
              Cancel
            </button>
          <button
            type="submit"
                className={`px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 ${
                  isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaSave size={16} />
              Create Item
                  </>
                )}
          </button>
        </div>
      </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateDonateItem;
