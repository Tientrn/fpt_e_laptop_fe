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
      className="relative bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300 h-full flex flex-col cursor-pointer transform hover:-translate-y-1 border border-[#e0fbfc]/50"
      onClick={handleCardClick}
    >
      {/* Image container with gradient overlay */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={laptop.itemImage}
          alt={laptop.itemName}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#293241]/80 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>
        
        {/* Status badge */}
        <div
          className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-xs font-medium text-white backdrop-blur-sm shadow-sm
            ${laptop.status === "Available" 
              ? "bg-[#3d5a80]/90" 
              : "bg-[#ee6c4d]/90"}`}
        >
          {laptop.status}
        </div>
        
        {/* Laptop name overlay on image */}
        <h3 className="absolute bottom-2.5 left-2.5 right-2.5 font-medium text-sm text-white line-clamp-1 drop-shadow-md">
          {laptop.itemName}
        </h3>
      </div>

      {/* Card body with specs */}
      <div className="p-3 flex flex-col flex-grow bg-gradient-to-b from-white to-[#f8f5f2]/50">
        <div className="space-y-2 flex-grow">
          <div className="grid grid-cols-2 gap-1.5">
            <div className="flex items-center text-[#293241] bg-[#e0fbfc]/30 p-1.5 rounded-lg">
              <MemoryIcon fontSize="small" className="mr-1 text-[#3d5a80] flex-shrink-0" style={{ fontSize: "16px" }} />
              <span className="truncate text-xs">{laptop.cpu || "N/A"}</span>
            </div>
            <div className="flex items-center text-[#293241] bg-[#e0fbfc]/30 p-1.5 rounded-lg">
              <DeveloperBoardIcon fontSize="small" className="mr-1 text-[#3d5a80] flex-shrink-0" style={{ fontSize: "16px" }} />
              <span className="truncate text-xs">{laptop.ram || "N/A"} GB</span>
            </div>
            <div className="flex items-center text-[#293241] bg-[#e0fbfc]/30 p-1.5 rounded-lg">
              <StorageIcon fontSize="small" className="mr-1 text-[#3d5a80] flex-shrink-0" style={{ fontSize: "16px" }} />
              <span className="truncate text-xs">{laptop.storage || "N/A"} GB</span>
            </div>
            <div className="flex items-center text-[#293241] bg-[#e0fbfc]/30 p-1.5 rounded-lg">
              <MonitorIcon fontSize="small" className="mr-1 text-[#3d5a80] flex-shrink-0" style={{ fontSize: "16px" }} />
              <span className="truncate text-xs">{laptop.screenSize || "N/A"}</span>
            </div>
          </div>
          
          <div className="flex items-center text-[#293241] bg-[#e0fbfc]/30 p-1.5 rounded-lg">
            <CheckCircleOutlineIcon fontSize="small" className="mr-1 text-[#3d5a80] flex-shrink-0" style={{ fontSize: "16px" }} />
            <span className="truncate text-xs">
              Condition: {laptop.conditionItem || "N/A"}
            </span>
          </div>
        </div>

        <div className="mt-2.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/borrow/${laptop.itemId}`);
            }}
            className="w-full py-1.5 text-xs bg-[#3d5a80] hover:bg-[#293241] text-white rounded-lg transition-all duration-300 shadow-sm flex items-center justify-center gap-1.5 font-medium"
          >
            <LaptopIcon fontSize="small" style={{ fontSize: "16px" }} />
            <span>View Details</span>
          </button>
        </div>
      </div>
      
      {/* Decorative element */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3d5a80] via-[#98c1d9] to-[#ee6c4d]"></div>
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
