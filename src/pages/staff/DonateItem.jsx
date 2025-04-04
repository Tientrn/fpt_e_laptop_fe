import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import donateformApi from "../../api/donateformApi";

const DonateItem = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [donationIdInput, setDonationIdInput] = useState(""); // For fetching by ID

  // Fetch all donations on mount
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

  // Fetch donation by ID
  const fetchDonationById = async () => {
    if (!donationIdInput) {
      toast.error("Please enter a donation ID");
      return;
    }
    try {
      setLoading(true);
      const response = await donateformApi.getDonateFormById(donationIdInput);
      setDonations([response.data]); // Replace list with single donation
      toast.success(`Donation ${donationIdInput} loaded successfully`);
      setDonationIdInput(""); // Clear input
    } catch (error) {
      console.error("Error fetching donation by ID:", error);
      toast.error("Failed to fetch donation");
    } finally {
      setLoading(false);
    }
  };

  // Update donation status
  const updateStatus = async (donationId, newStatus) => {
    try {
      // Find the donation in local state
      const donation = donations.find((d) => d.donationFormId === donationId);
      if (!donation) {
        throw new Error("Donation not found in local state");
      }

      // Construct the payload with required fields
      const updatedData = {
        itemName: donation.itemName,
        itemDescription: donation.itemDescription,
        quantity: donation.quantity,
        status: newStatus,
      };

      // Update the donation on the server
      await donateformApi.updateDonateForm(donationId, updatedData);

      // Update local state
      setDonations((prevDonations) =>
        prevDonations.map((donation) =>
          donation.donationFormId === donationId
            ? { ...donation, status: newStatus }
            : donation
        )
      );
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  // Delete donation
  const deleteDonation = async (donationId) => {
    if (!window.confirm("Are you sure you want to delete this donation?"))
      return;
    try {
      await donateformApi.deleteDonateForm(donationId);
      setDonations((prevDonations) =>
        prevDonations.filter(
          (donation) => donation.donationFormId !== donationId
        )
      );
      toast.success("Donation deleted successfully");
    } catch (error) {
      console.error("Error deleting donation:", error);
      toast.error("Failed to delete donation");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Donation Management
        </h1>
        <p className="mt-2 text-gray-600">
          Manage and review sponsor donations
        </p>
      </div>

      {/* Fetch by ID Input */}
      <div className="max-w-7xl mx-auto mb-4 flex gap-2">
        <input
          type="text"
          value={donationIdInput}
          onChange={(e) => setDonationIdInput(e.target.value)}
          placeholder="Search by ID..."
          className="px-4 py-2 border rounded-lg"
        />
        <button
          onClick={fetchDonationById}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
        <button
          onClick={() => {
            setDonationIdInput("");
            setDonations([]);
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
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Reload All
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Pending Donations
            </h2>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="px-6 py-4 text-center text-gray-500">
              Loading donations...
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donation ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sponsor ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {donations.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No donations found
                    </td>
                  </tr>
                ) : (
                  donations.map((donation) => (
                    <tr
                      key={donation.donationFormId}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {donation.donationFormId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {donation.sponsorId || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {donation.itemName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {donation.itemDescription}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {donation.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {donation.status === "Pending" && (
                            <>
                              <button
                                onClick={() =>
                                  updateStatus(
                                    donation.donationFormId,
                                    "Approved"
                                  )
                                }
                                className="text-green-600 hover:text-green-900"
                              >
                                Approve
                              </button>
                              {/* <button
                                onClick={() => updateStatus(donation.donationFormId, 'Rejected')}
                                className="text-red-600 hover:text-red-900"
                              >
                                Reject
                              </button> */}
                            </>
                          )}
                          <button
                            onClick={() =>
                              deleteDonation(donation.donationFormId)
                            }
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
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
      </div>

      <ToastContainer />
    </div>
  );
};

export default DonateItem;
