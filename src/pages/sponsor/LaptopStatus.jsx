import React, { useState, useEffect } from 'react';

const LaptopStatus = () => {
  const [laptops, setLaptops] = useState([]);

  useEffect(() => {
    // Fetch laptops data
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Laptops Status</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {laptops.map((laptop) => (
            <div key={laptop.id} className="bg-white rounded-lg shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{laptop.model}</h2>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  laptop.status === 'Available' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {laptop.status}
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">Current Borrower</h3>
                  <p className="text-gray-600">{laptop.currentBorrower || 'None'}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Recent Feedback</h3>
                  <div className="mt-2 space-y-2">
                    {laptop.feedback?.map((feedback, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-600">{feedback.comment}</p>
                        <div className="mt-1 text-xs text-gray-500">
                          {feedback.user} - {feedback.date}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LaptopStatus; 