import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  PlusCircle,
  Gift,
} from "lucide-react";
import donateformApi from "../../api/donateformApi";
import userApi from "../../api/userApi";
import { useNavigate } from "react-router-dom";

const DonateItem = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sponsorInfoMap, setSponsorInfoMap] = useState({});

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await donateformApi.getAllDonateForms();
        const sorted = response.data.sort(
          (a, b) => b.donationFormId - a.donationFormId
        );
        setDonations(sorted);
        const sponsorIds = [
          ...new Set(response.data.map((d) => d.sponsorId).filter(Boolean)),
        ];
        sponsorIds.forEach(async (sponsorId) => {
          if (!sponsorInfoMap[sponsorId]) {
            try {
              const res = await userApi.getUserById(sponsorId);
              if (res.data) {
                setSponsorInfoMap((prev) => ({
                  ...prev,
                  [sponsorId]: res.data,
                }));
              }
            } catch (err) {
              // Không toast ở đây để tránh spam
            }
          }
        });
        toast.success("Donations loaded successfully", {
          toastId: "donations-loaded",
        });
      } catch (error) {
        console.error("Error fetching donations:", error);
        toast.error("Failed to load donations");
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
    // eslint-disable-next-line
  }, []);

  const updateStatus = async (donationId, newStatus) => {
    try {
      const donation = donations.find((d) => d.donationFormId === donationId);
      if (!donation) throw new Error("Donation not found");

      const updatedData = {
        itemName: donation.itemName || "string",
        itemDescription: donation.itemDescription || "string",
        quantity: donation.quantity || 0,
        status: newStatus,
      };

      await donateformApi.updateDonateForm(donationId, updatedData);

      // Update the status in the list
      setDonations((prev) =>
        prev.map((d) =>
          d.donationFormId === donationId ? { ...d, status: newStatus } : d
        )
      );
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const deleteDonation = async (donationId) => {
    if (!window.confirm("Are you sure you want to delete this donation?"))
      return;
    try {
      await donateformApi.deleteDonateForm(donationId);
      setDonations((prev) =>
        prev.filter((d) => d.donationFormId !== donationId)
      );
      toast.success("Donation deleted successfully");
    } catch (error) {
      console.error(
        "Error deleting donation:",
        error.response || error.message
      );
      toast.error("Failed to delete donation");
    }
  };

  const filteredDonations = donations.filter((d) =>
    statusFilter === "All" ? true : d.status === statusFilter
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDonations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-indigo-200 flex items-center justify-center shadow">
            <Gift className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-700 tracking-tight">
              Donation Management
            </h1>
            <p className="mt-1 text-gray-600 text-base">
              Review and manage incoming donation requests
            </p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow border border-indigo-100 p-6 mb-8 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-4 flex-1">
            <label className="text-base font-medium text-gray-700">
              Filter by Status:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border-2 border-indigo-200 rounded-xl px-4 py-2 text-base focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Done">Done</option>
            </select>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-all font-semibold shadow"
          >
            <RefreshCw size={20} className="animate-spin-hover" /> Reload
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
          <div className="overflow-auto rounded-2xl">
            {loading ? (
              <div className="px-6 py-16 text-center">
                <div className="animate-spin inline-block w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
                <p className="text-gray-500 text-lg">Loading donations...</p>
              </div>
            ) : (
              <table className="w-full text-base">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-400 to-indigo-600 text-white">
                    {[
                      "Item Name",
                      "Description",
                      "Quantity",
                      "Image",
                      "Sponsor",
                      "Created At",
                      "Status",
                      "Actions",
                    ].map((title) => (
                      <th
                        key={title}
                        className="px-6 py-4 text-left font-bold uppercase tracking-wider first:rounded-tl-2xl last:rounded-tr-2xl"
                      >
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-50">
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center">
                        <p className="text-gray-500 text-lg">
                          No donations found
                        </p>
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((donation) => (
                      <tr
                        key={donation.donationFormId}
                        className="hover:bg-indigo-50 transition-all"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-indigo-800 font-semibold">
                          {donation.itemName}
                        </td>
                        <td className="px-6 py-4 text-indigo-700">
                          {donation.itemDescription}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-indigo-700 font-bold">
                          {donation.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={donation.imageDonateForm}
                            alt="Donation"
                            className="w-20 h-20 object-cover rounded-xl border-2 border-indigo-100 shadow hover:scale-105 transition-transform duration-200"
                            onError={(e) => {
                              e.target.src = "/no-image.png";
                            }}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-indigo-700">
                          {sponsorInfoMap[donation.sponsorId] ? (
                            <div>
                              <div className="font-semibold">
                                {sponsorInfoMap[donation.sponsorId].fullName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {sponsorInfoMap[donation.sponsorId].email}
                              </div>
                              <div className="text-xs text-gray-500">
                                {sponsorInfoMap[donation.sponsorId].phoneNumber}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">
                              Loading...
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-indigo-700">
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold shadow border transition-all duration-200
                              ${
                                donation.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                  : donation.status === "Approved"
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : donation.status === "Done"
                                  ? "bg-blue-100 text-blue-800 border-blue-200"
                                  : "bg-red-100 text-red-800 border-red-200"
                              }
                            `}
                          >
                            {donation.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {(donation.status === "Pending" ||
                              donation.status === "Approved") && (
                              <button
                                onClick={() =>
                                  deleteDonation(donation.donationFormId)
                                }
                                className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all font-semibold shadow"
                                title="Delete Donation"
                              >
                                <XCircle size={18} className="mr-2" /> Delete
                              </button>
                            )}
                            {donation.status === "Pending" && (
                              <button
                                onClick={() =>
                                  updateStatus(
                                    donation.donationFormId,
                                    "Approved"
                                  )
                                }
                                className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all font-semibold shadow"
                                title="Approve Donation"
                              >
                                <CheckCircle size={18} className="mr-2" />{" "}
                                Approve
                              </button>
                            )}
                            {donation.status === "Approved" && (
                              <button
                                onClick={() =>
                                  navigate("/staff/create-itemdonate", {
                                    state: {
                                      donateFormId: donation.donationFormId,
                                      sponsorId: donation.sponsorId,
                                    },
                                  })
                                }
                                className="inline-flex items-center px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-all font-semibold shadow"
                                title="Create Item"
                              >
                                <PlusCircle size={18} className="mr-2" /> Create
                                Item
                              </button>
                            )}
                            {donation.status === "Done" && (
                              <span className="text-sm text-gray-500">
                                Processing completed
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {filteredDonations.length > 0 && (
            <div className="px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-indigo-100 bg-indigo-50 rounded-b-2xl">
              <div className="text-base text-indigo-700 font-medium">
                Showing {indexOfFirstItem + 1} to{" "}
                {Math.min(indexOfLastItem, filteredDonations.length)} of{" "}
                {filteredDonations.length} donations
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-base font-bold transition-all duration-200
                    ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-100"
                    }
                  `}
                >
                  &lt;
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-base font-bold transition-all duration-200
                      ${
                        currentPage === i + 1
                          ? "bg-indigo-500 text-white shadow-lg"
                          : "bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-100"
                      }
                    `}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-base font-bold transition-all duration-200
                    ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-100"
                    }
                  `}
                >
                  &gt;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default DonateItem;
