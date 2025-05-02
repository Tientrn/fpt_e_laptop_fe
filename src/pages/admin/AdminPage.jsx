import React, { useEffect, useState } from "react"
import userApi from "../../api/userApi";
import { TablePagination, TextField, InputAdornment, FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import { FaSearch, FaUserAlt, FaFilter } from "react-icons/fa";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userApi.getAllUsers();
        setUsers(response.data);
        setFilteredUsers(response.data);
        
        // Extract unique roles
        const uniqueRoles = [...new Set(response.data.map(user => user.roleName))];
        setRoles(uniqueRoles);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const results = users.filter(user => {
      const matchesSearch = 
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phoneNumber?.includes(searchTerm);
      
      const matchesRole = roleFilter === "All" || user.roleName === roleFilter;
      
      return matchesSearch && matchesRole;
    });
    
    setFilteredUsers(results);
    setPage(0); // Reset to first page when filter changes
  }, [searchTerm, roleFilter, users]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRoleFilterChange = (event) => {
    setRoleFilter(event.target.value);
  };

  // Define role colors for badges
  const getRoleColor = (role) => {
    switch(role) {
      case 'Student':
        return 'bg-[#98c1d9]/40 text-[#3d5a80]';
      case 'Staff':
        return 'bg-green-100 text-green-800';
      case 'Manager':
        return 'bg-purple-100 text-purple-800';
      case 'Sponsor':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-[#f8f5f2] text-[#232323] min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#3d5a80] rounded-lg">
            <FaUserAlt className="text-white text-xl" />
          </div>
          <h1 className="text-3xl font-bold text-[#3d5a80]">User Management</h1>
        </div>
        <p className="text-[#293241]/70 ml-11">Manage and monitor all user accounts</p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <TextField
              fullWidth
              label="Search Users"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaSearch className="text-[#3d5a80]/60" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#3d5a80',
                  },
                  borderRadius: '8px',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#3d5a80',
                },
              }}
            />
          </div>
          <div className="md:w-64">
            <FormControl fullWidth size="small">
              <InputLabel id="role-filter-label">Role Filter</InputLabel>
              <Select
                labelId="role-filter-label"
                id="role-filter"
                value={roleFilter}
                label="Role Filter"
                onChange={handleRoleFilterChange}
                startAdornment={
                  <InputAdornment position="start">
                    <FaFilter className="text-[#3d5a80]/60 mr-2" />
                  </InputAdornment>
                }
                sx={{
                  borderRadius: '8px',
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#3d5a80',
                  },
                }}
              >
                <MenuItem value="All">All Roles</MenuItem>
                {roles.map(role => (
                  <MenuItem key={role} value={role}>{role}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gradient-to-r from-[#3d5a80] to-[#98c1d9] text-white">
                <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">#</th>
                <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">Full Name</th>
                <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">Email</th>
                <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">Phone Number</th>
                <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">Gender</th>
                <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
                <tr
                  key={user.id}
                  className={`${
                    index % 2 === 0 ? "bg-[#f8f5f2]" : "bg-white"
                  } hover:bg-[#e0fbfc] transition-colors duration-150`}
                >
                  <td className="px-6 py-4 text-[#293241] font-medium">
                    {page * rowsPerPage + index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#98c1d9] flex items-center justify-center text-[#3d5a80] font-medium">
                        {user.fullName?.charAt(0) || 'U'}
                      </div>
                      <span className="text-[#293241] font-medium">{user.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#293241]">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-[#293241]">
                    {user.phoneNumber}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      user.gender === "Male" 
                        ? "bg-[#e0fbfc] text-[#3d5a80]" 
                        : "bg-[#ee6c4d]/10 text-[#ee6c4d]"
                    }`}>
                      {user.gender}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getRoleColor(user.roleName)}`}>
                      {user.roleName}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-200">
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              backgroundColor: 'white',
              '& .MuiTablePagination-selectIcon': {
                color: '#3d5a80',
              },
              '& .MuiTablePagination-select': {
                color: '#3d5a80',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
