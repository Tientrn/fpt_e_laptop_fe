import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import userApi from '../../api/userApi';
import shopApi from '../../api/shopApi';
import { toast } from 'react-toastify';

export default function AnalyticPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalShops: 0,
    activeShops: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch users data
        const usersResponse = await userApi.getAllUsers();
        if (!usersResponse.isSuccess) {
          throw new Error("Failed to fetch users");
        }
        const users = usersResponse.data;
        
        // Fetch shops data
        const shopsResponse = await shopApi.getAllShops();
        if (!shopsResponse.isSuccess) {
          throw new Error("Failed to fetch shops");
        }
        const shops = shopsResponse.data;

        // Calculate stats
        const totalUsers = users.length;
        const activeUsers = users.filter(user => user.status === "Active").length;
        const totalShops = shops.length;
        const activeShops = shops.filter(shop => shop.status === "Active").length;

        setStats({
          totalUsers,
          activeUsers,
          totalShops,
          activeShops
        });

      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const data = [
    { name: 'Jan', users: 4000, shops: 2400 },
    { name: 'Feb', users: 3000, shops: 1398 },
    { name: 'Mar', users: 2000, shops: 9800 },
    { name: 'Apr', users: 2780, shops: 3908 },
    { name: 'May', users: 1890, shops: 4800 },
    { name: 'Jun', users: 2390, shops: 3800 },
  ];

  const visitorData = [
    { time: '00:00', visitors: 2400 },
    { time: '04:00', visitors: 1398 },
    { time: '08:00', visitors: 9800 },
    { time: '12:00', visitors: 3908 },
    { time: '16:00', visitors: 4800 },
    { time: '20:00', visitors: 3800 },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-2">{stats.totalUsers.toLocaleString()}</p>
          <span className="text-green-500 text-sm font-medium">+12% from last month</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Active Users</h3>
            <span className="p-2 bg-green-50 text-green-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-2">{stats.activeUsers.toLocaleString()}</p>
          <span className="text-green-500 text-sm font-medium">+5% from last month</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Total Shops</h3>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-2">{stats.totalShops.toLocaleString()}</p>
          <span className="text-green-500 text-sm font-medium">+8% from last month</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Active Shops</h3>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-2">{stats.activeShops.toLocaleString()}</p>
          <span className="text-green-500 text-sm font-medium">+15% from last month</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-6">Users & Shops Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#6366f1" name="Users" />
              <Bar dataKey="shops" fill="#8b5cf6" name="Shops" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-6">Daily Visitor Traffic</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={visitorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="visitors" 
                stroke="#6366f1" 
                strokeWidth={2}
                dot={{ fill: '#6366f1' }}
                name="Visitors"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 