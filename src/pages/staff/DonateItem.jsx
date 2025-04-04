import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";
import donateformApi from "../../api/donateformApi";

const DonateItem = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await donateformApi.getAllDonateForms();
        setDonations(response.data);
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
      console.log("Deleting donation with ID:", donationId); // debug
      const response = await donateformApi.deleteDonateForm(donationId);
      console.log("Delete response:", response); // debug

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
    d.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDonations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold">Donation Management</h1>
        <p className="mt-2 text-gray-600">
          Manage and review sponsor donations
        </p>
      </div>

      <div className="max-w-7xl mx-auto mb-4 flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Item Name..."
          className="px-4 py-2 border rounded-lg w-full max-w-md"
        />
        <button
          onClick={() => {
            setSearchTerm("");
            setCurrentPage(1);
            setLoading(true);
            const fetchAll = async () => {
              try {
                const response = await donateformApi.getAllDonateForms();
                setDonations(response.data);
              } catch (error) {
                console.error("Error reloading donations:", error);
              } finally {
                setLoading(false);
              }
            };
            fetchAll();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
        >
          <RefreshCw size={16} /> Reload
        </button>
      </div>

      <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold">Pending Donations</h2>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="px-6 py-4 text-center text-gray-500">
              Loading donations...
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Donation ID",
                    "Sponsor ID",
                    "Item Name",
                    "Description",
                    "Quantity",
                    "Created At",
                    "Status",
                    "Actions",
                  ].map((title) => (
                    <th
                      key={title}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase"
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No donations found
                    </td>
                  </tr>
                ) : (
                  currentItems.map((donation) => (
                    <tr
                      key={donation.donationFormId}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {donation.donationFormId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {donation.sponsorId || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {donation.itemName}
                      </td>
                      <td className="px-6 py-4">{donation.itemDescription}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {donation.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs font-medium rounded-full ${
                            donation.status === "Pending"
                              ? "bg-amber-100 text-amber-600"
                              : donation.status === "Approved"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {donation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {donation.status === "Pending" && (
                            <button
                              onClick={() =>
                                updateStatus(
                                  donation.donationFormId,
                                  "Approved"
                                )
                              }
                              className="text-slate-600 hover:text-amber-600"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          <button
                            onClick={() =>
                              deleteDonation(donation.donationFormId)
                            }
                            className="text-slate-600 hover:text-amber-600"
                          >
                            <XCircle size={18} />
                          </button>
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
          <div className="px-6 py-4 flex justify-between items-center border-t border-gray-100">
            <div className="text-sm text-gray-500">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredDonations.length)} of{" "}
              {filteredDonations.length} donations
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded hover:bg-slate-200 disabled:opacity-50"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 text-sm rounded ${
                    currentPage === i + 1
                      ? "bg-amber-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
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
                className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded hover:bg-slate-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default DonateItem;
