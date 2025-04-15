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
      className="relative bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300 h-full flex flex-col cursor-pointer transform hover:-translate-y-1 border border-indigo-50"
      onClick={handleCardClick}
    >
      {/* Image container with gradient overlay */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={laptop.itemImage}
          alt={laptop.itemName}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
        
        {/* Status badge */}
        <div
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm shadow-sm
            ${laptop.status === "Available" 
              ? "bg-emerald-500/90" 
              : "bg-rose-500/90"}`}
        >
          {laptop.status}
        </div>
        
        {/* Laptop name overlay on image */}
        <h3 className="absolute bottom-3 left-3 right-3 font-semibold text-sm text-white line-clamp-1 drop-shadow-md">
          {laptop.itemName}
        </h3>
      </div>

      {/* Card body with specs */}
      <div className="p-4 flex flex-col flex-grow bg-gradient-to-b from-white to-indigo-50/30">
        <div className="space-y-2.5 flex-grow">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center text-indigo-800 bg-indigo-50/80 p-1.5 rounded-lg">
              <MemoryIcon fontSize="small" className="mr-1.5 text-indigo-600 flex-shrink-0" />
              <span className="truncate text-xs font-medium">{laptop.cpu || "N/A"}</span>
            </div>
            <div className="flex items-center text-indigo-800 bg-indigo-50/80 p-1.5 rounded-lg">
              <DeveloperBoardIcon fontSize="small" className="mr-1.5 text-indigo-600 flex-shrink-0" />
              <span className="truncate text-xs font-medium">{laptop.ram || "N/A"} GB</span>
            </div>
            <div className="flex items-center text-indigo-800 bg-indigo-50/80 p-1.5 rounded-lg">
              <StorageIcon fontSize="small" className="mr-1.5 text-indigo-600 flex-shrink-0" />
              <span className="truncate text-xs font-medium">{laptop.storage || "N/A"} GB</span>
            </div>
            <div className="flex items-center text-indigo-800 bg-indigo-50/80 p-1.5 rounded-lg">
              <MonitorIcon fontSize="small" className="mr-1.5 text-indigo-600 flex-shrink-0" />
              <span className="truncate text-xs font-medium">{laptop.screenSize || "N/A"}</span>
            </div>
          </div>
          
          <div className="flex items-center text-indigo-800 bg-indigo-50/80 p-1.5 rounded-lg mt-1">
            <CheckCircleOutlineIcon fontSize="small" className="mr-1.5 text-indigo-600 flex-shrink-0" />
            <span className="truncate text-xs font-medium">
              Condition: {laptop.conditionItem || "N/A"}
            </span>
          </div>
        </div>

        <div className="mt-3 flex justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/borrow/${laptop.itemId}`);
            }}
            className="w-full py-2 text-xs bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white rounded-lg transition-all duration-300 shadow-sm flex items-center justify-center gap-1.5 font-medium"
          >
            <LaptopIcon fontSize="small" />
            <span>View Details</span>
          </button>
        </div>
      </div>
      
      {/* Decorative element */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
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
