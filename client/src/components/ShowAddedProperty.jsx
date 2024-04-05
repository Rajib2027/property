import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ShowAddedProperty() {
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setShowListingError(false);

        const res = await fetch(`/api/property/findProperties/${currentUser._id}`);

        if (!res.ok) {
          setShowListingError(true);
          return;
        }

        const data = await res.json();

        setUserListings(data || []); // Ensure data is not null or undefined
      } catch (error) {
        console.error(error);
        setShowListingError(true);
      }
    };

    // Fetch listings when the component mounts
    fetchListings();
  }, [currentUser._id]); // Dependency added to re-fetch when currentUser._id changes

  return (
    <div className="p-4">
      <p className='text-red-700 mt-2'>{showListingError ? 'Error showing listings' : ''}</p>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {userListings &&
          userListings.length > 0 &&
          userListings.map((listing) => (
            <div key={listing._id} className='border rounded-lg overflow-hidden bg-white p-4'>
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imgUrls[0]}
                  alt='listing cover'
                  className='h-48 w-full object-cover mb-2'
                />
              </Link>
              <div className='p-4'>
                <Link to={`/listing/${listing._id}`}>
                  <p className='text-gray-800 font-semibold hover:underline'>{listing.title}</p>
                </Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
