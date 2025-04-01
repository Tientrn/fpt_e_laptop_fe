import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaEdit, FaBirthdayCake, FaVenusMars, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import userinfoApi from '../../api/userinfoApi';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    studentCode: '',
    roleName: '',
    gender: '',
    dob: '',
    address: '',
    avatar: null,
    enrollmentDate: ''
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
        // Map API response to our profile structure
        const userData = {
          fullName: response.data.fullName || '',
          email: response.data.email || '',
          phoneNumber: response.data.phoneNumber || '',
          studentCode: response.data.studentCode || '',
          roleName: response.data.roleName || '',
          gender: response.data.gender || '',
          dob: response.data.dob || '',
          address: response.data.address || '',
          avatar: response.data.avatar || null,
          enrollmentDate: response.data.enrollmentDate || ''
        };
        
        setProfile(userData);
      } else {
        toast.error('Failed to load profile information');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile information');
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setIsEditing(false);
    } else {
      // Start editing
      setEditedProfile({...profile});
      setIsEditing(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: value
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProfile({
          ...editedProfile,
          avatar: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Replace with actual API call when available
      // const response = await userApi.updateProfile(editedProfile);
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfile(editedProfile);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile.fullName) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">My Profile</h1>
        <button
          onClick={handleEditToggle}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <FaEdit className="mr-1" />
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          {/* Avatar Section - Centered at the top */}
          <div className="flex justify-center mb-4">
            <div className="flex flex-col items-center">
              <img
                src={editedProfile.avatar || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-200"
              />
              <label className="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 cursor-pointer text-xs">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
              <p className="mt-1 font-medium text-blue-600">{profile.roleName}</p>
            </div>
          </div>

          {/* Form Fields - Organized in 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={editedProfile.fullName || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={editedProfile.email || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-sm"
                readOnly
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={editedProfile.phoneNumber || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700">Student Code</label>
              <input
                type="text"
                name="studentCode"
                value={editedProfile.studentCode || ''}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-sm"
                readOnly
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={editedProfile.dob || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                value={editedProfile.gender || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-sm"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={editedProfile.address || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700">Enrollment Date</label>
              <input
                type="date"
                name="enrollmentDate"
                value={editedProfile.enrollmentDate || ''}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-sm"
                readOnly
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={handleEditToggle}
              className="px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4">
          {/* Avatar Section - Centered at the top */}
          <div className="flex justify-center mb-4">
            <div className="flex flex-col items-center">
              <img
                src={profile.avatar || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-blue-200"
              />
              <p className="mt-1 text-xs font-medium text-blue-600">{profile.roleName}</p>
            </div>
          </div>

          {/* Profile Info - Organized in 2 columns with consistent styling */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FaUser className="text-blue-600 text-sm" />
                </div>
                <div className="ml-3">
                  <p className=" uppercase font-semibold text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-800 truncate text-sm">{profile.fullName || 'Not provided'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FaEnvelope className="text-blue-600 text-sm" />
                </div>
                <div className="ml-3">
                  <p className="text-xs uppercase font-semibold text-gray-500">Email</p>
                  <p className="font-medium text-gray-800 truncate text-sm">{profile.email || 'Not provided'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FaPhone className="text-blue-600 text-sm" />
                </div>
                <div className="ml-3">
                  <p className="text-xs uppercase font-semibold text-gray-500">Phone Number</p>
                  <p className="font-medium text-gray-800 truncate text-sm">{profile.phoneNumber || 'Not provided'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FaIdCard className="text-blue-600 text-sm" />
                </div>
                <div className="ml-3">
                  <p className="text-xs uppercase font-semibold text-gray-500">Student Code</p>
                  <p className="font-medium text-gray-800 truncate text-sm">{profile.studentCode || 'Not provided'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FaBirthdayCake className="text-blue-600 text-sm" />
                </div>
                <div className="ml-3">
                  <p className="text-xs uppercase font-semibold text-gray-500">Date of Birth</p>
                  <p className="font-medium text-gray-800 truncate text-sm">{profile.dob || 'Not provided'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FaVenusMars className="text-blue-600 text-sm" />
                </div>
                <div className="ml-3">
                  <p className="text-xs uppercase font-semibold text-gray-500">Gender</p>
                  <p className="font-medium text-gray-800 truncate text-sm">{profile.gender || 'Not provided'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FaMapMarkerAlt className="text-blue-600 text-sm" />
                </div>
                <div className="ml-3">
                  <p className="text-xs uppercase font-semibold text-gray-500">Role</p>
                  <p className="font-medium text-gray-800 truncate text-sm">{profile.roleName || 'Not provided'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FaCalendarAlt className="text-blue-600 text-sm" />
                </div>
                <div className="ml-3">
                  <p className="text-xs uppercase font-semibold text-gray-500">Enrollment Date</p>
                  <p className="font-medium text-gray-800 truncate text-sm">{profile.enrollmentDate || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage; 