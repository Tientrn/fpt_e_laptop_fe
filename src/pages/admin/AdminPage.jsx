import React, { useEffect, useState } from "react"
import userApi from "../../api/userApi";
import { TablePagination, TextField } from "@mui/material";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userApi.getAllUsers();
        const studentUsers = response.data.filter(user => user.roleName === 'Student');
        setUsers(studentUsers);
        setFilteredUsers(studentUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const results = users.filter(user =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber.includes(searchTerm)
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
          <div className="overflow-auto shadow-md rounded-lg">
            <table className="min-w-full table-auto bg-white">
              <thead>
                <tr className="bg-gradient-to-r from-gray-500 to-green-500 text-white">
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
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50`}
                  >
                    <td className="px-6 py-4 text-gray-700 font-medium">
                  {page * rowsPerPage + index + 1}
                </td>
                <td className="px-6 py-4 text-gray-700 font-medium">
                  {user.fullName}
                </td>
                <td className="px-6 py-4 text-gray-700 font-medium">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-gray-700 font-medium">
                  {user.phoneNumber}
                </td>
                <td className="px-6 py-4 text-gray-700 font-medium">
                  {user.gender}
                    </td>
                <td className="px-6 py-4 text-gray-700 font-medium">
                  {user.roleName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
}
