import Button from "@mui/material/Button";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

export default function Header() {
  return (
    <header className="bg-white shadow-sm z-30 relative">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 ">Dashboard</h1>
          <div className="flex items-center">
            <Button variant="ghost" size="icon">
              <NotificationsNoneIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <PersonOutlineIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
