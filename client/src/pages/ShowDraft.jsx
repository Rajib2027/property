import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ShowDraft() {
  const [drafts, setDrafts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch drafts from the server
    fetch("/api/investor/allDrafts")
      .then((response) => response.json())
      .then((data) => setDrafts(data))
      .catch((error) => console.error("Error fetching drafts:", error.message));
  }, []);

  const handleEdit = (projectId) => {
    navigate(`/seek/${projectId}`);
  };

  return (
    <div className="table-container overflow-x-auto">
      <h2 className="text-3xl font-extrabold mb-6">Draft List</h2>
      {drafts.length === 0 ? (
        <p>No drafts available.</p>
      ) : (
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
            <th className="border border-gray-300 py-2 px-4">Project Id</th>
              <th className="border border-gray-300 py-2 px-4">Project Name</th>
              <th className="border border-gray-300 py-2 px-4">State</th>
              <th className="border border-gray-300 py-2 px-4">City</th>
              <th className="border border-gray-300 py-2 px-4">District</th>
              <th className="border border-gray-300 py-2 px-4">Pin</th>
              <th className="border border-gray-300 py-2 px-4">Size</th>
              <th className="border border-gray-300 py-2 px-4">Description</th>
              <th className="border border-gray-300 py-2 px-4">Per Unit Value</th>
              <th className="border border-gray-300 py-2 px-4">Total Amount</th>
              <th className="border border-gray-300 py-2 px-4">Min Increment Amount</th>
              <th className="border border-gray-300 py-2 px-4">Number of Units</th>
              <th className="border border-gray-300 py-2 px-4">Assured Return Value</th>
              <th className="border border-gray-300 py-2 px-4">Lock-in Period</th>
              <th className="border border-gray-300 py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drafts.map((draft) => (
              <tr key={draft.projectId}> 
                <td className="border border-gray-300 py-2 px-4">{draft.projectId}</td>
                <td className="border border-gray-300 py-2 px-4">{draft.projectName}</td>
                <td className="border border-gray-300 py-2 px-4">{draft.state}</td>
                <td className="border border-gray-300 py-2 px-4">{draft.city}</td>
                <td className="border border-gray-300 py-2 px-4">{draft.district}</td>
                <td className="border border-gray-300 py-2 px-4">{draft.pin}</td>
                <td className="border border-gray-300 py-2 px-4">{draft.size}</td>
                <td className="border border-gray-300 py-2 px-4">{draft.description}</td>
                <td className="border border-gray-300 py-2 px-4">{draft.perUnitValue}</td>
                <td className="border border-gray-300 py-2 px-4">{draft.totalAmount}</td>
                <td className="border border-gray-300 py-2 px-4">{draft.minIncrementAmount}</td>
                <td className="border border-gray-300 py-2 px-4">{draft.numOfUnits}</td>
                <td className="border border-gray-300 py-2 px-4">{draft.assuredReturnValue}</td>
                <td className="border border-gray-300 py-2 px-4">{draft.lockInPeriod}</td>
                <td className="border border-gray-300 py-2 px-4">
                  <button
                    onClick={() => handleEdit(draft.projectId)}
                    className="text-blue-500 hover:underline focus:outline-none"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}