import React from 'react';
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

const data = [
  { name: 'Jan', users: 4000, posts: 2400 },
  { name: 'Feb', users: 3000, posts: 1398 },
  { name: 'Mar', users: 2000, posts: 9800 },
  { name: 'Apr', users: 2780, posts: 3908 },
  { name: 'May', users: 1890, posts: 4800 },
  { name: 'Jun', users: 2390, posts: 3800 },
];

const visitorData = [
  { time: '00:00', visitors: 2400 },
  { time: '04:00', visitors: 1398 },
  { time: '08:00', visitors: 9800 },
  { time: '12:00', visitors: 3908 },
  { time: '16:00', visitors: 4800 },
  { time: '20:00', visitors: 3800 },
];

export default function AnalyticPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Users</h3>
          <p className="text-2xl font-bold">15,350</p>
          <span className="text-green-500 text-sm">+12% from last month</span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Active Users</h3>
          <p className="text-2xl font-bold">8,725</p>
          <span className="text-red-500 text-sm">-3% from last month</span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Posts</h3>
          <p className="text-2xl font-bold">25,650</p>
          <span className="text-green-500 text-sm">+8% from last month</span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Engagement Rate</h3>
          <p className="text-2xl font-bold">67%</p>
          <span className="text-green-500 text-sm">+5% from last month</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Users & Posts Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#8884d8" />
              <Bar dataKey="posts" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Daily Visitor Traffic</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={visitorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="visitors" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 