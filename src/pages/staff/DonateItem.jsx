import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CheckCircle, XCircle, RefreshCw, PlusCircle } from "lucide-react";
import donateformApi from "../../api/donateformApi";
import { useNavigate } from "react-router-dom";

const DonateItem = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await donateformApi.getAllDonateForms();
        const sorted = response.data.sort(
          (a, b) => b.donationFormId - a.donationFormId
        );
        setDonations(sorted);
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
      const response = await donateformApi.deleteDonateForm(donationId);
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Donation Management
          </h1>
          <p className="mt-2 text-gray-600">
            Review and manage incoming donation requests
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              Filter by Status:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded px-3 py-1 text-sm"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              <RefreshCw size={18} className="animate-spin-hover" /> Reload
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          

          <div className="overflow-auto shadow-md rounded-lg">
            {loading ? (
              <div className="px-6 py-8 text-center">
                <div className="animate-spin inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mb-2"></div>
                <p className="text-gray-500">Loading donations...</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                <tr className="bg-gradient-to-r from-gray-500 to-green-500 text-white">
                    {[
                      "Item Name",
                      "Description",
                      "Quantity",
                      "Created At",
                      "Status",
                      "Actions",
                    ].map((title) => (
                      <th
                        key={title}
                        className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider"
                      >
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center">
                        <p className="text-gray-500 text-base">
                          No donations found
                        </p>
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((donation) => (
                      <tr
                        key={donation.donationFormId}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {donation.itemName}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {donation.itemDescription}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {donation.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              donation.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : donation.status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {donation.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                deleteDonation(donation.donationFormId)
                              }
                              className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors duration-200"
                              title="Delete Donation"
                            >
                              <XCircle size={16} className="mr-1.5" /> Delete
                            </button>
                            {donation.status === "Pending" && (
                              <button
                                onClick={() =>
                                  updateStatus(
                                    donation.donationFormId,
                                    "Approved"
                                  )
                                }
                                className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-200"
                                title="Approve Donation"
                              >
                                <CheckCircle size={16} className="mr-1.5" />{" "}
                                Approve
                              </button>
                            )}
                            {donation.status === "Approved" && (
                              <button
                                onClick={() =>
                                  navigate("/staff/create-itemdonate", {
                                    state: {
                                      donateFormId: donation.donationFormId,
                                      sponsorId: donation.userId,
                                    },
                                  })
                                }
                                className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors duration-200"
                                title="Create Item"
                              >
                                <PlusCircle size={16} className="mr-1.5" />{" "}
                                Create Item
                              </button>
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
            <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-500">
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
                  className="px-3 py-1 text-sm bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 text-sm rounded-lg ${
                      currentPage === i + 1
                        ? "bg-indigo-600 text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
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
