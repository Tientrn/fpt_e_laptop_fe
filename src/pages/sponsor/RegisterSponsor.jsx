import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import donateformApi from "../../api/donateformApi";
import { jwtDecode } from "jwt-decode";

export const RegisterSponsor = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    itemDescription: "",
    quantity: 0,
    imageDonateForm: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "ImageDonateForm") {
      setFormData((prevState) => ({
        ...prevState,
        imageDonateForm: files[0],
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: name === "quantity" ? parseInt(value) || 0 : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Bạn cần đăng nhập để gửi tài trợ.");
        return;
      }

      const decoded = jwtDecode(token);
      const sponsorId = Number(decoded.userId);
      if (!formData.imageDonateForm) {
        toast.error("Vui lòng chọn ảnh trước khi gửi.");
        return;
      }

      const formPayload = new FormData();
      formPayload.append("SponsorId", sponsorId);
      formPayload.append("ItemName", formData.itemName);
      formPayload.append("ItemDescription", formData.itemDescription);
      formPayload.append("Quantity", formData.quantity);
      formPayload.append("ImageDonateForm", formData.imageDonateForm);

      await donateformApi.createDonateForm(formPayload);

      toast.success("Sponsorship submission successful!");
      setFormData({
        itemName: "",
        itemDescription: "",
        quantity: 0,
        imageDonateForm: null,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response?.data?.errors) {
        console.log("Chi tiết lỗi từng field:", error.response.data.errors);
        toast.error(
          "Thiếu hoặc sai định dạng một số trường. Kiểm tra console."
        );
      } else {
        toast.error("Submission failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-md max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-black mb-4">Donate Items</h1>
        <p className="text-gray-600 text-lg">
          Support our community by sponsoring items
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-black">
              Item Information
            </h2>
            <span className="text-sm text-red-500">*Required</span>
          </div>

          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="itemName"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent transition duration-200"
                value={formData.itemName}
                onChange={handleChange}
                placeholder="Enter item name"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="itemDescription"
                rows={4}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent transition duration-200"
                value={formData.itemDescription}
                onChange={handleChange}
                placeholder="Describe the item you're sponsoring"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                required
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent transition duration-200"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                name="ImageDonateForm"
                accept="image/*"
                required
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg transition duration-200 bg-white"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-black mb-6">
            Terms & Conditions
          </h2>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              required
              className="h-5 w-5 text-slate-600 border-gray-300 rounded focus:ring-amber-600"
              disabled={isSubmitting}
            />
            <label className="text-sm text-gray-700">
              I agree to the terms and conditions and privacy policy
            </label>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            type="submit"
            className="px-8 py-3 bg-slate-600 text-white font-semibold rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 transition duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Sponsorship"}
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default RegisterSponsor;
