import Button from "@mui/material/Button";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setDropdownOpen(false);
  };

  return (
    <header className="bg-white shadow-sm z-30 relative">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <div className="flex items-center relative">
            {/* Notifications Icon */}
            <Button variant="ghost" size="icon">
              <NotificationsNoneIcon className="h-5 w-5" />
            </Button>

            {/* Person Icon with Dropdown */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDropdown}
              className="relative"
            >
              <PersonOutlineIcon className="h-5 w-5" />
            </Button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                <ul className="py-1 text-sm text-gray-700">
                  <li>
                    <Button
                      onClick={() => handleNavigation("/dashboard")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Dashboard
                    </Button>
                  </li>
                  <li>
                    <Button
                      onClick={() => handleNavigation("/profile")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Hồ sơ
                    </Button>
                  </li>
                  <li>
                    <Button
                      onClick={() => handleNavigation("/login")}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                    >
                      Log Out
                    </Button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
