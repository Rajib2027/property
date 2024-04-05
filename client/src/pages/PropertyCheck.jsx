import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function PropertyCheck() {
  const { listingId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [listing, setListing] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/property/get/${listingId}`);
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

  const handleStatusChange = async () => {
    try {
      const response = await axios.put(
        `/api/property/changeStatus/${listingId}`,
        {
          status: !listing.status, // Change here to 'status'
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (data.success) {
        setListing({ ...listing, status: !listing.status });
      } else {
        // Handle server-side error
        console.error("Server-side error:", data.error);
        // You can show a user-friendly message to the user if needed
      }
    } catch (error) {
      // Handle network or unexpected errors
      console.error("Network or unexpected error:", error.message);
      // You can show a user-friendly message to the user if needed
    }
  };


  const handleSold = async () => {
    try {
      const response = await axios.put(
        `/api/property/sold/${listingId}`,
        {
          sold: !listing.sold, // Change here to 'status'
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (data.success) {
        setListing({ ...listing, sold: !listing.sold });
      } else {
        // Handle server-side error
        console.error("Server-side error:", data.error);
        // You can show a user-friendly message to the user if needed
      }
    } catch (error) {
      // Handle network or unexpected errors
      console.error("Network or unexpected error:", error.message);
      // You can show a user-friendly message to the user if needed
    }
  };


  const handleHold = async () => {
    try {
      const response = await axios.put(
        `/api/property/hold/${listingId}`,
        {
          hold: !listing.hold, // Change here to 'status'
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (data.success) {
        setListing({ ...listing, hold: !listing.hold });
      } else {
        // Handle server-side error
        console.error("Server-side error:", data.error);
        // You can show a user-friendly message to the user if needed
      }
    } catch (error) {
      // Handle network or unexpected errors
      console.error("Network or unexpected error:", error.message);
      // You can show a user-friendly message to the user if needed
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="mb-4 rounded-md overflow-hidden">
          <img
            src={listing.imgUrls}
            alt={listing.title}
            className="w-full h-fit object-cover rounded-md shadow-md"
          />
        </div>
        <div className="col-span-2 flex">
          <div className="bg-gray-100 p-4 rounded-md w-full">
            {/* Existing property details */}
            <div className="mb-2">
              <h1 className="text-4xl font-semibold mb-6 text-center text-blue-600">
                Property Details
              </h1>
            </div>
            <div className="mb-2">
              <span className="text-gray-600">Title:</span> {listing.title}
            </div>
            <div className="mb-2">
              <span className="text-gray-600">Type:</span> {listing.type}
            </div>
            <div className="mb-2">
              <span className="text-gray-600">Description:</span> {listing.desc}
            </div>
            <div className="mb-2">
              <span className="text-gray-600">Price:</span> ${listing.price}
            </div>
            <div className="mb-2">
              <span className="text-gray-600">Size:</span> {listing.sqrmeter}{" "}
              sqm
            </div>
            <div className="mb-2">
              <span className="text-gray-600">Location:</span> {listing.city},{" "}
              {listing.state}
            </div>
            <div className="mb-2">
              <span className="text-gray-600">District:</span>{" "}
              {listing.district}
            </div>
            <div className="mb-2">
              <span className="text-gray-600">PIN:</span> {listing.pin}
            </div>
            <div className="mb-2">
            <span>Status: {listing.status ? 'Approved' : 'Pending Approval'}</span>
            </div>
            <div className="mb-2">
            <span>Sold: {listing.sold ? 'Sold' : 'Pending'}</span>
            </div>
            <div className="mb-2">
            <span>Hold: {listing.hold ? 'Booked' : 'Pending'}</span>
            </div>
            <div className="mb-2 flex justify-center space-x-4">
  <button
    onClick={handleStatusChange}
    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
  >
    Change Status
  </button> 
  <button
   onClick={handleHold}
    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
  >
    Hold
  </button>
  <button
  onClick={handleSold}
    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
  >
    Sold
  </button>
</div>

          </div>
          <div className="bg-gray-200 p-4 rounded-md w-full ml-4">
            
            {/* Display user details with null checks */}
            {listing.user && (
              <>
                <div className="mb-2">
                  <h1 className="text-4xl font-semibold mb-6 text-center text-blue-600">
                    User Details
                  </h1>
                </div>
                <div className="mb-2">
                  <span className="text-gray-600 mb-2">
                    Added by: {listing.user.username}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-gray-600 mb-2">
                    Email: {listing.user.email}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-gray-600 mb-2">
                    Mobile: {listing.user.mobile}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
       
      </div>
    </div>
  );
}
