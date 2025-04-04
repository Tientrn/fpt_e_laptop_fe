import React, { useState } from "react";
import { toast } from "react-toastify";
import donateitemsApi from "../../api/donateitemsApi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateDonateItem = () => {
  const [form, setForm] = useState({
    itemName: "",
    cpu: "",
    ram: "",
    storage: "",
    screenSize: "",
    conditionItem: "",
    userId: "",
    donateFormId: "",
    itemImageFile: null, // Thêm
  });

  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
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
        formData.append("file", form.itemImageFile); // Tên trường phải khớp với yêu cầu của máy chủ
      }
      console.log(`file trước khi truyền vào${form.itemImageFile}`);
      formData.append("ItemName", form.itemName);
      formData.append("Cpu", form.cpu);
      formData.append("Ram", form.ram);
      formData.append("Storage", form.storage);
      formData.append("ScreenSize", form.screenSize);
      formData.append("ConditionItem", form.conditionItem);
      formData.append("UserId", form.userId);
      formData.append("DonateFormId", form.donateFormId);

      const response = await donateitemsApi.createDonateItem(formData); // gửi FormData
      if (response.code === 201) {
        toast.success("Donation item created successfully");
        setForm({
          itemName: "",
          cpu: "",
          ram: "",
          storage: "",
          screenSize: "",
          conditionItem: "",
          userId: "",
          donateFormId: "",
          itemImageFile: null,
        }); // reset lại form
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
    <div className="max-w-3xl mx-auto p-8 bg-white text-black rounded-2xl shadow-md border border-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-center text-slate-700">
        Create Donate Item
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Item Name", name: "itemName" },
            { label: "CPU", name: "cpu" },
            { label: "RAM", name: "ram" },
            { label: "Storage", name: "storage" },
            { label: "Screen Size", name: "screenSize" },
            { label: "Condition", name: "conditionItem" },
            { label: "User ID", name: "userId" },
            { label: "Donate Form ID", name: "donateFormId" },
          ].map((field) => (
            <div key={field.name}>
              <label
                className="block text-sm font-semibold mb-1"
                htmlFor={field.name}
              >
                {field.label}
              </label>
              <input
                type="text"
                id={field.name}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
          ))}

          <div className="md:col-span-2">
            <label
              className="block text-sm font-semibold mb-1"
              htmlFor="itemImage"
            >
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
            {previewImage && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Preview:</p>
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-auto rounded-md border border-gray-300 shadow-sm"
                />
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors shadow-sm"
          >
            Create
          </button>
        </div>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default CreateDonateItem;
