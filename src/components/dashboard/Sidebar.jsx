import { Link } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import DescriptionIcon from "@mui/icons-material/Description";
import ReportIcon from "@mui/icons-material/Report";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Analytics", href: "/analytics", icon: BarChartIcon },
  { name: "User", href: "/user", icon: PeopleAltIcon },
  { name: "Content", href: "/content", icon: DescriptionIcon },
  { name: "Reports", href: "/reports", icon: ReportIcon },
  { name: "Account ", href: "/account", icon: AccountBoxIcon },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-white bg-gray-800  md:hidden "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 5.25h16.5m-16.5 6h16.5m-16.5 6h16.5"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition duration-200 ease-in-out flex flex-col`}
      >
        <nav className="flex-grow">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-2 py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
          <Link
            href="/settings"
            className="flex items-center gap-2 py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
          >
            <SettingsIcon className="h-5 w-5" />
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
