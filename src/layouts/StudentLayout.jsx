import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { FaUser, FaClipboardList, FaFileContract, FaSignOutAlt, FaBars, FaHome } from 'react-icons/fa';
import { toast } from 'react-toastify';

const StudentLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      path: '/student/profile',
      name: 'My Profile',
      icon: <FaUser className="w-5 h-5" />
    },
    {
      path: '/student/requests',
      name: 'My Requests',
      icon: <FaClipboardList className="w-5 h-5" />
    },
    {
      path: '/student/contractstudent',
      name: 'My Contracts',
      icon: <FaFileContract className="w-5 h-5" />
    }
  ];

  const handleLogout = () => {
    try {
      // Clear all stored data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Show success message
      toast.success('Logged out successfully');
      
      // Redirect to login page
      navigate('/login');
    } catch (error) {
      toast.error('Error logging out');
      console.error('Logout error:', error);
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Changed from purple-800 to blue-800 */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-blue-800 text-white transition-all duration-300 ease-in-out`}>
        <div className="p-4 flex justify-between items-center">
          <h2 className={`text-2xl ml-4 font-bold ${!isSidebarOpen && 'hidden'}`}>Student</h2>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaBars className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="mt-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-lg
                ${location.pathname === item.path 
                  ? 'bg-blue-900 border-l-4 border-white' 
                  : 'hover:bg-blue-700'
                }`}
            >
              {item.icon}
              <span className={`ml-3 ${!isSidebarOpen && 'hidden'}`}>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with Home and Logout */}
        <header className="bg-white shadow-md">
          <div className="flex justify-end items-center px-6 py-4">
            <button
              onClick={handleGoHome}
              className="flex items-center px-4 py-2 mr-4 text-sm font-medium text-blue-600 
                       bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
            >
              <FaHome className="w-5 h-5 mr-2" />
              Home
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-red-600 
                       bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
            >
              <FaSignOutAlt className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentLayout; 