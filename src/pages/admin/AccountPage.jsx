import {
  Card,
  CardContent,
  Typography,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import { useState } from "react";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

// Dữ liệu mẫu về tài khoản người dùng
const accounts = [
  { id: 1, username: "John Doe", email: "john@example.com", role: "Admin" },
  { id: 2, username: "Jane Smith", email: "jane@example.com", role: "User" },
  {
    id: 3,
    username: "Alice Brown",
    email: "alice@example.com",
    role: "Manager",
  },
];

export default function AccountManagementPage() {
  const [accountList, setAccountList] = useState(accounts);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);

  const handleOpenModal = (isEdit = false, account = null) => {
    setIsEditMode(isEdit);
    setCurrentAccount(account);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setCurrentAccount(null);
  };

  const handleSave = () => {
    if (isEditMode) {
      // Sửa tài khoản
      setAccountList((prevList) =>
        prevList.map((account) =>
          account.id === currentAccount.id ? currentAccount : account
        )
      );
    } else {
      // Thêm tài khoản mới
      const newAccount = {
        ...currentAccount,
        id: accountList.length + 1, // Giả sử tự động tăng id
      };
      setAccountList([...accountList, newAccount]);
    }
    handleCloseModal();
  };

  const handleDelete = (accountId) => {
    setAccountList(accountList.filter((account) => account.id !== accountId));
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold">Account Management</h1>
        <Button
          variant="ghost"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal(false)}
        >
          Add Account
        </Button>
      </div>

      <div className="overflow-auto shadow-md rounded-lg">
        <table className="min-w-full table-auto bg-white">
          <thead>
            <tr className="bg-gradient-to-r from-gray-500 to-teal-500 text-white">
              <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">
                <div className="flex items-center gap-2">
                  <PeopleAltIcon />
                  <span>Username</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">
                Email
              </th>
              <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">
                Role
              </th>
              <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {accountList.map((account) => (
              <tr key={account.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-700">{account.username}</td>
                <td className="px-6 py-4 text-gray-700">{account.email}</td>
                <td className="px-6 py-4 text-gray-700">{account.role}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenModal(true, account)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(account.id)}
                      className="ml-2"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Account */}
      <Modal open={open} onClose={handleCloseModal}>
        <div className="flex justify-center items-center h-full">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <Typography variant="h6" className="mb-4">
              {isEditMode ? "Edit Account" : "Add Account"}
            </Typography>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              className="mb-4"
              value={currentAccount?.username || ""}
              onChange={(e) =>
                setCurrentAccount({
                  ...currentAccount,
                  username: e.target.value,
                })
              }
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              className="mb-4"
              value={currentAccount?.email || ""}
              onChange={(e) =>
                setCurrentAccount({ ...currentAccount, email: e.target.value })
              }
            />
            <TextField
              label="Role"
              variant="outlined"
              fullWidth
              className="mb-4"
              value={currentAccount?.role || ""}
              onChange={(e) =>
                setCurrentAccount({ ...currentAccount, role: e.target.value })
              }
            />
            <div className="flex justify-between">
              <Button onClick={handleCloseModal} variant="ghost">
                Cancel
              </Button>
              <Button onClick={handleSave} variant="ghost">
                {isEditMode ? "Save Changes" : "Add Account"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
