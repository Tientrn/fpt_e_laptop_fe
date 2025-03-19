import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Please login to view profile</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="max-w-3xl mx-auto mb-6">
        <button
          onClick={() => navigate('/')}
          className="group flex items-center px-4 py-2 text-sm font-medium rounded-lg
                   bg-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 
                   transition-all duration-200 text-gray-700 hover:text-blue-600
                   border border-gray-200 hover:border-blue-600"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2 transition-transform duration-200 
                     group-hover:-translate-x-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" 
            />
          </svg>
          Return to Homepage
        </button>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 px-8 py-10">
          <div className="flex items-center">
            <div className="relative">
              <img
                src={user.profileImage || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white"
              />
              {user.roleId === 3 && (
                <span className="absolute bottom-0 right-0 bg-green-500 p-1 rounded-full">
                  <span className="block h-4 w-4 bg-white rounded-full"></span>
                </span>
              )}
            </div>
            <div className="ml-6">
              <h1 className="text-3xl font-bold text-white">{user.username}</h1>
              <p className="text-blue-100">{user.role.name}</p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Basic Information</h2>
              
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <p className="text-gray-800 font-medium">{user.email}</p>
              </div>

              <div>
                <label className="text-sm text-gray-600">Phone Number</label>
                <p className="text-gray-800 font-medium">{user.phoneNumber || "Not provided"}</p>
              </div>

              <div>
                <label className="text-sm text-gray-600">Address</label>
                <p className="text-gray-800 font-medium">{user.address || "Not provided"}</p>
              </div>
            </div>

            {/* Student Information (Only for Users/Students) */}
            {user.roleId === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Student Information</h2>
                
                <div>
                  <label className="text-sm text-gray-600">Student ID</label>
                  <p className="text-gray-800 font-medium">{user.studentId || "Not provided"}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Faculty</label>
                  <p className="text-gray-800 font-medium">{user.faculty || "Not provided"}</p>
                </div>

                {user.studentImage && (
                  <div>
                    <label className="text-sm text-gray-600">Student Card</label>
                    <img
                      src={user.studentImage}
                      alt="Student Card"
                      className="mt-2 max-w-full h-auto rounded-lg border"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Edit Profile Button */}
          <div className="mt-8 flex justify-end">
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                       transition duration-200 transform hover:scale-[1.02]"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
} 