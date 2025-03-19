import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

// Dữ liệu mẫu
const transactions = [
  {
    id: 1,
    username: "John Doe",
    email: "john@example.com",
    role: "Customer",
    action: "purchased",
    date: "2025-01-10 14:32:00",
    status: "Completed",
  },
  {
    id: 2,
    username: "Jane Smith",
    email: "jane@example.com",
    role: "Customer",
    action: "borrow",
    date: "2025-01-12 09:45:00",
    status: "Pending",
  },
  {
    id: 3,
    username: "Alice Brown",
    email: "alice@example.com",
    role: "Customer",
    action: "purchased",
    date: "2025-01-14 17:20:00",
    status: "Completed",
  },
];

export default function HistoryPaymentPage() {
  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold">Transaction History</h1>
      </div>

      <div className="overflow-auto shadow-md rounded-lg">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow className="bg-gradient-to-r from-gray-500 to-teal-500 text-white">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Typography className="font-semibold">Username</Typography>
                  </div>
                </TableCell>
                <TableCell>
                  <Typography className="font-semibold">Email</Typography>
                </TableCell>
                <TableCell>
                  <Typography className="font-semibold">Role</Typography>
                </TableCell>
                <TableCell>
                  <Typography className="font-semibold">Action</Typography>
                </TableCell>
                <TableCell>
                  <Typography className="font-semibold">Date</Typography>
                </TableCell>
                <TableCell>
                  <Typography className="font-semibold">Status</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  className="hover:bg-gray-50"
                >
                  <TableCell>{transaction.username}</TableCell>
                  <TableCell>{transaction.email}</TableCell>
                  <TableCell>{transaction.role}</TableCell>
                  <TableCell className="capitalize">{transaction.action}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-md ${
                        transaction.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
