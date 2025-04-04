import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import HandshakeIcon from "@mui/icons-material/Handshake";
import LaptopIcon from "@mui/icons-material/Laptop";
import AssessmentIcon from "@mui/icons-material/Assessment";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const SponsorLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const sidebarItems = [
    {
      path: "/sponsor/register",
      icon: <HandshakeIcon />,
      label: "Become a Sponsor",
    },
    {
      path: "/sponsor/laptop-info",
      icon: <LaptopIcon />,
      label: "Register New Laptop",
    },
    {
      path: "/sponsor/laptop-status",
      icon: <AssessmentIcon />,
      label: "Laptop Status",
    },
  ];

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar Toggle Button (Mobile) */}
      <button
        className="lg:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-slate-600 text-white"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-10
        transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        w-64 bg-white shadow-xl
      `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header with Back Button */}
          <div className="flex items-center justify-between h-16 bg-white px-6 shadow-md">
            <button
              onClick={() => navigate("/")}
              className="text-slate-600 hover:text-amber-600 transition-colors duration-200"
            >
              <ArrowBackIcon className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-slate-600">
              Sponsor Dashboard
            </h2>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
            {sidebarItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center px-4 py-3 text-slate-600 rounded-lg
                  transition-colors duration-200
                  ${isActive ? "bg-amber-600 text-white" : "hover:bg-slate-100"}
                `}
              >
                <span className="mr-4 text-xl">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto p-6">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
