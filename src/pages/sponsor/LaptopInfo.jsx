import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

const LaptopInfo = () => {
  const [laptopData, setLaptopData] = useState({
    brand: '',
    model: '',
    processor: '',
    ram: '',
    storage: '',
    condition: '',
    description: '',
    images: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call to register laptop
      toast.success('Laptop registered successfully!');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Register New Laptop
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Add form fields for laptop information */}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Register Laptop
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LaptopInfo; 