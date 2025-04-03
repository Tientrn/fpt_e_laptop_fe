import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { format } from "date-fns";
import borrowcontractApi from "../../api/borrowcontractApi";
import deposittransactionApi from "../../api/deposittransactionApi";
import userApi from "../../api/userApi";

const DepositPage = () => {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [contractDetails, setContractDetails] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [depositForm, setDepositForm] = useState({
    contractId: parseInt(contractId),
    userId: 0,
    status: "Pending",
    amount: 0,
    depositDate: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
  });

  useEffect(() => {
    if (contractId) {
      fetchContractDetails();
    }
  }, [contractId]);

  useEffect(() => {
    if (depositForm.userId) {
      fetchUserInfo();
    }
  }, [depositForm.userId]);

  const fetchUserInfo = async () => {
    try {
      const response = await userApi.getUserById(depositForm.userId);
      if (response.isSuccess) {
        setUserInfo(response.data);
      } else {
        toast.error("Failed to load user details");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error loading user details");
    }
  };

  const fetchContractDetails = async () => {
    try {
      setLoading(true);
      const response = await borrowcontractApi.getBorrowContractById(contractId);
      if (response.isSuccess) {
        setContractDetails(response.data);
        setDepositForm((prev) => ({
          ...prev,
          amount: Math.round(response.data.itemValue * 0.3),
          userId: response.data.userId || 0,
        }));
      } else {
        toast.error("Failed to load contract details");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error loading contract details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await deposittransactionApi.createDepositTransaction(depositForm);
      if (response.isSuccess) {
        toast.success("Deposit recorded successfully");
        navigate("/staff/contracts");
      } else {
        toast.error(response.message || "Failed to record deposit");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error recording deposit");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-black">Record Deposit Payment</h1>
        <span className="text-sm text-amber-600 font-medium">Staff Dashboard</span>
      </div>

      {/* Contract Details */}
      {contractDetails && (
        <div className="mb-6 p-4 bg-white border border-slate-200 rounded-md shadow-sm">
          <h2 className="text-lg font-semibold text-black mb-3">Contract Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">Contract ID</p>
              <p className="text-black font-medium">{contractDetails.contractId}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Item Value</p>
              <p className="text-black font-medium">${contractDetails.itemValue}</p>
            </div>
          </div>
        </div>
      )}

      {/* User Info */}
      {userInfo && (
        <div className="mb-6 p-4 bg-white border border-slate-200 rounded-md shadow-sm">
          <h2 className="text-lg font-semibold text-black mb-3">User Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">Full Name</p>
              <p className="text-black font-medium">{userInfo.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Email</p>
              <p className="text-black font-medium">{userInfo.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Deposit Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-slate-200 rounded-md shadow-sm p-6">
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Deposit Amount (30% of item value)
          </label>
          <input
            type="number"
            value={depositForm.amount}
            onChange={(e) => setDepositForm({ ...depositForm, amount: parseInt(e.target.value) })}
            className="w-full p-2 border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-amber-600"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Status</label>
          <select
            value={depositForm.status}
            onChange={(e) => setDepositForm({ ...depositForm, status: e.target.value })}
            className="w-full p-2 border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-amber-600"
            required
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            
            className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-amber-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={() => navigate("/staff/contracts")}
            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
            disabled={loading}
          >
            Record Deposit
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepositPage;
