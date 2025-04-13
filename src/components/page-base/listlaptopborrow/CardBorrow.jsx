import { useNavigate } from "react-router-dom";
import LaptopIcon from "@mui/icons-material/Laptop";
import MemoryIcon from "@mui/icons-material/Memory";
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard";
import StorageIcon from "@mui/icons-material/Storage";
import MonitorIcon from "@mui/icons-material/Monitor";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PropTypes from "prop-types";

const CardBorrow = ({ laptop }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/borrow/${laptop.itemId}`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 h-full flex flex-col cursor-pointer transform hover:scale-102 hover:translate-y-[-3px] border border-indigo-50"
      onClick={handleCardClick}
    >
      <div className="relative h-40">
        <img
          src={laptop.itemImage}
          alt={laptop.itemName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 to-transparent"></div>
        <div
          className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-medium text-white
            ${laptop.status === "Available" 
              ? "bg-gradient-to-r from-green-500 to-emerald-600" 
              : "bg-gradient-to-r from-red-500 to-pink-600"}`}
        >
          {laptop.status}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-base mb-2 text-indigo-900 line-clamp-2 min-h-[2.5rem]">
          {laptop.itemName}
        </h3>

        <div className="space-y-2 flex-grow text-sm">
          <div className="flex items-center text-indigo-700">
            <MemoryIcon fontSize="small" className="mr-2 flex-shrink-0" />
            <span className="truncate">CPU: {laptop.cpu}</span>
          </div>
          <div className="flex items-center text-indigo-700">
            <DeveloperBoardIcon fontSize="small" className="mr-2 flex-shrink-0" />
            <span className="truncate">RAM: {laptop.ram}</span>
          </div>
          <div className="flex items-center text-indigo-700">
            <StorageIcon fontSize="small" className="mr-2 flex-shrink-0" />
            <span className="truncate">Storage: {laptop.storage}</span>
          </div>
          <div className="flex items-center text-indigo-700">
            <MonitorIcon fontSize="small" className="mr-2 flex-shrink-0" />
            <span className="truncate">Screen: {laptop.screenSize}</span>
          </div>
          <div className="flex items-center text-indigo-700">
            <CheckCircleOutlineIcon fontSize="small" className="mr-2 flex-shrink-0" />
            <span className="truncate">
              Condition: {laptop.conditionItem || "N/A"}
            </span>
          </div>
        </div>

        <div className="mt-3 flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/borrow/${laptop.itemId}`);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900 text-white rounded-lg transition-colors shadow-sm"
          >
            <LaptopIcon fontSize="small" />
            <span>View Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};

CardBorrow.propTypes = {
  laptop: PropTypes.shape({
    itemId: PropTypes.string.isRequired,
    itemName: PropTypes.string.isRequired,
    itemImage: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    cpu: PropTypes.string,
    ram: PropTypes.string,
    storage: PropTypes.string,
    screenSize: PropTypes.string,
    conditionItem: PropTypes.string
  }).isRequired
};

export default CardBorrow;
