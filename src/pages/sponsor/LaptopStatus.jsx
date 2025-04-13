import { useState, useEffect } from "react";
import donateitemsApi from "../../api/donateitemsApi";
import { jwtDecode } from "jwt-decode";

const LaptopStatus = () => {
  const [laptops, setLaptops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const id = Number(decoded.userId);
        setUserId(id);
      } catch {
        // Token decode failed
      }
    }
  }, []);

  useEffect(() => {
    const fetchLaptops = async () => {
      try {
        setIsLoading(true);
        const response = await donateitemsApi.getAllDonateItems();
        const data = response.data || [];
        
        // Filter laptops by user ID
        const filteredLaptops = data
          .filter((item) => Number(item.userId) === Number(userId))
          .sort((a, b) => b.itemId - a.itemId); 
        
        setLaptops(filteredLaptops);
      } catch {
        // Error handling
      } finally {
        setIsLoading(false);
      }
    };

    if (userId !== null) {
      fetchLaptops();
    }
  }, [userId]);
  
  const getConditionBadge = (condition) => {
    const conditionMap = {
      "Like New": { class: "bg-green-100 text-green-700 border border-green-200", icon: "✓" },
      "Good": { class: "bg-blue-100 text-blue-700 border border-blue-200", icon: "☑" },
      "Fair": { class: "bg-amber-100 text-amber-700 border border-amber-200", icon: "⚠" },
      "Poor": { class: "bg-red-100 text-red-600 border border-red-200", icon: "⚠" }
    };
    
    const defaultClass = "bg-gray-100 text-gray-700 border border-gray-200";
    return conditionMap[condition] || { class: defaultClass, icon: "•" };
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-0.5">
            Laptops Donation Status
          </h1>
          <p className="text-sm text-gray-500">Track the status of your donated laptops</p>
        </div>
        
        <span className="bg-amber-100 text-amber-700 text-xs px-3 py-1 rounded-full font-medium border border-amber-200">
          {laptops.length} Laptop{laptops.length !== 1 ? 's' : ''}
        </span>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-600"></div>
            <p className="mt-3 text-sm text-gray-500">Loading donated laptops...</p>
          </div>
        </div>
      ) : laptops.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-3">
            <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No laptops found</h3>
          <p className="text-sm text-gray-500">You haven&apos;t donated any laptops yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {laptops.map((laptop) => {
            const conditionBadge = getConditionBadge(laptop.conditionItem);
            
            return (
              <div
                key={laptop.itemId}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-4">
                  {/* Image Column */}
                  <div className="relative h-40 md:h-auto md:max-h-44 overflow-hidden">
                    <img
                      src={laptop.itemImage || 'https://via.placeholder.com/400x300?text=No+Image'}
                      alt={laptop.itemName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-0 right-0 m-2">
                      <span className={`${
                        laptop.status === "Available" 
                          ? "bg-green-100 text-green-700 border border-green-200" 
                          : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                        } px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center`}>
                        {laptop.status === "Available" ? (
                          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        {laptop.status}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content Column */}
                  <div className="p-4 md:col-span-3">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                      <div>
                        <h2 className="text-base font-bold text-gray-800 mb-1 line-clamp-1">
                          {laptop.itemName}
                        </h2>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${conditionBadge.class} inline-flex items-center`}>
                            <span className="mr-1">{conditionBadge.icon}</span> {laptop.conditionItem}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            ID: {laptop.itemId}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-1 sm:mt-0">
                        <div className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-md">
                          <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-xs font-medium text-gray-700">
                            Borrowed: {laptop.totalBorrowedCount}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-gray-50 rounded-md mb-3">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 mb-0.5">CPU</span>
                        <span className="text-xs font-medium text-gray-800">{laptop.cpu || 'N/A'}</span>
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 mb-0.5">RAM</span>
                        <span className="text-xs font-medium text-gray-800">{laptop.ram || 'N/A'}</span>
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 mb-0.5">Storage</span>
                        <span className="text-xs font-medium text-gray-800">{laptop.storage || 'N/A'}</span>
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 mb-0.5">Screen</span>
                        <span className="text-xs font-medium text-gray-800">{laptop.screenSize ? `${laptop.screenSize}"` : 'N/A'}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button className="inline-flex items-center px-3 py-1.5 bg-amber-600 text-white rounded-md text-xs font-medium hover:bg-amber-700 transition-colors duration-200">
                        View Details
                        <svg className="w-3.5 h-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LaptopStatus;
