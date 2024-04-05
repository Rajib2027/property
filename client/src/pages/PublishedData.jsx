import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";



export default function PublishedData() {
    const [investments, setInvestments] = useState([]);
    
    const [loading, setLoading] = useState(false);
   

    useEffect(() => {
        // Fetch all investments from the backend API
        fetch('/api/investor/investments')
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            if (Array.isArray(data)) { 
              setInvestments(data);
            } else {
              console.error("Failed to fetch investments:", data);
            }
          })
          .catch(error => {
            console.error("Error fetching investments:", error.message);
          });
      }, []);
      
    


      
    return (
        <div className="container mx-auto mt-8 p-6 bg-gray-100 rounded-lg shadow-md">
          <h1 className="text-3xl font-semibold mb-4">All Published Property</h1>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-3">Project Name</th>
                  <th className="border border-gray-300 p-3">State</th>
                  <th className="border border-gray-300 p-3">City</th>
                  <th className="border border-gray-300 p-3">Size</th>
                  <th className="border border-gray-300 p-3">Description</th>
                  <th className="border border-gray-300 p-3">Per Unit Value</th>
                  <th className="border border-gray-300 p-3">Min Increment Amount</th>
                  <th className="border border-gray-300 p-3">Assured Return Value</th>
                  <th className="border border-gray-300 p-3">Lock-in Period</th>
                  <th className="border border-gray-300 p-3">Action</th>
                 
                </tr>
              </thead>
              <tbody>
                {investments.map((investment, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-3 md:py-4">{investment.projectName}</td>
                    <td className="border border-gray-300 p-3 md:py-4">{investment.state}</td>
                    <td className="border border-gray-300 p-3 md:py-4">{investment.city}</td>
                    <td className="border border-gray-300 p-3 md:py-4">{investment.size}</td>
                    <td className="border border-gray-300 p-3 md:py-4">{investment.description}</td>
                    <td className="border border-gray-300 p-3 md:py-4">{investment.perUnitValue}</td>
                    <td className="border border-gray-300 p-3 md:py-4">{investment.minIncrementAmount}</td>
                    <td className="border border-gray-300 p-3 md:py-4">{investment.assuredReturnValue}</td>
                    <td className="border border-gray-300 p-3 md:py-4">{investment.lockInPeriod}</td>
                  
                    <td className="p-3 md:py-4 text-blue-800 border border-gray-300">
                    <Link to={`/investment/${investment._id}`}>
                        Apply
                        </Link>
                        </td>
                   
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    };