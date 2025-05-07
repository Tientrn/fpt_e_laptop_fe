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
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import userApi from '../../api/userApi';
import shopApi from '../../api/shopApi';
import { toast } from 'react-toastify';
import { FaChartBar, FaChartLine, FaUserAlt, FaStore, FaArrowUp } from 'react-icons/fa';

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

  const salesData = [
    { month: 'Jan', sales: 12500 },
    { month: 'Feb', sales: 18200 },
    { month: 'Mar', sales: 15800 },
    { month: 'Apr', sales: 21500 },
    { month: 'May', sales: 25800 },
    { month: 'Jun', sales: 32000 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <p className="text-[#3d5a80] font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f8f5f2]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3d5a80]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#f8f5f2] min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#3d5a80] rounded-lg">
            <FaChartBar className="text-white text-xl" />
          </div>
          <h1 className="text-3xl font-bold text-[#3d5a80]">Analytics Dashboard</h1>
        </div>
        <p className="text-[#293241]/70 ml-11">Monitor performance metrics and trends</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#293241] text-sm font-medium">Total Users</h3>
            <div className="p-2 bg-[#e0fbfc] text-[#3d5a80] rounded-lg">
              <FaUserAlt className="h-5 w-5" />
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-3xl font-bold text-[#293241] mb-1">{stats.totalUsers.toLocaleString()}</p>
              <div className="flex items-center text-[#ee6c4d] text-sm font-medium">
                <FaArrowUp className="mr-1 h-3 w-3" />
                <span>+12% from last month</span>
              </div>
            </div>
            <div className="h-16 w-24">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.slice(0, 6)} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3d5a80" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3d5a80" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="users" stroke="#3d5a80" fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#293241] text-sm font-medium">Active Users</h3>
            <div className="p-2 bg-[#98c1d9] text-[#3d5a80] rounded-lg">
              <FaUserAlt className="h-5 w-5" />
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-3xl font-bold text-[#293241] mb-1">{stats.activeUsers.toLocaleString()}</p>
              <div className="flex items-center text-[#ee6c4d] text-sm font-medium">
                <FaArrowUp className="mr-1 h-3 w-3" />
                <span>+5% from last month</span>
              </div>
            </div>
            <div className="h-16 w-24">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.slice(0, 6)} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActiveUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#98c1d9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#98c1d9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="users" stroke="#98c1d9" fillOpacity={1} fill="url(#colorActiveUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#293241] text-sm font-medium">Total Shops</h3>
            <div className="p-2 bg-[#e0fbfc] text-[#3d5a80] rounded-lg">
              <FaStore className="h-5 w-5" />
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-3xl font-bold text-[#293241] mb-1">{stats.totalShops.toLocaleString()}</p>
              <div className="flex items-center text-[#ee6c4d] text-sm font-medium">
                <FaArrowUp className="mr-1 h-3 w-3" />
                <span>+8% from last month</span>
              </div>
            </div>
            <div className="h-16 w-24">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.slice(0, 6)} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorShops" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3d5a80" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3d5a80" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="shops" stroke="#3d5a80" fillOpacity={1} fill="url(#colorShops)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#293241] text-sm font-medium">Active Shops</h3>
            <div className="p-2 bg-[#98c1d9] text-[#3d5a80] rounded-lg">
              <FaStore className="h-5 w-5" />
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-3xl font-bold text-[#293241] mb-1">{stats.activeShops.toLocaleString()}</p>
              <div className="flex items-center text-[#ee6c4d] text-sm font-medium">
                <FaArrowUp className="mr-1 h-3 w-3" />
                <span>+15% from last month</span>
              </div>
            </div>
            <div className="h-16 w-24">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.slice(0, 6)} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActiveShops" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#98c1d9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#98c1d9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="shops" stroke="#98c1d9" fillOpacity={1} fill="url(#colorActiveShops)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#3d5a80] flex items-center gap-2">
              <FaChartBar className="text-[#3d5a80]" />
              Users & Shops Overview
            </h2>
            <select className="p-1.5 text-sm border border-gray-200 rounded-lg focus:border-[#3d5a80] focus:ring-[#3d5a80]">
              <option>This Year</option>
              <option>Last Year</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid vertical={false} stroke="#f5f5f5" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 15 }} />
              <Bar 
                dataKey="users" 
                name="Users" 
                fill="#3d5a80" 
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
              <Bar 
                dataKey="shops" 
                name="Shops" 
                fill="#98c1d9" 
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#3d5a80] flex items-center gap-2">
              <FaChartLine className="text-[#ee6c4d]" />
              Daily Visitor Traffic
            </h2>
            <select className="p-1.5 text-sm border border-gray-200 rounded-lg focus:border-[#3d5a80] focus:ring-[#3d5a80]">
              <option>Today</option>
              <option>Yesterday</option>
              <option>Last Week</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={visitorData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ee6c4d" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ee6c4d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#f5f5f5" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="visitors" 
                stroke="#ee6c4d" 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorVisitors)"
                name="Visitors"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Extra Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[#3d5a80] flex items-center gap-2">
            <FaChartLine className="text-[#3d5a80]" />
            Sales Performance
          </h2>
          <select className="p-1.5 text-sm border border-gray-200 rounded-lg focus:border-[#3d5a80] focus:ring-[#3d5a80]">
            <option>This Year</option>
            <option>Last Year</option>
            <option>Last 6 Months</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid vertical={false} stroke="#f5f5f5" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip 
              formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']}
              content={<CustomTooltip />}
            />
            <Line 
              type="monotone" 
              dataKey="sales" 
              stroke="#3d5a80" 
              strokeWidth={3}
              dot={{ stroke: '#3d5a80', strokeWidth: 2, r: 4, fill: 'white' }}
              activeDot={{ stroke: '#3d5a80', strokeWidth: 2, r: 6, fill: '#3d5a80' }}
              name="Sales"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 