// BookedPropertiesPage.js

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const NoBookingsPage = () => {
  return (
    <div className="text-center mt-8">
      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-4xl font-bold text-red-500 mb-4 animate__animated animate__fadeInDown">
          Oops! No Bookings Found.
        </h2>
        <p className="text-lg text-gray-700 animate__animated animate__fadeIn">
          You haven't made any bookings yet.
        </p>
        {/* Additional message specific to no bookings */}
        <div className="bg-blue-500 text-white p-4 rounded-md shadow-md inline-block mt-4 animate__animated animate__fadeInUp">
          <p className="text-lg font-bold mb-2">What you can do:</p>
          <ul className="list-disc list-inside">
            <li>Explore available properties and make your first booking.</li>
            <li>Contact us if you need assistance in the booking process.</li>
          </ul>
        </div>
        {/* Additional personalized message with animation */}
        <div className="mt-8">
          <p className="text-gray-600 animate-bounce">
            🏡 Ready to book your next stay? Start exploring our listings now!
          </p>
        </div>
      </div>
    </div>
  );
};







export const BookedPropertiesPage = () => {
  const [bookedProperties, setBookedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchBookedProperties = async () => {
      try {
        const res = await fetch(`/api/property/getBookedProperty/${currentUser._id}`);
        const data = await res.json();

        if (data.success) {
          setBookedProperties(data.bookedProperties);
        } else {
          console.error('Error fetching booked properties:', data.message);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching booked properties:', error);
        setLoading(false);
      }
    };

    fetchBookedProperties();
  }, [currentUser._id]);

  if (bookedProperties.length === 0) {
    return <NoBookingsPage />;
  }




  return (
    <div className="container mx-auto mt-8 bg-gray-100 p-8 rounded-lg">
      <h1 className="text-3xl font-extrabold mb-4 text-center animate-bounce text-purple-600 "> Booked Properties  🏡</h1>
  
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {bookedProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
          }
  const PropertyCard = ({ property }) => {
    // You can customize the card layout based on your needs
    return (
      <Link to={`/listing/${property.id}`} className="card-link">
        <div className="border rounded p-4 bg-white shadow-md hover:shadow-lg transition duration-300">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-32 object-cover mb-4 rounded-md"
          />
          <h3 className="text-xl font-semibold mb-2">{property.type}</h3>
          <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
          {/* Add other property details here */}
        </div>
      </Link>
    );
  };
  