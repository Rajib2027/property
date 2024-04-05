import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ViewReferalls() {
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await axios.get('/api/user/referals'); // Update the URL as per your backend endpoint
        setReferrals(response.data);
      } catch (error) {
        console.error('Error fetching referrals:', error);
      }
    };

    fetchReferrals();
  }, []);
    

  const downloadFile = async (fileUrl, fileName) => {
    try {
      const response = await axios.get(fileUrl, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Referrals</h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Number</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            {/* Add more table headers for other fields if needed */}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {referrals.map(referral => (
            <tr key={referral._id}>
              <td className="px-6 py-4 whitespace-nowrap">{referral.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{referral.contactNumber}</td>
              <td className="px-6 py-4 whitespace-nowrap">{referral.state}</td>
              <td className="px-6 py-4 whitespace-nowrap">{referral.city}</td>
              <td className="px-6 py-4 whitespace-nowrap">{referral.code}</td>
             
              <td className="px-6 py-4 whitespace-nowrap">{referral.status}</td>
              <Link to={`/indRef/${referral._id}`}>View</Link>
              {/* Render other fields similarly */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};