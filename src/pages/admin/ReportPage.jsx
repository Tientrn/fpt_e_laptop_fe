import React, { useState } from 'react';

const dummyReports = [
  {
    id: 1,
    type: "User Report",
    description: "Inappropriate behavior in forum",
    status: "Pending",
    priority: "High",
    reportedBy: "user123",
    date: "2024-03-15"
  },
  {
    id: 2,
    type: "Content Report",
    description: "Spam content detected",
    status: "Resolved",
    priority: "Medium",
    reportedBy: "user456",
    date: "2024-03-14"
  },
  // Add more dummy reports as needed
];

export default function ReportPage() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Reports Management</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Reports</h3>
          <p className="text-2xl font-bold">156</p>
          <span className="text-gray-500 text-sm">Last 30 days</span>
        </div>
        <div className="bg-red-100 p-4 rounded-lg shadow">
          <h3 className="text-red-500 text-sm">Pending</h3>
          <p className="text-2xl font-bold text-red-600">42</p>
          <span className="text-red-500 text-sm">Requires attention</span>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow">
          <h3 className="text-yellow-600 text-sm">In Progress</h3>
          <p className="text-2xl font-bold text-yellow-600">28</p>
          <span className="text-yellow-600 text-sm">Being reviewed</span>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow">
          <h3 className="text-green-600 text-sm">Resolved</h3>
          <p className="text-2xl font-bold text-green-600">86</p>
          <span className="text-green-600 text-sm">Completed</span>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <input
            type="text"
            placeholder="Search reports..."
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <select
            className="w-full px-4 py-2 border rounded-lg"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        <div>
          <select
            className="w-full px-4 py-2 border rounded-lg"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reported By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dummyReports.map((report) => (
              <tr key={report.id}>
                <td className="px-6 py-4 whitespace-nowrap">{report.type}</td>
                <td className="px-6 py-4">{report.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${report.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                    report.status === 'Resolved' ? 'bg-green-100 text-green-800' : 
                    'bg-blue-100 text-blue-800'}`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${report.priority === 'High' ? 'bg-red-100 text-red-800' : 
                    report.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-green-100 text-green-800'}`}>
                    {report.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{report.reportedBy}</td>
                <td className="px-6 py-4 whitespace-nowrap">{report.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                  <button className="text-green-600 hover:text-green-900">Resolve</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-700">
          Showing 1 to 10 of 156 reports
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded">Previous</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
          <button className="px-3 py-1 border rounded">2</button>
          <button className="px-3 py-1 border rounded">3</button>
          <button className="px-3 py-1 border rounded">Next</button>
        </div>
      </div>
    </div>
  );
} 