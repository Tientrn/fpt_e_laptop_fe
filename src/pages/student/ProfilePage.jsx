import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaEdit,
  FaBirthdayCake,
  FaVenusMars,
  FaMapMarkerAlt,
  FaCamera,
  FaSave,
  FaTimes,
  FaChevronRight,
  FaCheck,
  FaShieldAlt,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import userinfoApi from "../../api/userinfoApi";
import updateProfileApi from "../../api/updateprofileApi";
import changepassApi from "../../api/changepassApi";

function formatDateToInput(dateStr) {
  // Nếu đã là yyyy-MM-dd thì trả về luôn
  if (/^\\d{4}-\\d{2}-\\d{2}$/.test(dateStr)) return dateStr;
  // Nếu là dd/MM/yyyy thì convert
  const [day, month, year] = dateStr.split(/[\\/\\-]/);
  if (year && month && day) return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  return "";
}

function toAPIDateFormat(dateStr) {
  // Nếu đã là yyyy-MM-dd thì trả về luôn
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  // Nếu là dd/MM/yyyy hoặc dd-MM-yyyy thì convert
  if (/^\d{2}[\/\-]\d{2}[\/\-]\d{4}$/.test(dateStr)) {
    const [d, m, y] = dateStr.split(/[\/\-]/);
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  // Nếu là MM/dd/yyyy thì convert
  if (/^\d{2}[\/\-]\d{2}[\/\-]\d{4}$/.test(dateStr)) {
    const [m, d, y] = dateStr.split(/[\/\-]/);
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  return dateStr;
}

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
  const [activeTab, setActiveTab] = useState("info");
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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

  const validateForm = () => {
    const errors = [];

    if (
      editedProfile.phoneNumber &&
      !/^0\d{9}$/.test(editedProfile.phoneNumber)
    ) {
      errors.push("Phone number must start with 0 and have 10 digits.");
    }

    if (!editedProfile.address || editedProfile.address.trim() === "") {
      errors.push("Address cannot be empty.");
    }

    return errors;
  };

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordForm.oldPassword) {
      errors.oldPassword = "Current password is required";
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }

    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
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
          dob: response.data.dob
            ? formatDateToInput(response.data.dob)
            : "",
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
      setEditedProfile({
        ...editedProfile,
        avatar: file,
      });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const errors = validatePasswordForm();
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    // Get token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication token not found. Please login again.");
      return;
    }

    try {
      setIsChangingPassword(true);
      const response = await changepassApi.changePassword(
        {
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        },
        token
      );

      if (response && response.isSuccess) {
        toast.success(
          "Password changed successfully! Please use your new password for your next login.",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            newestOnTop: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
        setPasswordForm({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordErrors({});
      } else {
        throw new Error(response?.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(
        error.message || "Failed to change password. Please try again."
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return;
    }

    try {
      setLoading(true);

      // Tạo FormData đúng chuẩn API
      const formData = new FormData();
      formData.append("Dob", editedProfile.dob ? toAPIDateFormat(editedProfile.dob) : "");
      formData.append("Address", editedProfile.address || "");
      formData.append("PhoneNumber", editedProfile.phoneNumber || "");
      formData.append("Gender", editedProfile.gender || "");
      // Chỉ gửi AvatarImage nếu là file object (user vừa chọn ảnh mới)
      if (editedProfile.avatar && typeof editedProfile.avatar !== "string") {
        formData.append("AvatarImage", editedProfile.avatar);
      }
      // Debug: log FormData
      for (let pair of formData.entries()) {
        console.log(pair[0]+ ':', pair[1]);
      }

      const response = await updateProfileApi.updateProfile(formData);
      if (response && response.isSuccess) {
        setProfile((prev) => ({ ...prev, ...editedProfile }));
        setIsEditing(false);
        toast.success("Profile updated successfully");
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
      <div className="min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-3 text-indigo-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-72 bg-gradient-to-b from-indigo-50 to-purple-50 border-r border-gray-200">
          <div className="flex flex-col items-center py-8 px-4">
            <div className="relative">
              <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                <img
                  src={
                    isEditing
                      ? editedProfile.avatar
                      : profile.avatar || "https://via.placeholder.com/150"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors duration-200 shadow-md">
                  <FaCamera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-800">
              {profile.fullName || "Student"}
            </h2>
            <p className="text-indigo-600 text-sm">
              {profile.roleName || "Student"}
            </p>
            <div className="mt-2 flex items-center bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></div>
              <span>Active Student</span>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <div className="mt-2 pb-6">
            <button
              onClick={() => setActiveTab("info")}
              className={`w-full flex items-center px-6 py-3 transition-colors ${
                activeTab === "info"
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-indigo-50 text-gray-700"
              }`}
            >
              <FaUser className="w-4 h-4 mr-3" />
              <span className="text-sm font-medium">Personal Information</span>
              <FaChevronRight className="w-3 h-3 ml-auto" />
            </button>
            <button
              onClick={() => setActiveTab("academic")}
              className={`w-full flex items-center px-6 py-3 transition-colors ${
                activeTab === "academic"
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-indigo-50 text-gray-700"
              }`}
            >
              <FaIdCard className="w-4 h-4 mr-3" />
              <span className="text-sm font-medium">Academic Information</span>
              <FaChevronRight className="w-3 h-3 ml-auto" />
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center px-6 py-3 transition-colors ${
                activeTab === "security"
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-indigo-50 text-gray-700"
              }`}
            >
              <FaShieldAlt className="w-4 h-4 mr-3" />
              <span className="text-sm font-medium">Security</span>
              <FaChevronRight className="w-3 h-3 ml-auto" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 md:p-8">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {activeTab === "info" && "Personal Information"}
                {activeTab === "academic" && "Academic Information"}
                {activeTab === "security" && "Security Settings"}
              </h1>
              <p className="text-gray-500 mt-1">
                {activeTab === "info" && "Manage your personal details"}
                {activeTab === "academic" && "View your academic records"}
                {activeTab === "security" && "Manage account security"}
              </p>
            </div>
            {activeTab === "info" && (
              <button
                onClick={handleEditToggle}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isEditing
                    ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {isEditing ? (
                  <>
                    <FaTimes className="mr-2" /> Cancel
                  </>
                ) : (
                  <>
                    <FaEdit className="mr-2" /> Edit Profile
                  </>
                )}
              </button>
            )}
          </div>

          {activeTab === "info" && (
            <>
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">
                        Basic Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            value={editedProfile.fullName || ""}
                            className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed text-gray-500"
                            readOnly
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Name cannot be changed
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={editedProfile.email || ""}
                            className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed text-gray-500"
                            readOnly
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Email cannot be changed
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Gender
                          </label>
                          <select
                            name="gender"
                            value={editedProfile.gender || ""}
                            onChange={handleInputChange}
                            className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                              formErrors.gender
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300"
                            }`}
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
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            name="dob"
                            value={editedProfile.dob || ""}
                            onChange={handleInputChange}
                            className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                              formErrors.dob
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300"
                            }`}
                          />
                          {formErrors.dob && (
                            <p className="text-sm text-red-600 mt-1">
                              {formErrors.dob}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">
                        Contact Details
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={editedProfile.phoneNumber || ""}
                            onChange={handleInputChange}
                            className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                              formErrors.phoneNumber
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300"
                            }`}
                            placeholder="Enter your phone number"
                          />
                          {formErrors.phoneNumber && (
                            <p className="text-sm text-red-600 mt-1">
                              {formErrors.phoneNumber}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={editedProfile.address || ""}
                            onChange={handleInputChange}
                            className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                              formErrors.address
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300"
                            }`}
                            placeholder="Enter your address"
                          />
                          {formErrors.address && (
                            <p className="text-sm text-red-600 mt-1">
                              {formErrors.address}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                          </label>
                          <input
                            type="text"
                            name="roleName"
                            value={editedProfile.roleName || ""}
                            className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed text-gray-500"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 mt-8">
                    <button
                      type="button"
                      onClick={handleEditToggle}
                      className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200 shadow-sm"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          <span>Saving...</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <FaSave className="mr-2" />
                          <span>Save Changes</span>
                        </div>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">
                      Basic Information
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <FaUser className="w-3.5 h-3.5 text-indigo-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-xs font-medium text-gray-500">
                            Full Name
                          </p>
                          <p className="text-sm text-gray-800 font-semibold mt-0.5">
                            {profile.fullName || "Not provided"}
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <FaEnvelope className="w-3.5 h-3.5 text-indigo-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-xs font-medium text-gray-500">
                            Email
                          </p>
                          <p className="text-sm text-gray-800 font-semibold mt-0.5 break-all">
                            {profile.email || "Not provided"}
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <FaVenusMars className="w-3.5 h-3.5 text-indigo-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-xs font-medium text-gray-500">
                            Gender
                          </p>
                          <p className="text-sm text-gray-800 font-semibold mt-0.5">
                            {profile.gender || "Not provided"}
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <FaBirthdayCake className="w-3.5 h-3.5 text-indigo-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-xs font-medium text-gray-500">
                            Date of Birth
                          </p>
                          <p className="text-sm text-gray-800 font-semibold mt-0.5">
                            {profile.dob || "Not provided"}
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">
                      Contact Details
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <FaPhone className="w-3.5 h-3.5 text-purple-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-xs font-medium text-gray-500">
                            Phone Number
                          </p>
                          <p className="text-sm text-gray-800 font-semibold mt-0.5">
                            {profile.phoneNumber || "Not provided"}
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <FaMapMarkerAlt className="w-3.5 h-3.5 text-purple-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-xs font-medium text-gray-500">
                            Address
                          </p>
                          <p className="text-sm text-gray-800 font-semibold mt-0.5">
                            {profile.address || "Not provided"}
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <FaIdCard className="w-3.5 h-3.5 text-purple-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-xs font-medium text-gray-500">
                            Role
                          </p>
                          <p className="text-sm text-gray-800 font-semibold mt-0.5">
                            {profile.roleName || "Not provided"}
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "academic" && (
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <FaIdCard className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">
                      Student Code
                    </p>
                    <p className="text-sm text-gray-800 font-semibold mt-0.5">
                      {profile.studentCode || "Not provided"}
                    </p>
                  </div>
                </li>
                <li className="border-t border-gray-100 pt-4 flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <FaCheck className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Role</p>
                    <p className="text-sm text-gray-800 font-semibold mt-0.5">
                      {profile.roleName || "Not provided"}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <FaShieldAlt className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800">
                      Account Security Status
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Your account is secure and up to date
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                  Secure
                </span>
              </div>

              <form onSubmit={handlePasswordSubmit} className="max-w-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Change Password
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        name="oldPassword"
                        value={passwordForm.oldPassword}
                        onChange={handlePasswordChange}
                        className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          passwordErrors.oldPassword
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {passwordErrors.oldPassword && (
                      <p className="text-sm text-red-600 mt-1">
                        {passwordErrors.oldPassword}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          passwordErrors.newPassword
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {passwordErrors.newPassword && (
                      <p className="text-sm text-red-600 mt-1">
                        {passwordErrors.newPassword}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          passwordErrors.confirmPassword
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {passwordErrors.confirmPassword && (
                      <p className="text-sm text-red-600 mt-1">
                        {passwordErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200 shadow-sm flex items-center justify-center"
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        <span>Changing Password...</span>
                      </>
                    ) : (
                      <>
                        <FaLock className="mr-2" />
                        <span>Change Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
