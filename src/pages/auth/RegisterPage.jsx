import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import registerApi from "../../api/registerApi";
import { Link } from "react-router-dom";

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

  const [touched, setTouched] = useState({});

  // Function to validate a single field
  const validateField = (name, value) => {
    let error = null;

    switch (name) {
      case "email":
        if (value && !value.match(/^\S+@\S+\.\S+$/)) {
          error = "Invalid email format";
        }
        break;
      case "password":
        if (value && value.length < 6) {
          error = "Password must be at least 6 characters";
        }
        break;
      case "confirmPassword":
        if (value && value !== formData.password) {
          error = "Passwords do not match";
        }
        break;
      case "phoneNumber":
        if (value && !value.match(/^\d{9,15}$/)) {
          error = "Invalid phone number format (must be 9-15 digits)";
        }
        break;
      case "dob":
        if (
          value &&
          !value.match(/^\d{2}-\d{2}-\d{4}$/) &&
          !value.match(/^\d{4}-\d{2}-\d{2}$/)
        ) {
          error = "Invalid date format";
        }
        break;
      case "studentCode":
        if (value && !value.match(/^[A-Za-z]{2}\d{6}$/)) {
          error =
            "Student code must consist of 2 letters followed by 6 digits (e.g., IT230001)";
        }
        break;
      case "identityCard":
        if (value && !value.match(/^\d{9,12}$/)) {
          error = "Invalid ID card number (must be 9-12 digits)";
        }
        break;
      case "avatarImage":
        if (value) {
          if (!["image/jpeg", "image/png", "image/jpg"].includes(value.type)) {
            error = "Avatar must be in jpg/jpeg/png format";
          } else if (value.size > 2 * 1024 * 1024) {
            error = "Avatar must not exceed 2MB";
          }
        }
        break;
      case "studentCardImage":
        if (value) {
          if (!["image/jpeg", "image/png", "image/jpg"].includes(value.type)) {
            error = "Student card image must be in jpg/jpeg/png format";
          } else if (value.size > 2 * 1024 * 1024) {
            error = "Student card image must not exceed 2MB";
          }
        }
        break;
      default:
        break;
    }

    return error;
  };

  // Validate all fields for form submission
  const validateAllFields = () => {
    const newErrors = {};

    // Validate all formData fields
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    // Validate student fields if student role is selected
    if (parseInt(formData.roleId) === 2) {
      Object.keys(studentData).forEach((key) => {
        const error = validateField(key, studentData[key]);
        if (error) newErrors[key] = error;
      });

      // Additional validation for required student fields
      if (!studentData.studentCode)
        newErrors.studentCode = "Student code is required";
      if (!studentData.identityCard)
        newErrors.identityCard = "Identity card number is required";
      if (!studentData.enrollmentDate)
        newErrors.enrollmentDate = "Enrollment date is required";
      if (!studentData.studentCardImage)
        newErrors.studentCardImage = "Student card image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validate the field on blur
    const value = formData[name];
    const error = validateField(name, value);

    // Update errors state
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleStudentBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validate the field on blur
    const value = studentData[name];
    const error = validateField(name, value);

    // Update errors state
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleStudentChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "studentCardImage" && files?.[0]) {
      const file = files[0];
      setStudentData((prev) => ({
        ...prev,
        studentCardImage: file,
      }));

      // Create preview URL for student card image
      const previewUrl = URL.createObjectURL(file);
      setStudentCardPreview(previewUrl);

      // Validate file immediately
      const error = validateField(name, file);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    } else {
      setStudentData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Validate field immediately if it's been touched
      if (touched[name]) {
        const error = validateField(name, value);
        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        avatarImage: file,
      }));

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);

      // Validate file immediately
      const error = validateField("avatarImage", file);
      setErrors((prev) => ({
        ...prev,
        avatarImage: error,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: value,
      };

      // Special check for password and confirmPassword
      if (name === "password" && touched.confirmPassword) {
        // If password changes and confirmPassword has been touched, validate confirmPassword
        const confirmError = validateField(
          "confirmPassword",
          prev.confirmPassword
        );
        setErrors((prev) => ({
          ...prev,
          confirmPassword: confirmError,
        }));
      }

      return newData;
    });

    // Validate field immediately if it's been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  // Update confirmPassword validation when password changes
  useEffect(() => {
    if (touched.confirmPassword && formData.confirmPassword) {
      const error = validateField("confirmPassword", formData.confirmPassword);
      setErrors((prev) => ({
        ...prev,
        confirmPassword: error,
      }));
    }
  }, [formData.password, touched.confirmPassword, formData.confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Touch all fields to show validation errors
    const allFields = {
      ...Object.keys(formData).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      ),
    };
    if (parseInt(formData.roleId) === 2) {
      Object.keys(studentData).forEach((key) => {
        allFields[key] = true;
      });
    }
    setTouched(allFields);

    // Validate all fields
    if (!validateAllFields()) {
      toast.error("Please correct the errors in the form.");
      return;
    }

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
          toast.success(
            "Registration successful! Redirecting to login page...",
            {
              position: "top-right",
              autoClose: 1500,
            }
          );

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
          toast.success(
            "Registration successful! Redirecting to login page...",
            {
              position: "top-right",
              autoClose: 1500,
            }
          );

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
        err.response?.data?.message || "Registration failed, please try again!"
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
            <motion.button
              onClick={() => navigate("/")}
              className="mt-6 px-6 py-2 bg-amber-600 text-white rounded-full flex items-center gap-2 hover:bg-amber-700 transition-colors shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Back to Home
            </motion.button>
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
                onBlur={handleBlur}
                required
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 ring-red-500"
                    : "border-slate-300 focus:ring-amber-500"
                }`}
                placeholder="your@email.com"
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
                onBlur={handleBlur}
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
                onBlur={handleBlur}
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
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
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
                onBlur={handleBlur}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Your full name"
              />
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
                onBlur={handleBlur}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Your address"
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
                onBlur={handleBlur}
                required
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.phoneNumber
                    ? "border-red-500 ring-red-500"
                    : "border-slate-300 focus:ring-amber-500"
                }`}
                placeholder="Your phone number"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.dob
                    ? "border-red-500 ring-red-500"
                    : "border-slate-300 focus:ring-amber-500"
                }`}
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
                onBlur={handleBlur}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Avatar Image
              </label>
              <input
                type="file"
                name="avatarImage"
                accept="image/*"
                onChange={handleAvatarChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.avatarImage
                    ? "border-red-500 ring-red-500"
                    : "border-slate-300 focus:ring-amber-500"
                }`}
              />
              {errors.avatarImage && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.avatarImage}
                </p>
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
                onBlur={handleBlur}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Select role</option>
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
                    onBlur={handleStudentBlur}
                    required
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.studentCode
                        ? "border-red-500 ring-red-500"
                        : "border-slate-300 focus:ring-amber-500"
                    }`}
                    placeholder="Your student code"
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
                    onBlur={handleStudentBlur}
                    required
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.identityCard
                        ? "border-red-500 ring-red-500"
                        : "border-slate-300 focus:ring-amber-500"
                    }`}
                    placeholder="Your identity card number"
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
                    onBlur={handleStudentBlur}
                    required
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.enrollmentDate
                        ? "border-red-500 ring-red-500"
                        : "border-slate-300 focus:ring-amber-500"
                    }`}
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
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.studentCardImage
                        ? "border-red-500 ring-red-500"
                        : "border-slate-300 focus:ring-amber-500"
                    }`}
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
                    Please ensure the image is clear and all information on the
                    card is visible.
                  </p>
                </div>
              </>
            )}

            <div>
              <motion.button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Register
              </motion.button>
            </div>
          </form>

          <p className="text-center text-sm text-black">
            Already have an account?{" "}
            <Link to="/login" className="text-amber-600 hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </motion.div>
      <ToastContainer />
    </div>
  );
};

export default RegisterPage;
