import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaChartLine, 
  FaUsers, 
  FaFileAlt, 
  FaExclamationTriangle,
  FaSignOutAlt, 
  FaBars 
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      path: '/admin/accounts',
      name: 'Account',
      icon: <FaUsers className="w-5 h-5" />
    },
    {
      path: '/admin/shopmanagement',
      name: 'Shop ',
      icon: <FaFileAlt className="w-5 h-5" />
    },
    {
      path: '/admin/analytics',
      name: 'Analytics',
      icon: <FaChartLine className="w-5 h-5" />
    },
    {
      path: '/admin/reports',
      name: 'Reports',
      icon: <FaExclamationTriangle className="w-5 h-5" />
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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-indigo-800 text-white transition-all duration-300 ease-in-out`}>
        <div className="p-4 flex justify-between items-center">
          <h2 className={`text-2xl ml-4 font-bold ${!isSidebarOpen && 'hidden'}`}>Admin</h2>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-indigo-700 transition-colors"
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
                  ? 'bg-indigo-900 border-l-4 border-white' 
                  : 'hover:bg-indigo-700'
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
        {/* Header with Logout */}
        <header className="bg-white shadow-md">
          <div className="flex justify-end items-center px-6 py-4">
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 
                       hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <FaSignOutAlt className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 