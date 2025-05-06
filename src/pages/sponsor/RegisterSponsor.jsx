import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import donateformApi from "../../api/donateformApi";
import { jwtDecode } from "jwt-decode";

export const RegisterSponsor = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    itemDescription: "",
    quantity: 1,
    imageDonateForm: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "ImageDonateForm") {
      const file = files[0];
      setFormData((prevState) => ({
        ...prevState,
        imageDonateForm: file,
      }));

      // Generate preview
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: name === "quantity" ? parseInt(value) || 0 : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.itemName.trim()) {
      toast.error("Please enter an item name");
      return;
    }

    if (!formData.itemDescription.trim()) {
      toast.error("Please enter an item description");
      return;
    }

    if (formData.quantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    if (!formData.imageDonateForm) {
      toast.error("Please upload an image");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You need to login to submit a donation");
        return;
      }

      const decoded = jwtDecode(token);
      const sponsorId = Number(decoded.userId);

      const formPayload = new FormData();

      // Add form data with proper type conversion
      formPayload.append("SponsorId", sponsorId.toString());
      formPayload.append("ItemName", formData.itemName);
      formPayload.append("ItemDescription", formData.itemDescription);
      formPayload.append("Quantity", formData.quantity.toString());

      // Make sure the file is properly appended
      if (formData.imageDonateForm instanceof File) {
        formPayload.append(
          "ImageDonateForm",
          formData.imageDonateForm,
          formData.imageDonateForm.name
        );
      } else {
        toast.error("Invalid image file. Please try uploading again.");
        setIsSubmitting(false);
        return;
      }

      // Send with proper content type header
      await donateformApi.createDonateForm(formPayload);

      toast.success("Sponsorship submission successful!");

      // Reset form
      setFormData({
        itemName: "",
        itemDescription: "",
        quantity: 1,
        imageDonateForm: null,
      });
      setPreview(null);

      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    } catch (error) {
      if (error.response?.data?.errors) {
        toast.error(
          "Invalid form data. Please check all fields and try again."
        );
      } else {
        toast.error(error.message || "Submission failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          Laptop Donation Request
        </h1>
        <p className="text-sm text-gray-500">
          Support our students by donating laptops for educational purposes
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image Upload Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <h2 className="text-base font-medium text-gray-800 mb-3 flex items-center">
            <svg
              className="w-4 h-4 text-amber-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Upload Item Image
          </h2>

          <div className="flex flex-col md:flex-row gap-4">
            <div
              className={`flex-1 border-2 border-dashed rounded-md ${
                preview
                  ? "border-amber-200 bg-amber-50"
                  : "border-gray-200 bg-gray-50"
              } flex items-center justify-center relative overflow-hidden`}
              style={{ height: "180px" }}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-4">
                  <svg
                    className="mx-auto h-10 w-10 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mt-1 text-xs text-gray-500">
                    Drag and drop an image, or click to browse
                  </p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              )}
              <input
                type="file"
                name="ImageDonateForm"
                accept="image/*"
                required
                onChange={handleChange}
                disabled={isSubmitting}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            <div className="md:w-1/4 space-y-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        quantity: Math.max(1, prev.quantity - 1),
                      }))
                    }
                    disabled={formData.quantity <= 1 || isSubmitting}
                    className="p-1.5 rounded-l-md bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <input
                    type="number"
                    name="quantity"
                    required
                    min="1"
                    className="w-12 text-center py-1.5 border-t border-b border-gray-300 focus:ring-0 focus:outline-none text-sm"
                    value={formData.quantity}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        quantity: prev.quantity + 1,
                      }))
                    }
                    disabled={isSubmitting}
                    className="p-1.5 rounded-r-md bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Item Information */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <h2 className="text-base font-medium text-gray-800 mb-3 flex items-center">
            <svg
              className="w-4 h-4 text-amber-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Item Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="itemName"
                required
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors text-sm"
                value={formData.itemName}
                onChange={handleChange}
                placeholder="Enter item name (e.g., Dell Latitude 7480)"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Item Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="itemDescription"
                rows={3}
                required
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors resize-none text-sm"
                value={formData.itemDescription}
                onChange={handleChange}
                placeholder="Describe the item in detail (specifications, condition, serial number, etc.)"
                disabled={isSubmitting}
              />
              <p className="mt-1 text-xs text-gray-500">
                Please include important specifications like CPU, RAM, storage,
                and any notable features or issues.
              </p>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex items-start space-x-2">
            <div className="flex items-center h-5 mt-0.5">
              <input
                type="checkbox"
                required
                id="terms"
                className="h-4 w-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label
                htmlFor="terms"
                className="text-xs font-medium text-gray-700"
              >
                I agree to the terms and conditions
              </label>
              <p className="mt-0.5 text-xs text-gray-500">
                By checking this box, you acknowledge that the donated items
                will be distributed to students in need and will not be
                returned. Your donation is subject to approval by our
                administrators.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            className={`
              px-6 py-2 rounded-md font-medium text-sm flex items-center justify-center min-w-[160px]
              ${
                isSubmitting
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-amber-600 text-white hover:bg-amber-700 hover:shadow-md active:transform active:scale-95"
              }
              transition-all duration-200
            `}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                Submit Donation Request
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default RegisterSponsor;
