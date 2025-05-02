import React, { useState } from 'react';
import { FaExclamationTriangle, FaFilter, FaSearch, FaCheck, FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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
  {
    id: 3,
    type: "Technical Issue",
    description: "Unable to access course materials",
    status: "In Progress",
    priority: "High",
    reportedBy: "student789",
    date: "2024-03-13"
  },
  {
    id: 4,
    type: "Payment Issue",
    description: "Double charged for course",
    status: "Resolved",
    priority: "High",
    reportedBy: "customer222",
    date: "2024-03-12"
  },
  {
    id: 5,
    type: "User Report",
    description: "Harassment in comments section",
    status: "Pending",
    priority: "Medium",
    reportedBy: "forum_mod",
    date: "2024-03-11"
  }
];

export default function ReportPage() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredReports = dummyReports.filter(report => {
    const matchesStatus = selectedStatus === 'all' || report.status.toLowerCase() === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || report.priority.toLowerCase() === selectedPriority;
    const matchesSearch = searchTerm === '' || 
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesSearch;
  });

  return (
    <div className="p-6 bg-[#f8f5f2] min-h-screen text-[#232323]">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#3d5a80] rounded-lg">
            <FaExclamationTriangle className="text-white text-xl" />
          </div>
          <h1 className="text-3xl font-bold text-[#3d5a80]">Reports Management</h1>
        </div>
        <p className="text-[#293241]/70 ml-11">Track and resolve user reported issues</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
          <h3 className="text-[#293241] text-sm font-medium">Total Reports</h3>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-[#3d5a80]">156</p>
            <div className="text-xs bg-[#e0fbfc] text-[#3d5a80] px-2 py-1 rounded">Last 30 days</div>
          </div>
        </div>
        <div className="bg-[#ee6c4d]/5 p-4 rounded-xl shadow-sm border border-[#ee6c4d]/10 transition-all duration-300 hover:shadow-md">
          <h3 className="text-[#ee6c4d] text-sm font-medium">Pending</h3>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-[#ee6c4d]">42</p>
            <div className="text-xs bg-[#ee6c4d]/10 text-[#ee6c4d] px-2 py-1 rounded">Requires attention</div>
          </div>
        </div>
        <div className="bg-[#e0fbfc] p-4 rounded-xl shadow-sm border border-[#98c1d9]/20 transition-all duration-300 hover:shadow-md">
          <h3 className="text-[#3d5a80] text-sm font-medium">In Progress</h3>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-[#3d5a80]">28</p>
            <div className="text-xs bg-white text-[#3d5a80] px-2 py-1 rounded">Being reviewed</div>
          </div>
        </div>
        <div className="bg-[#98c1d9]/20 p-4 rounded-xl shadow-sm border border-[#98c1d9]/30 transition-all duration-300 hover:shadow-md">
          <h3 className="text-[#3d5a80] text-sm font-medium">Resolved</h3>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-[#3d5a80]">86</p>
            <div className="text-xs bg-white text-[#3d5a80] px-2 py-1 rounded">Completed</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3d5a80]/60" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-[#3d5a80] focus:ring-[#3d5a80] outline-none"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-[#e0fbfc] transition-colors sm:w-auto w-full justify-center"
          >
            <FaFilter className="text-[#3d5a80]" />
            <span className="text-[#3d5a80]">Filters</span>
          </button>
        </div>
        
        {showFilters && (
          <div className="bg-white mt-4 p-4 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#293241] mb-1">Status</label>
              <select
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#3d5a80] focus:ring-[#3d5a80] outline-none"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#293241] mb-1">Priority</label>
              <select
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#3d5a80] focus:ring-[#3d5a80] outline-none"
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
        )}
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-[#3d5a80] to-[#98c1d9]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Reported By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-[#e0fbfc] transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-[#293241]">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#e0fbfc] text-[#3d5a80]">
                        {report.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#293241]">{report.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex items-center text-xs font-semibold rounded-full 
                        ${report.status === 'Pending' ? 'bg-[#ee6c4d]/10 text-[#ee6c4d]' : 
                        report.status === 'Resolved' ? 'bg-[#98c1d9]/30 text-[#3d5a80]' : 
                        'bg-[#e0fbfc] text-[#3d5a80]'}`}>
                        {report.status === 'Resolved' && <FaCheck className="mr-1 h-3 w-3" />}
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex items-center text-xs font-semibold rounded-full 
                        ${report.priority === 'High' ? 'bg-[#ee6c4d]/10 text-[#ee6c4d]' : 
                        report.priority === 'Medium' ? 'bg-[#e0fbfc] text-[#3d5a80]' : 
                        'bg-[#98c1d9]/30 text-[#3d5a80]'}`}>
                        {report.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-7 w-7 rounded-full bg-[#98c1d9]/30 flex items-center justify-center text-[#3d5a80] text-xs font-semibold mr-2">
                          {report.reportedBy.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[#293241]">{report.reportedBy}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[#293241]">{report.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="p-1.5 bg-[#3d5a80]/10 text-[#3d5a80] rounded hover:bg-[#3d5a80]/20 transition-colors">
                          <FaEye className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 bg-[#ee6c4d]/10 text-[#ee6c4d] rounded hover:bg-[#ee6c4d]/20 transition-colors">
                          <FaCheck className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-[#293241]/70">
                    No reports match your current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-[#293241]">
          Showing {filteredReports.length} of {dummyReports.length} reports
        </div>
        <div className="flex space-x-2">
          <button className="p-2 border border-gray-200 rounded hover:bg-[#e0fbfc] text-[#3d5a80] transition-colors">
            <FaChevronLeft className="h-4 w-4" />
          </button>
          <button className="px-3 py-1 bg-[#3d5a80] text-white rounded">1</button>
          <button className="px-3 py-1 border border-gray-200 rounded hover:bg-[#e0fbfc] text-[#3d5a80] transition-colors">2</button>
          <button className="px-3 py-1 border border-gray-200 rounded hover:bg-[#e0fbfc] text-[#3d5a80] transition-colors">3</button>
          <button className="p-2 border border-gray-200 rounded hover:bg-[#e0fbfc] text-[#3d5a80] transition-colors">
            <FaChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
} 