import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ApprovalPage() {
    const [properties, setProperties] = useState([]);   
    useEffect(() => {
        // Fetch properties with status set to false
        axios.get('/api/property/approve', { params: { status: false } })
          .then(response => {
            setProperties(response.data);
          })
          .catch(error => {
            console.error('Error fetching properties:', error);
          });
      }, []);

      return (
        <div className="container mx-auto mt-8 p-6 bg-gray-100 rounded-lg shadow-md">
          <h1 className="text-3xl font-semibold mb-4">Approval Page</h1>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-3">Image</th>
                  <th className="border border-gray-300 p-3">Type</th>
                  <th className="border border-gray-300 p-3">Title</th>
                  <th className="border border-gray-300 p-3">Description</th>
                  <th className="border border-gray-300 p-3">Price</th>
                  <th className="border border-gray-300 p-3">Size</th>
                  <th className="border border-gray-300 p-3">State</th>
                  <th className="border border-gray-300 p-3">City</th>
                  <th className="border border-gray-300 p-3">District</th>
                  <th className="border border-gray-300 p-3">PIN</th>
                  <th className="border border-gray-300 p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr key={property._id}>
                    <td className="border border-gray-300 p-3">
                    <Link to={`/property-check/${property._id}`}>
                  <img
                    src={property.imgUrls}
                    alt={property.title}
                    className="w-96 h-48 object-cover mb-4 rounded-md cursor-pointer"
                  />
                </Link>
                    </td>
                    <td className="border border-gray-300 p-3">{property.type || property.propertyType}</td>
                    <td className="border border-gray-300 p-3">{property.title || property.propertyName}</td>
                    <td className="border border-gray-300 p-3">{property.desc}</td>
                   
                    <td className="border border-gray-300 p-3">{property.price}</td>
                    <td className="border border-gray-300 p-3">
                      Sqrmeter: {property.sqrmeter}
                      <br />
                      Sqrfeet: {property.sqrfeet}
                      <br />
                      Decimil: {property.decimil}
                    </td>
                    <td className="border border-gray-300 p-3">{property.state}</td>
                    <td className="border border-gray-300 p-3">{property.city}</td>
                    <td className="border border-gray-300 p-3">{property.district}</td>
                    <td className="border border-gray-300 p-3">{property.pin}</td>
                    <td className="border border-gray-300 p-3">
                      {property.status ? 'Approved' : 'Pending Approval'}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
                };      