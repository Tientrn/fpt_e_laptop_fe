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
  FaMapMarkerAlt,
} from "react-icons/fa";
import userinfoApi from "../../api/userinfoApi";
import updateProfileApi from "../../api/updateprofileApi";
const ProfilePage = () => {
  const [formErrors, setFormErrors] = useState({});
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
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const validateField = (name, value) => {
    switch (name) {
      case "phoneNumber":
        if (!/^0\d{9}$/.test(value)) {
          return "Phone number must start with 0 and have 10 digits.";
        }
        break;
      case "dob":
        if (!value) {
          return "Please select your date of birth.";
        }
        break;
      case "gender":
        if (!["Male", "Female", "Other"].includes(value)) {
          return "Invalid gender.";
        }
        break;
      case "address":
        if (!value || value.trim() === "") {
          return "Address cannot be empty.";
        }
        break;
      default:
        return null;
    }
    return null;
  };

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
        };
        setProfile(userData);
      } else {
        toast.error("Unable to load profile information");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Unable to load profile information");
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

    setEditedProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

    const error = validateField(name, value);

    setFormErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
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
    console.log("Submit form:", editedProfile);
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return;
    }

    try {
      setLoading(true);

      const updateData = {
        dob: editedProfile.dob,
        address: editedProfile.address,
        phoneNumber: editedProfile.phoneNumber,
        gender: editedProfile.gender,
        avatar: editedProfile.avatar,
      };

      const response = await updateProfileApi.updateProfile(updateData);
      console.log("API update profile", response);
      if (response && response.isSuccess) {
        setProfile((prev) => ({ ...prev, ...updateData }));
        setIsEditing(false);
        toast.success("Update successful");
      } else {
        throw new Error(response?.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Unable to update profile. Please try again later.");
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
    <div className="h-screen bg-gray-50 ">
      <div className="h-full overflow-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
            <button
              onClick={handleEditToggle}
              className="flex items-center px-3 py-1.5 bg-slate-600 text-white rounded-lg hover:bg-amber-600 transition-colors duration-200 text-sm shadow-md"
            >
              <FaEdit className="mr-2" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        {isEditing ? (
          <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <img
                  src={
                    editedProfile.avatar || "https://via.placeholder.com/150"
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-amber-200 shadow-lg"
                />
                <label className="absolute bottom-0 right-0 bg-amber-600 text-white p-2 rounded-full cursor-pointer hover:bg-amber-700 transition-colors duration-200 shadow-md">
                  <FaEdit className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={editedProfile.fullName || ""}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editedProfile.email || ""}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={editedProfile.phoneNumber || ""}
                  onChange={handleInputChange}
                  className={`w-full p-3 border ${
                    formErrors.phoneNumber
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-amber-500 transition-all duration-200`}
                />
                {formErrors.phoneNumber && (
                  <p className="text-sm text-red-600 mt-1">
                    {formErrors.phoneNumber}
                  </p>
                )}
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Code
                </label>
                <input
                  type="text"
                  name="studentCode"
                  value={editedProfile.studentCode || ""}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={editedProfile.dob || ""}
                  onChange={handleInputChange}
                  className={`w-full p-3 border ${
                    formErrors.dob ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-amber-500 transition-all duration-200`}
                />
                {formErrors.dob && (
                  <p className="text-sm text-red-600 mt-1">{formErrors.dob}</p>
                )}
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={editedProfile.gender || ""}
                  onChange={handleInputChange}
                  className={`w-full p-3 border ${
                    formErrors.gender ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {formErrors.gender && (
                  <p className="text-sm text-red-600 mt-1">
                    {formErrors.gender}
                  </p>
                )}
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={editedProfile.address || ""}
                  onChange={handleInputChange}
                  className={`w-full p-3 border ${
                    formErrors.address ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200`}
                />
                {formErrors.address && (
                  <p className="text-sm text-red-600 mt-1">
                    {formErrors.address}
                  </p>
                )}
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  name="roleName"
                  value={editedProfile.roleName || ""}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  readOnly
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={handleEditToggle}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-amber-500 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-200 shadow-md"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-36 bg-gradient-to-r from-amber-500 to-amber-600">
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                  <img
                    src={profile.avatar || "https://via.placeholder.com/150"}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                </div>
              </div>

              <div className="pt-16 px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-amber-50 transition-colors duration-200">
                    <FaUser className="w-4 h-4 text-amber-600 mr-2" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Full Name
                      </p>
                      <p className="text-sm text-gray-800 font-semibold mt-0.5">
                        {profile.fullName || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-amber-50 transition-colors duration-200">
                    <FaEnvelope className="w-4 h-4 text-amber-600 mr-2" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">Email</p>
                      <p className="text-sm text-gray-800 font-semibold mt-0.5">
                        {profile.email || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-amber-50 transition-colors duration-200">
                    <FaPhone className="w-4 h-4 text-amber-600 mr-2" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Phone Number
                      </p>
                      <p className="text-sm text-gray-800 font-semibold mt-0.5">
                        {profile.phoneNumber || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-amber-50 transition-colors duration-200">
                    <FaIdCard className="w-4 h-4 text-amber-600 mr-2" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Student Code
                      </p>
                      <p className="text-sm text-gray-800 font-semibold mt-0.5">
                        {profile.studentCode || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-amber-50 transition-colors duration-200">
                    <FaBirthdayCake className="w-4 h-4 text-amber-600 mr-2" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Date of Birth
                      </p>
                      <p className="text-sm text-gray-800 font-semibold mt-0.5">
                        {profile.dob || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-amber-50 transition-colors duration-200">
                    <FaVenusMars className="w-4 h-4 text-amber-600 mr-2" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Gender
                      </p>
                      <p className="text-sm text-gray-800 font-semibold mt-0.5">
                        {profile.gender || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-amber-50 transition-colors duration-200">
                    <FaMapMarkerAlt className="w-4 h-4 text-amber-600 mr-2" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Address
                      </p>
                      <p className="text-sm text-gray-800 font-semibold mt-0.5">
                        {profile.address || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-amber-50 transition-colors duration-200">
                    <FaIdCard className="w-4 h-4 text-amber-600 mr-2" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">Role</p>
                      <p className="text-sm text-gray-800 font-semibold mt-0.5">
                        {profile.roleName || "Not provided"}
                      </p>
                    </div>
                  </div>
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
