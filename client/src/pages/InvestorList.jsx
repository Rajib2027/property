// InvestorList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InvestorList = () => {
  const [investorData, setInvestorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('api/investor/allInvest');
        setInvestorData(response.data);
      } catch (error) {
        setError(error.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4 bg-gray-100">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 bg-gray-100">
        <div className="text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-auto mt-2 p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Invested Amount</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-white">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Project Name</th>
              <th className="border border-gray-300 p-2">Number of Units</th>
              <th className="border border-gray-300 p-2">Total Amount</th>
              <th className="border border-gray-300 p-2">Username</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Mobile</th>
            </tr>
          </thead>
          <tbody>
            {investorData.map((investor) => (
              <tr key={investor._id}>
                <td className="border border-gray-300 p-2">{investor.projectName}</td>
                <td className="border border-gray-300 p-2">{investor.numOfUnits}</td>
                <td className="border border-gray-300 p-2">{investor.totalAmount}</td>
                <td className="border border-gray-300 p-2">{investor.userRef.username}</td>
                <td className="border border-gray-300 p-2">{investor.userRef.email}</td>
                <td className="border border-gray-300 p-2">{investor.userRef.mobile || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvestorList;
