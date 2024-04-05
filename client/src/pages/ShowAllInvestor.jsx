import React, { useState, useEffect } from 'react';

export default function ShowAllInvestor() {
  const [investors, setInvestors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInvestors, setFilteredInvestors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/investor/getAll');
        if (response.ok) {
          const data = await response.json();
          setInvestors(data);
          setFilteredInvestors(data);
        } else {
          console.error('Failed to fetch investors.');
        }
      } catch (error) {
        console.error('Error while fetching investors:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search clicked. Search term:', searchTerm);

    const newFilteredInvestors = investors.filter((investor) =>
      Object.values(investor).some((value) =>
        typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    console.log('Filtered investors:', newFilteredInvestors);

    setFilteredInvestors(newFilteredInvestors);
  };






  
  console.log('Render. Filtered investors:', filteredInvestors);

  return (
    <div className="container mx-auto mt-8 p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold mb-4">Investor List</h1>
      <form onSubmit={handleSearch}>
      <div className="mb-4 flex items-center w-48  ">
  <input
    type="text"
    placeholder="Search by Name, Mobile, Email, etc."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="p-2 border border-gray-300 rounded-md flex-grow"
        />
  <button
    type="submit"
    className="ml-2 p-2 bg-blue-500 text-white rounded-md"
    >
    Search
  </button>
</div>

      </form>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-3">Investor ID</th>
              <th className="border border-gray-300 p-3">Name</th>
              <th className="border border-gray-300 p-3">Mobile</th>
              <th className="border border-gray-300 p-3">Email</th>
              <th className="border border-gray-300 p-3">WhatsApp</th>
              <th className="border border-gray-300 p-3">Date of Birth</th>
              <th className="border border-gray-300 p-3">DOA</th>
              <th className="border border-gray-300 p-3">Date of Entry</th>
              <th className="border border-gray-300 p-3">State</th>
              <th className="border border-gray-300 p-3">City</th>
              <th className="border border-gray-300 p-3">District</th>
              <th className="border border-gray-300 p-3">PIN</th>
              <th className="border border-gray-300 p-3">Referred By</th>
              <th className="border border-gray-300 p-3">Reference ID</th>
              <th className="border border-gray-300 p-3">Can Introduce</th>
              {/* <th className="border border-gray-300 p-3">Actions</th> */}
            </tr>
          </thead>
          <tbody>
          {filteredInvestors.map((investor) => (
              <tr key={investor._id}>
                <td className="border border-gray-300 p-3">{investor.investorId}</td>
                <td className="border border-gray-300 p-3">{investor.name}</td>
                <td className="border border-gray-300 p-3">{investor.mobile}</td>
                <td className="border border-gray-300 p-3">{investor.email}</td>
                <td className="border border-gray-300 p-3">{investor.whatsapp}</td>
              
<td className="border border-gray-300 p-3">{new Date(investor.dob).toLocaleDateString()}</td>
<td className="border border-gray-300 p-3">{new Date(investor.doa).toLocaleDateString()}</td>
<td className="border border-gray-300 p-3">{new Date(investor.dateOfEntry).toLocaleDateString()}</td>


                <td className="border border-gray-300 p-3">{investor.state}</td>
                <td className="border border-gray-300 p-3">{investor.city}</td>
                <td className="border border-gray-300 p-3">{investor.district}</td>
                <td className="border border-gray-300 p-3">{investor.pin}</td>
                <td className="border border-gray-300 p-3">{investor.referredBy}</td>
                <td className="border border-gray-300 p-3">{investor.referenceId}</td>
                <td className="border border-gray-300 p-3">{investor.canIntroduce ? 'Yes' : 'No'}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
    
      </div>
    </div>
  );
};
