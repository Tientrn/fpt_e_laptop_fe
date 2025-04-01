import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import borrowcontractApi from '../../api/borrowcontractApi';
import deposittransactionApi from '../../api/deposittransactionApi';

const DepositPage = () => {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [contractDetails, setContractDetails] = useState(null);
  const [depositForm, setDepositForm] = useState({
    contractId: parseInt(contractId),
    userId: 0,
    status: 'Pending',
    amount: 0,
    depositDate: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
  });

  useEffect(() => {
    if (contractId) {
      fetchContractDetails();
    }
  }, [contractId]);

  const fetchContractDetails = async () => {
    try {
      setLoading(true);
      const response = await borrowcontractApi.getBorrowContractById(contractId);
      if (response.isSuccess) {
        setContractDetails(response.data);
        // Pre-fill deposit amount as 30% of item value
        setDepositForm(prev => ({
          ...prev,
          amount: Math.round(response.data.itemValue * 0.3)
        }));
      } else {
        toast.error('Failed to load contract details');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error loading contract details');
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
        toast.success('Deposit recorded successfully');
        navigate('/staff/contracts');
      } else {
        toast.error(response.message || 'Failed to record deposit');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error recording deposit');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Record Deposit Payment</h1>

      {contractDetails && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Contract Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Contract ID</p>
              <p className="font-medium">{contractDetails.contractId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Item Value</p>
              <p className="font-medium">${contractDetails.itemValue}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Expected Return Date</p>
              <p className="font-medium">
                {format(new Date(contractDetails.expectedReturnDate), 'dd/MM/yyyy')}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            User ID
          </label>
          <input
            type="number"
            value={depositForm.userId}
            onChange={(e) => setDepositForm({...depositForm, userId: parseInt(e.target.value)})}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deposit Amount (30% of item value)
          </label>
          <input
            type="number"
            value={depositForm.amount}
            onChange={(e) => setDepositForm({...depositForm, amount: parseInt(e.target.value)})}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={depositForm.status}
            onChange={(e) => setDepositForm({...depositForm, status: e.target.value})}
            className="w-full p-2 border rounded-md"
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
            onClick={() => navigate('/staff/contracts')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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