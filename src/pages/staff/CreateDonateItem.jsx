import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import donateitemsApi from "../../api/donateitemsApi";
import donateformApi from "../../api/donateformApi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const CreateDonateItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const donateFormId =
    searchParams.get("donateFormId") || location.state?.donateFormId;
  const [sponsorId, setSponsorId] = useState(
    searchParams.get("sponsorId") || location.state?.sponsorId || ""
  );

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
        });
        setPreviewImage(null);
      } else {
        toast.error("Creation failed");
      }
    } catch (error) {
      console.error("Error creating donate item:", error);
      toast.error("Error creating item");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl text-center font-bold text-gray-900">
        Create Donate Item
      </h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="p-8">
          {/* Form Header Section */}

          {/* Main Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Item Name
              </label>
              <input
                type="text"
                name="itemName"
                value={form.itemName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                CPU
              </label>
              <input
                type="text"
                name="cpu"
                value={form.cpu}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                RAM
              </label>
              <input
                type="text"
                name="ram"
                value={form.ram}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Storage
              </label>
              <input
                type="text"
                name="storage"
                value={form.storage}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Screen Size
              </label>
              <input
                type="text"
                name="screenSize"
                value={form.screenSize}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Condition
              </label>
              <input
                type="text"
                name="conditionItem"
                value={form.conditionItem}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">
              Upload Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="itemImage"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Upload a file</span>
            <input
                      id="itemImage"
                      name="itemImage"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
            {previewImage && (
              <div className="mt-4">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="max-h-48 rounded-lg mx-auto"
                />
              </div>
            )}
        </div>

          {/* Form Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/staff/donate-items")}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          <button
            type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
              Create Item
          </button>
        </div>
      </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateDonateItem;
