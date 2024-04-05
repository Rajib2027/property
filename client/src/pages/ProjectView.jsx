import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProjectView() {
  const { listingId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [listing, setListing] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/property/getProject/${listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [listingId]);

  const handleStatusChange = async (fieldIndex, subtypeIndex) => {
    try {
      const updatedListing = { ...listing };
      const field =
        subtypeIndex !== undefined
          ? updatedListing.additionalFields[fieldIndex].subtypes[subtypeIndex]
          : updatedListing.additionalFields[fieldIndex];

      field.loading = true;

      const response = await fetch(`/api/property/${listingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fieldIndex: fieldIndex,
          subtypeIndex: subtypeIndex,
          status: status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData.error);
      } else {
        const updatedProperty = await response.json();
        console.log("Property Updated:", updatedProperty);
        setListing(updatedProperty);
      }
    } catch (error) {
      console.error("Internal Server Error:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data!</div>;
  }

  if (!listing) {
    return <div>No data available for the specified listing ID.</div>;
  }

  return (
    <div className="container mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-6">
        <div className="mb-4 rounded-md overflow-hidden ">
          <img
            src={listing.imgUrls}
            alt={listing.title}
            className="w-full h-fit object-cover rounded-md shadow-md"
          />

          <div className="mb-2">
            <span className="text-gray-600">Title:</span> {listing.propertyName}
          </div>
          <div className="mb-2">
            <span className="text-gray-600">Type:</span> {listing.propertyType}
          </div>
          <div className="mb-2">
            <span className="text-gray-600">Description:</span> {listing.desc}
          </div>
          <div className="mb-2">
            <span className="text-gray-600">Min Booking Amount:</span> $
            {listing.minBookingAmount}
          </div>
          <div className="mb-2">
            <span className="text-gray-600">Location:</span> {listing.city},{" "}
            {listing.state}
          </div>
          <div className="mb-2">
            <span className="text-gray-600">District:</span> {listing.district}
          </div>
          <div className="mb-2">
            <span className="text-gray-600">PIN:</span> {listing.pin}
          </div>
        </div>

        <div className="col-span-2 flex">
          <div className=" p-4 rounded-md w-full ml-4">
            {listing.additionalFields &&
              listing.additionalFields.length > 0 && (
                <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                  {/* Table headers */}
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">Type</th>
                      {/* Other header columns */}
                      <th className="border border-gray-300 px-4 py-2">
                        Status
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listing.additionalFields.map((field, fieldIndex) => (
                      <React.Fragment key={fieldIndex}>
                        {/* Rows for subtypes */}
                        {field.subtypes &&
                          field.subtypes.length > 0 &&
                          field.subtypes.map((subtype, subtypeIndex) => (
                            <tr key={`${fieldIndex}-${subtypeIndex}`}>
                              {/* Columns for subtypes */}
                              <td className="text-center">{subtype.type}</td>
                              {/* Other columns */}
                              <td className="text-center">{subtype.status}</td>
                              <td>
                                {/* Dropdown and update button */}
                                <div className="relative inline-block justify-center">
                                  <select 
                                    className="px-4 py-2 rounded-md ml-2 border border-solid border-gray-900 "  
                                    onChange={(e) => {
                                      setStatus(e.target.value);
                                    }}
                                  >
                                    <option value="">Change Status</option>
                                    <option value="Booked">Booked</option>
                                    <option value="SoldOut">SoldOut</option>
                                  </select>
                                  <button
                                    className={`bg-blue-500 text-white px-4 py-2 rounded-md ml-2 mt-2 ${
                                      subtype.loading
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      handleStatusChange(
                                        fieldIndex,
                                        subtypeIndex
                                      )
                                    }
                                  >
                                    {subtype.loading ? "Updating..." : "Update"}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
