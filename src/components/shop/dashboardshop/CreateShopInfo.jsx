import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import shopApi from "../../../api/shopApi";

const CreateShopInfo = () => {
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    shopName: "",
    shopAddress: "",
    shopPhone: "",
    businessLicense: "",
    bankName: "",
    bankNumber: "",
    status: "active",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded token:", decodedToken); // Debug token

        // Lấy userId trực tiếp từ token giống như trong ShopProfile
        const userIdFromToken = decodedToken.userId || "15";
        const finalUserId = Number(userIdFromToken);
        console.log("UserID:", finalUserId); // Debug userId
        setUserId(finalUserId);

        // Kiểm tra shop tồn tại
        shopApi.getAllShops().then((shopsResponse) => {
          console.log("All shops response:", shopsResponse);
          if (shopsResponse && shopsResponse.data) {
            const existedShop = shopsResponse.data.find(
              (shop) => shop.userId === finalUserId
            );
            console.log("Existed shop:", existedShop);
            
            if (existedShop) {
              // Nếu tìm thấy shop, lưu shopId và chuyển hướng
              localStorage.setItem("shopId", existedShop.shopId);
              toast.info("Bạn đã tạo thông tin shop trước đó.");
              navigate("/shop/profile");
            }
          }
        }).catch(error => {
          console.error("Error checking existing shop:", error);
          toast.error("Lỗi khi kiểm tra thông tin shop");
        });

      } catch (error) {
        console.error("Error decoding token:", error);
        toast.error("Lỗi khi xác thực thông tin người dùng");
      }
    } else {
      toast.error("Vui lòng đăng nhập lại");
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        userId: userId,
      };
      const response = await shopApi.createShop(payload);

      console.log("Create shop response:", response);
      console.log("response.data:", response.data);

      const statusCode = response.code;

      if (statusCode === 200 || statusCode === 201) {
        const data = response.data;
        const createdShopId = data.shopId;

        console.log("Created shopId:", createdShopId);
        if (createdShopId) {
          localStorage.setItem("shopId", createdShopId);
        }

        toast.success("Shop info created successfully!");
        setTimeout(() => {
          navigate("/shop/profile", {
            state: {
              message: "Tạo thông tin shop thành công!",
              shopId: createdShopId,
            },
          });
        }, 1500);
      } else {
        toast.error("Failed to create shop info.");
      }
    } catch (err) {
      toast.error("Failed to create shop info.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-amber-600">
        Create Shop Info
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-black">
            Shop Name
          </label>
          <input
            type="text"
            name="shopName"
            value={formData.shopName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black">
            Shop Address
          </label>
          <input
            type="text"
            name="shopAddress"
            value={formData.shopAddress}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black">
            Shop Phone
          </label>
          <input
            type="text"
            name="shopPhone"
            value={formData.shopPhone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black">
            Business License
          </label>
          <input
            type="text"
            name="businessLicense"
            value={formData.businessLicense}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black">
            Bank Name
          </label>
          <input
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black">
            Bank Number
          </label>
          <input
            type="text"
            name="bankNumber"
            value={formData.bankNumber}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700"
        >
          Create Shop Info
        </button>
      </form>
    </div>
  );
};

export default CreateShopInfo;
