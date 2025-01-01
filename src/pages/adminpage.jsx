import { Card, CardContent, Typography } from "@mui/material";
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
} from "recharts";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import StoreIcon from "@mui/icons-material/Store";
import HandshakeIcon from "@mui/icons-material/Handshake";

const data = [
  { name: "Jan", revenue: 4000, customers: 2400, orders: 2400 },
  { name: "Feb", revenue: 3000, customers: 1398, orders: 2210 },
  { name: "Mar", revenue: 2000, customers: 9800, orders: 2290 },
  // thêm dữ liệu khác nếu cần
];
const databarchart = [
  { name: "Jan", revenue: 4000, customers: 2400, orders: 2400 },
  { name: "Feb", revenue: 3000, customers: 1398, orders: 2210 },
  { name: "Mar", revenue: 2000, customers: 9800, orders: 2290 },
  // thêm dữ liệu khác nếu cần
];

export default function DashboardPage() {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h1 className="text-sm font-medium">Accounts registed</h1>
              <PeopleAltIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h1 className="text-sm font-medium">No of Sponsor</h1>
              <HandshakeIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h1 className="text-sm font-medium">No of Shop</h1>
              <StoreIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +201 since last hour
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Typography className="text-sm font-medium">
                Total Revenue
              </Typography>
              <AttachMoneyIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
        <div className="md:col-span-2 lg:col-span-2">
          <h1 className="text-lg font-semibold mb-4">accounts chart</h1>
          <ResponsiveContainer width="100%" height={480}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
              <Line type="monotone" dataKey="customers" stroke="#82ca9d" />
              <Line type="monotone" dataKey="orders" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="md:col-span-1 lg:col-span-1 ">
          <h1 className="text-lg font-semibold mb-4">revenue chart</h1>
          <ResponsiveContainer width="100%" height={480}>
            <BarChart data={databarchart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" />
              <Bar dataKey="customers" fill="#82ca9d" />
              <Bar dataKey="orders" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
