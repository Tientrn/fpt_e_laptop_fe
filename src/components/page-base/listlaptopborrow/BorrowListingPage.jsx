import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import FiltersSidebar from "./FiltersSidebar";
import SortOptions from "./SortOptions";
import donateitemsApi from "../../../api/donateitemsApi";
import CardBorrow from "./CardBorrow";

const BorrowListingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [laptops, setLaptops] = useState([]);
  const [allLaptops, setAllLaptops] = useState([]); // Store all laptops
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    screenSize: "",
    status: "",
    cpu: "",
    ram: "",
    storage: "",
  });

  // Fetch all laptops only once when component mounts
  useEffect(() => {
    const fetchLaptops = async () => {
      try {
        setLoading(true);
        const response = await donateitemsApi.getAllDonateItems();
        console.log("API Response:", response);

        if (response.isSuccess) {
          setAllLaptops(response.data || []);
          setLaptops(response.data || []);
        } else {
          setError("Failed to fetch laptops");
        }
      } catch (error) {
        setError(error.message);
        console.error("Error fetching laptops:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaptops();
  }, []);

  // Apply filters whenever filters change
  useEffect(() => {
    let filteredLaptops = [...allLaptops];

    console.log("Current filters:", filters);
    console.log("All laptops before filtering:", filteredLaptops);

    // Apply filters
    if (filters.screenSize) {
      filteredLaptops = filteredLaptops.filter((laptop) => {
        console.log(
          "Comparing screenSize:",
          laptop.screenSize,
          filters.screenSize
        );
        return (
          String(laptop.screenSize)
            .replace(/inch|"/i, "")
            .trim() === String(filters.screenSize)
        );
      });
    }
    if (filters.cpu) {
      filteredLaptops = filteredLaptops.filter((laptop) => {
        const laptopCpu = String(laptop.cpu).toLowerCase();
        console.log(
          "Comparing CPU:",
          laptop.cpu,
          "->",
          laptopCpu,
          "with",
          filters.cpu
        );
        return laptopCpu.includes(filters.cpu.toLowerCase());
      });
    }
    if (filters.ram) {
      filteredLaptops = filteredLaptops.filter((laptop) => {
        const laptopRam = String(laptop.ram)
          .replace(/GB|gb|g|b/gi, "")
          .trim();
        console.log(
          "Comparing RAM:",
          laptop.ram,
          "->",
          laptopRam,
          "with",
          filters.ram
        );
        return laptopRam === String(filters.ram);
      });
    }
    if (filters.storage) {
      filteredLaptops = filteredLaptops.filter((laptop) => {
        const laptopStorage = String(laptop.storage)
          .replace(/GB|TB|SSD|gb|tb|ssd/gi, "")
          .trim();
        console.log(
          "Comparing storage:",
          laptop.storage,
          "->",
          laptopStorage,
          "with",
          filters.storage
        );
        return laptopStorage === String(filters.storage);
      });
    }
    if (filters.status) {
      filteredLaptops = filteredLaptops.filter((laptop) => {
        console.log("Comparing status:", laptop.status, filters.status);
        return laptop.status.toLowerCase() === filters.status.toLowerCase();
      });
    }

    console.log("Filtered laptops:", filteredLaptops);

    // Apply search
    if (searchQuery) {
      filteredLaptops = filteredLaptops.filter((laptop) =>
        laptop.itemName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filteredLaptops.sort((a, b) => {
      switch (sortOption) {
        case "ram-high-to-low":
          return (
            parseInt(String(b.ram).replace(/GB/i, "")) -
            parseInt(String(a.ram).replace(/GB/i, ""))
          );
        case "ram-low-to-high":
          return (
            parseInt(String(a.ram).replace(/GB/i, "")) -
            parseInt(String(b.ram).replace(/GB/i, ""))
          );
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        default:
          return 0;
      }
    });

    setLaptops(filteredLaptops);
  }, [filters, searchQuery, sortOption, allLaptops]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    console.log("New filters:", newFilters);
    setFilters(newFilters);
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Handle sorting
  const handleSort = (option) => {
    setSortOption(option);
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
        <p className="mt-2 text-teal-600">Loading laptops...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <FiltersSidebar onFilterChange={handleFilterChange} />
      <div className="w-3/4 p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-teal-800 mb-2">Laptop Borrow</h1>
          <div className="w-32 h-1 bg-teal-500 mx-auto rounded-full"></div>
        </div>

        <div className="flex items-center mb-12 space-x-6 justify-center">
          <div className="w-1/5">
            <SortOptions onSort={handleSort} />
          </div>
          <div className="w-3/5">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {laptops.map((laptop) => (
            <CardBorrow 
              key={laptop.itemId} 
              laptop={laptop} 
            />
          ))}
        </div>
        {laptops.length === 0 && (
          <div className="text-center text-gray-600 mt-8">
            <p>No laptops found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowListingPage;
