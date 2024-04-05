import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AllProjects() {
    const [properties, setProperties] = useState([]);

    useEffect(() => {
      // Fetch properties from the API endpoint
      fetch('/api/property/getProject')
        .then(response => response.json())
        .then(data => setProperties(data))
        .catch(error => console.error('Error fetching properties:', error));
    }, []);
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {properties.map(property => (

          <div key={property._id} className="border p-4 rounded-md shadow-md  bg-white">
             <Link to={`/project-view/${property._id}`}>
            <img
              src={property.imgUrls[0]}
              alt={property.propertyName}
              className="max-w-full h-auto mb-4 rounded-md"
            />
            </Link>
            <h3 className="text-xl font-bold mb-2">{property.propertyName}</h3>
            <p className="text-gray-700">{property.desc}</p>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-500">{property.state}, {property.city}</p>
              <p className="text-sm text-gray-500">{property.propertyType}</p>
            </div>
            {/* Add more details or customize as needed */}
          </div>
        ))}
      </div>
    );
  };