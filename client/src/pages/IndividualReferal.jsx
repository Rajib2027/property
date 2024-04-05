
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import { FaIdCard, FaAddressCard } from 'react-icons/fa';

export default function IndividualReferral() {
  const [referralData, setReferralData] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const response = await axios.get(`/api/user/indRef/${id}`);
        setReferralData(response.data.referal); // Use response.data.referal instead of response.data.referalData
      } catch (error) {
        setError('Failed to fetch referral data');
      }
    };

    fetchReferralData();
  }, [id]);

  const handleChangeStatus = async (newStatus) => {
    try {
      const response = await axios.put(`/api/user/referrals/${id}`, { status: newStatus });
      console.log('Referral updated successfully:', response.data);
      setReferralData(response.data); // Update referralData with the updated status
    } catch (error) {
      console.error('Failed to update status:', error);
      // Handle error
    }
  };

  return (
    <div className="container mx-auto py-8">
      {error && <div className="text-red-500">{error}</div>}
      {referralData && (
        <div>
          <h1 className="text-3xl font-bold mb-4">Referral Details</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><span className="font-semibold">Name:</span> {referralData.name}</p>
                  <p><span className="font-semibold">Contact Number:</span> {referralData.contactNumber}</p>
                  <p><span className="font-semibold">Alternative Contact:</span> {referralData.alternativeContact}</p>
                  <p><span className="font-semibold">Code:</span> {referralData.code}</p>
                </div>
                <div>
                  <p><span className="font-semibold">State:</span> {referralData.state}</p>
                  <p><span className="font-semibold">City:</span> {referralData.city}</p>
                  <p><span className="font-semibold">PIN:</span> {referralData.pin}</p>
                  <p><span className="font-semibold">District:</span> {referralData.district}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-4">Change Status</h2>
              <p><span className="font-semibold">Current Status:</span> {referralData.status}</p>
              <div className="flex space-x-4 mt-4">
                <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => handleChangeStatus('Active')}>Activate</button>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => handleChangeStatus('Hold')}>Hold</button>
                <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => handleChangeStatus('Inactive')}>Deactivate</button>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-2">PAN Card</h3>
                <div className="flex items-center">
                  <FaIdCard className="w-6 h-6 mr-2" />
                  <a href={referralData.pan[0]} target="_blank" download rel="noopener noreferrer">view PAN Card</a> {/* Add download attribute */}
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-2">Aadhar Card</h3>
                <div className="flex items-center">
                  <FaAddressCard className="w-6 h-6 mr-2" />
                  <a href={referralData.aadhar[0]} target="_blank" download rel="noopener noreferrer">view Aadhar Card</a> {/* Add download attribute */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
  );
}



// const downloadFile = (fileData, fileName) => {
//   console.log('File Data:', fileData); // Log the file data
//   console.log('File Name:', fileName); // Log the file name

//   const byteArray = new Uint8Array(fileData.data); // Extract the byte array from the object
//   const fileType = getFileType(byteArray);
//   console.log('File Type:', fileType); // Log the detected file type

//   const blob = new Blob([byteArray], { type: fileType });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement('a');
//   link.href = url;
//   link.setAttribute('download', fileName);
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };


// const getFileType = (byteArray) => {
//   if (byteArray[0] === 0x25 && byteArray[1] === 0x50 && byteArray[2] === 0x44 && byteArray[3] === 0x46) {
//     return 'application/pdf';
//   } else if (byteArray[0] === 0xff && byteArray[1] === 0xd8 && byteArray[2] === 0xff && byteArray[3] === 0xe0) {
//     return 'image/jpeg';
//   } else {
//     // Default to octet-stream if file type is unknown
//     return 'application/octet-stream';
//   }
// };
