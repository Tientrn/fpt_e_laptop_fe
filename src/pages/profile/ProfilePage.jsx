import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setEditedUser(parsedUser);
    }
    setLoading(false);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Tạm thời lưu vào localStorage
    localStorage.setItem('user', JSON.stringify(editedUser));
    setUser(editedUser);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Please login to view profile</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="max-w-5xl mx-auto mb-6">
        <button
          onClick={() => navigate('/')}
          className="group flex items-center px-4 py-2 text-sm font-medium rounded-lg
                   bg-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 
                   transition-all duration-200 text-gray-700 hover:text-blue-600
                   border border-gray-200 hover:border-blue-600"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2 transition-transform duration-200 group-hover:-translate-x-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Return to Homepage
        </button>
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header Section with Avatar */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 px-8 py-10">
          <div className="flex items-center">
            <div className="relative group">
              <img
                src={user.avatar || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-sm">Change Avatar</span>
                </div>
              )}
            </div>
            <div className="ml-6">
              <h1 className="text-3xl font-bold text-white">{user.username}</h1>
              <p className="text-blue-100">{user.role}</p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="px-8 py-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">Profile Information</h2>
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`px-6 py-2 rounded-lg transition duration-200 transform hover:scale-[1.02]
                          ${isEditing 
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="username"
                      value={editedUser.username}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{user.username}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editedUser.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{user.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
                  <p className="text-gray-800 font-medium">{user.role}</p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dob"
                      value={editedUser.dob || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">
                      {user.dob ? format(new Date(user.dob), 'dd/MM/yyyy') : 'Not provided'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={editedUser.phoneNumber || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{user.phoneNumber || 'Not provided'}</p>
                  )}
                </div>

                {isEditing && (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="w-full px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 
                             transition duration-200 transform hover:scale-[1.02]"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
} 