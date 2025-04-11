import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import registerApi from "../../api/registerApi";

const RegisterPage = () => {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    dob: "",
    address: "",
    phoneNumber: "",
    roleId: "", // 2 - student, 3 - sponsor, 6 - shop
    gender: "",
    avatarImage: undefined,
    password: "",
    confirmPassword: "",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [studentCardPreview, setStudentCardPreview] = useState(null);
  const [studentData, setStudentData] = useState({
    studentCode: "",
    identityCard: "",
    enrollmentDate: "",
    studentCardImage: undefined,
  });

  const validate = () => {
    const newErrors = {};

    // Email
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
      newErrors.email = "Invalid email";
    }

    // Password
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm Password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Phone number
    if (!formData.phoneNumber.match(/^\d{9,15}$/)) {
      newErrors.phoneNumber = "Invalid phone number";
    }

    // DOB (use ISO format or check dd-mm-yyyy format)
    if (
      !formData.dob.match(/^\d{2}-\d{2}-\d{4}$/) &&
      !formData.dob.match(/^\d{4}-\d{2}-\d{2}$/)
    ) {
      newErrors.dob = "Invalid date of birth format";
    }

    // Student fields if student
    if (parseInt(formData.roleId) === 2) {
      if (!studentData.studentCode.match(/^[A-Za-z]{2}\d{6}$/)) {
        newErrors.studentCode =
          "Student code must consist of 2 letters followed by 6 digits (e.g., IT230001)";
      }
      if (!studentData.identityCard.match(/^\d{9,12}$/)) {
        newErrors.identityCard = "Invalid ID card number";
      }
      if (!studentData.enrollmentDate) {
        newErrors.enrollmentDate = "Please select enrollment date";
      }
      if (!studentData.studentCardImage) {
        newErrors.studentCardImage = "Please upload student card image";
      } else if (
        !["image/jpeg", "image/png", "image/jpg"].includes(
          studentData.studentCardImage.type
        )
      ) {
        newErrors.studentCardImage = "Image must be in jpg/jpeg/png format";
      } else if (studentData.studentCardImage.size > 2 * 1024 * 1024) {
        newErrors.studentCardImage = "Image must not exceed 2MB";
      }
    }

    // Avatar validation
    if (formData.avatarImage) {
      if (!["image/jpeg", "image/png", "image/jpg"].includes(formData.avatarImage.type)) {
        newErrors.avatarImage = "Avatar must be in jpg/jpeg/png format";
      } else if (formData.avatarImage.size > 2 * 1024 * 1024) {
        newErrors.avatarImage = "Avatar must not exceed 2MB";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add new function for real-time password validation
  const validateConfirmPassword = (password, confirmPassword) => {
    if (confirmPassword && password !== confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: "Passwords do not match"
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        confirmPassword: undefined
      }));
    }
  };

  const handleStudentChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "studentCardImage" && files?.[0]) {
      setStudentData(prev => ({
        ...prev,
        studentCardImage: files[0]
      }));
      // Create preview URL for student card image
      const previewUrl = URL.createObjectURL(files[0]);
      setStudentCardPreview(previewUrl);
    } else {
      setStudentData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        avatarImage: file
      }));
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value,
      };
      
      // Check password match when either password or confirmPassword changes
      if (name === "password" || name === "confirmPassword") {
        validateConfirmPassword(
          name === "password" ? value : newData.password,
          name === "confirmPassword" ? value : newData.confirmPassword
        );
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const roleId = parseInt(formData.roleId);

      if (roleId === 2) {
        // If Student, call student API
        const form = new FormData();
        // Required fields
        form.append("Email", formData.email);
        form.append("FullName", formData.fullName);
        form.append("Dob", formData.dob);
        form.append("Address", formData.address);
        form.append("PhoneNumber", formData.phoneNumber);
        form.append("Gender", formData.gender);
        form.append("Password", formData.password);
        form.append("StudentCode", studentData.studentCode);
        form.append("IdentityCard", studentData.identityCard);
        form.append("EnrollmentDate", studentData.enrollmentDate);
        form.append("StudentCardImage", studentData.studentCardImage);
        if (formData.avatarImage) {
          form.append("AvatarImage", formData.avatarImage);
        }

        const response = await registerApi.registerStudent(form);
        if (response.isSuccess) {
          toast.success("Registration successful! Redirecting to login page...", {
            position: "top-right",
            autoClose: 1500,
          });

          setTimeout(() => {
            navigate("/login", {
              state: { showRegisterSuccess: true },
              replace: true,
            });
          }, 1500);
        } else {
          toast.error(response.message || "Registration failed!");
        }
      } else {
        // If Sponsor or Shop, call regular API
        const form = new FormData();
        form.append("Email", formData.email);
        form.append("FullName", formData.fullName);
        form.append("Dob", formData.dob);
        form.append("Address", formData.address);
        form.append("PhoneNumber", formData.phoneNumber);
        form.append("Gender", formData.gender);
        form.append("Password", formData.password);
        form.append("RoleId", roleId);
        if (formData.avatarImage) {
          form.append("AvatarImage", formData.avatarImage);
        }

        const response = await registerApi.register(form);
        if (response.isSuccess) {
          toast.success("Registration successful! Redirecting to login page...", {
            position: "top-right",
            autoClose: 1500,
          });

          setTimeout(() => {
            navigate("/login", {
              state: { showRegisterSuccess: true },
              replace: true,
            });
          }, 1500);
        } else {
          toast.error(response.message || "Registration failed!");
        }
      }
    } catch (err) {
      console.error("Registration failed:", err);
      toast.error(
        err.response?.data?.message ||
        "Registration failed, please try again!"
      );
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: 0.2 },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <motion.div
        className="flex w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="hidden md:block w-1/2 bg-amber-100 p-8 relative overflow-hidden">
          <motion.div
            className="flex flex-col items-center justify-center h-full"
            initial={{ opacity: 0, x: -50 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: { duration: 0.8, delay: 0.3 },
            }}
          >
            <motion.img
              src="https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_1280.jpg"
              alt="Join LaptopSharing"
              className="w-3/4 mb-6 rounded-lg shadow-md"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1, transition: { duration: 0.6 } }}
            />
            <h2 className="text-2xl font-bold text-amber-800">Join Us!</h2>
            <p className="text-sm text-amber-600 text-center mt-2">
              Create an account to start sharing and borrowing laptops.
            </p>
          </motion.div>
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <motion.div
              className="w-32 h-32 bg-amber-200 rounded-full absolute -top-16 -left-16 opacity-50"
              animate={{
                y: [0, 20, 0],
                transition: { duration: 4, repeat: Infinity },
              }}
            />
            <motion.div
              className="w-24 h-24 bg-amber-300 rounded-full absolute bottom-0 right-0 opacity-50"
              animate={{
                y: [0, -20, 0],
                transition: { duration: 3, repeat: Infinity },
              }}
            />
          </div>
        </div>

        <motion.div
          className="w-full md:w-1/2 p-8 space-y-6 overflow-y-auto max-h-screen"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center">
            <motion.h1
              className="text-3xl font-bold text-black"
              initial={{ y: -20, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                transition: { duration: 0.5, delay: 0.4 },
              }}
            >
              LaptopSharing
            </motion.h1>
            <p className="text-sm text-slate-600 mt-1">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 ring-red-500"
                    : "border-slate-300 focus:ring-amber-500"
                }`}
                placeholder="Your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-500 ring-red-500"
                    : "border-slate-300 focus:ring-amber-500"
                }`}
                placeholder="Your password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onPaste={(e) => e.preventDefault()} // Prevent pasting for security
                required
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.confirmPassword
                    ? "border-red-500 ring-red-500"
                    : "border-slate-300 focus:ring-amber-500"
                }`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.phoneNumber
                    ? "border-red-500 ring-red-500"
                    : "border-slate-300 focus:ring-amber-500"
                }`}
                placeholder="Your phoneNumber"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Your address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Date of Birth (dd-mm-yyyy)
              </label>
              <input
                type="text"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.dob
                    ? "border-red-500 ring-red-500"
                    : "border-slate-300 focus:ring-amber-500"
                }`}
                placeholder="Your Dob"
              />
              {errors.dob && (
                <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">-- Select gender --</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Avatar Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {errors.avatarImage && (
                <p className="text-red-500 text-sm mt-1">{errors.avatarImage}</p>
              )}
              {avatarPreview && (
                <div className="flex justify-center mt-2">
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="h-24 w-24 rounded-full object-cover shadow"
                  />
                </div>
              )}
              <p className="text-sm text-slate-500 mt-1">
                Please upload an image file (JPG, PNG) less than 2MB
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Role
              </label>
              <select
                name="roleId"
                value={formData.roleId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">-- Select role --</option>
                <option value="2">Student</option>
                <option value="3">Sponsor</option>
                <option value="6">Shop</option>
              </select>
            </div>
            {formData.roleId === "2" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Student Code
                  </label>
                  <input
                    type="text"
                    name="studentCode"
                    value={studentData.studentCode}
                    onChange={handleStudentChange}
                    required
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.studentCode
                        ? "border-red-500 ring-red-500"
                        : "border-slate-300 focus:ring-amber-500"
                    }`}
                    placeholder="Your studentCode"
                  />
                  {errors.studentCode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.studentCode}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Identity Card
                  </label>
                  <input
                    type="text"
                    name="identityCard"
                    value={studentData.identityCard}
                    onChange={handleStudentChange}
                    required
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.identityCard
                        ? "border-red-500 ring-red-500"
                        : "border-slate-300 focus:ring-amber-500"
                    }`}
                    placeholder="Your identityCard"
                  />
                  {errors.identityCard && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.identityCard}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Enrollment Date
                  </label>
                  <input
                    type="date"
                    name="enrollmentDate"
                    value={studentData.enrollmentDate}
                    onChange={handleStudentChange}
                    required
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.enrollmentDate
                        ? "border-red-500 ring-red-500"
                        : "border-slate-300 focus:ring-amber-500"
                    }`}
                    placeholder="Your enrollmentDate"
                  />
                  {errors.enrollmentDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.enrollmentDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Student Card Image
                  </label>
                  <input
                    type="file"
                    name="studentCardImage"
                    accept="image/*"
                    onChange={handleStudentChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {errors.studentCardImage && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.studentCardImage}
                    </p>
                  )}
                  {studentCardPreview && (
                    <div className="flex justify-center mt-2">
                      <img
                        src={studentCardPreview}
                        alt="Student Card Preview"
                        className="h-40 w-64 object-cover rounded-lg shadow"
                      />
                    </div>
                  )}
                  <p className="text-sm text-slate-500 mt-1">
                    Please ensure the image is clear and all information on the card is visible.
                  </p>
                </div>
              </>
            )}
            <motion.button
              type="submit"
              className="w-full py-2 px-4 bg-amber-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 shadow-md"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Register
            </motion.button>
          </form>

          <p className="text-center text-sm text-black">
            Already have an account?{" "}
            <a href="/login" className="text-amber-600 hover:underline">
              Sign in
            </a>
          </p>
        </motion.div>
      </motion.div>
      <ToastContainer />
    </div>
  );
};

export default RegisterPage;
