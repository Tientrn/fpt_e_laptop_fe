import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaEdit,
  FaBirthdayCake,
  FaVenusMars,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import userinfoApi from "../../api/userinfoApi";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    studentCode: "",
    roleName: "",
    gender: "",
    dob: "",
    address: "",
    avatar: null,
    enrollmentDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userinfoApi.getUserInfo();

      if (response && response.isSuccess) {
        const userData = {
          fullName: response.data.fullName || "",
          email: response.data.email || "",
          phoneNumber: response.data.phoneNumber || "",
          studentCode: response.data.studentCode || "",
          roleName: response.data.roleName || "",
          gender: response.data.gender || "",
          dob: response.data.dob || "",
          address: response.data.address || "",
          avatar: response.data.avatar || null,
          enrollmentDate: response.data.enrollmentDate || "",
        };
        setProfile(userData);
      } else {
        toast.error("Không thể tải thông tin hồ sơ");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Không thể tải thông tin hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      setEditedProfile({ ...profile });
      setIsEditing(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: value,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProfile({
          ...editedProfile,
          avatar: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      setProfile(editedProfile);
      setIsEditing(false);
      toast.success("Cập nhật hồ sơ thành công");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Không thể cập nhật hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile.fullName) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-black">Hồ sơ của tôi</h1>
          <button
            onClick={handleEditToggle}
            className="flex items-center px-4 py-2 bg-slate-600 text-white rounded hover:bg-amber-600 transition-colors duration-200 text-sm"
          >
            <FaEdit className="mr-2" />
            {isEditing ? "Hủy" : "Chỉnh sửa hồ sơ"}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-6">
              <img
                src={editedProfile.avatar || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
              <label className="mt-2 px-3 py-1 bg-gray-200 text-black rounded hover:bg-amber-50 cursor-pointer text-xs">
                Thay đổi ảnh
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
              <p className="mt-2 text-sm font-medium text-amber-600">
                {profile.roleName}
              </p>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={editedProfile.fullName || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-200 rounded focus:border-amber-600 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editedProfile.email || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-200 rounded bg-gray-100 text-sm cursor-not-allowed"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={editedProfile.phoneNumber || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-200 rounded focus:border-amber-600 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Mã sinh viên
                </label>
                <input
                  type="text"
                  name="studentCode"
                  value={editedProfile.studentCode || ""}
                  className="w-full p-2 border border-gray-200 rounded bg-gray-100 text-sm cursor-not-allowed"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  name="dob"
                  value={editedProfile.dob || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-200 rounded focus:border-amber-600 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Giới tính
                </label>
                <select
                  name="gender"
                  value={editedProfile.gender || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-200 rounded focus:border-amber-600 focus:outline-none text-sm"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Male">Nam</option>
                  <option value="Female">Nữ</option>
                  <option value="Other">Khác</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  name="address"
                  value={editedProfile.address || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-200 rounded focus:border-amber-600 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Ngày nhập học
                </label>
                <input
                  type="date"
                  name="enrollmentDate"
                  value={editedProfile.enrollmentDate || ""}
                  className="w-full p-2 border border-gray-200 rounded bg-gray-100 text-sm cursor-not-allowed"
                  readOnly
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={handleEditToggle}
                className="px-4 py-2 border border-gray-200 rounded text-black hover:bg-amber-600  hover:text-white transition-colors duration-200 text-sm"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-amber-600 transition-colors duration-200 text-sm"
                disabled={loading}
              >
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        ) : (
          <div className="max-w-2xl mx-auto">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-6">
              <img
                src={profile.avatar || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
              <p className="mt-2 text-sm font-medium text-amber-600">
                {profile.roleName}
              </p>
            </div>

            {/* Profile Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center p-2">
                <FaUser className="w-5 h-5 text-amber-600 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Họ và tên</p>
                  <p className="text-sm text-black font-medium">
                    {profile.fullName || "Chưa cung cấp"}
                  </p>
                </div>
              </div>
              <div className="flex items-center p-2">
                <FaEnvelope className="w-5 h-5 text-amber-600 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-black font-medium">
                    {profile.email || "Chưa cung cấp"}
                  </p>
                </div>
              </div>
              <div className="flex items-center p-2">
                <FaPhone className="w-5 h-5 text-amber-600 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Số điện thoại</p>
                  <p className="text-sm text-black font-medium">
                    {profile.phoneNumber || "Chưa cung cấp"}
                  </p>
                </div>
              </div>
              <div className="flex items-center p-2">
                <FaIdCard className="w-5 h-5 text-amber-600 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Mã sinh viên</p>
                  <p className="text-sm text-black font-medium">
                    {profile.studentCode || "Chưa cung cấp"}
                  </p>
                </div>
              </div>
              <div className="flex items-center p-2">
                <FaBirthdayCake className="w-5 h-5 text-amber-600 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Ngày sinh</p>
                  <p className="text-sm text-black font-medium">
                    {profile.dob || "Chưa cung cấp"}
                  </p>
                </div>
              </div>
              <div className="flex items-center p-2">
                <FaVenusMars className="w-5 h-5 text-amber-600 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Giới tính</p>
                  <p className="text-sm text-black font-medium">
                    {profile.gender || "Chưa cung cấp"}
                  </p>
                </div>
              </div>
              <div className="flex items-center p-2">
                <FaMapMarkerAlt className="w-5 h-5 text-amber-600 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Địa chỉ</p>
                  <p className="text-sm text-black font-medium">
                    {profile.address || "Chưa cung cấp"}
                  </p>
                </div>
              </div>
              <div className="flex items-center p-2">
                <FaCalendarAlt className="w-5 h-5 text-amber-600 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Ngày nhập học</p>
                  <p className="text-sm text-black font-medium">
                    {profile.enrollmentDate || "Chưa cung cấp"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
