import React, { useState } from 'react';

export default function InvestorForm() {
  const initialFormData = {
    investorId: '',
    name: '',
    mobile: '',
    email: '',
    whatsapp: '',
    dob: '',
    doa: '',
    dateOfEntry:'',
    state: '',
    city: '',
    district: '',
    pin: '',
    referredBy: '',
    referenceId: '',
    canIntroduce: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    // Handle date fields separately to remove the time component
    if (type === 'date') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value, // Set the formatted date directly
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : value,
      }));
    };
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/investor/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Form Data Submitted successfully:', formData);
        setSubmitSuccess(true);
        setFormData(initialFormData); // Reset the form data
      } else {
        console.error('Failed to submit form data.');
      }
    } catch (error) {
      console.error('Error while submitting form data:', error);
    }
  };

      return (
        <div className="container mx-auto mt-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 max-w-3xl mx-auto bg-white p-6 rounded-md shadow-md">
            {/* Column 1 */}
            <div>
              {/* Investor ID */}
              <div className="mb-4">
                <label htmlFor="investorId" className="block text-gray-600 text-sm font-semibold mb-2">
                  Investor ID
                </label>
                <input
                  type="text"
                  id="investorId"
                  name="investorId"
                  value={formData.investorId}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
    
              {/* Name */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-600 text-sm font-semibold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
    
              {/* Mobile */}
              <div className="mb-4">
                <label htmlFor="mobile" className="block text-gray-600 text-sm font-semibold mb-2">
                  Mobile
                </label>
                <input
                  type="text"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
    
              {/* Email */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-600 text-sm font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
    
              {/* WhatsApp */}
              <div className="mb-4">
                <label htmlFor="whatsapp" className="block text-gray-600 text-sm font-semibold mb-2">
                  WhatsApp
                </label>
                <input
                  type="text"
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
    
             {/* Date of Birth */}
<div className="mb-4">
  <label htmlFor="dob" className="block text-gray-600 text-sm font-semibold mb-2">
    Date of Birth
  </label>
  <input
    type="date"
    id="dob"
    name="dob"
    value={formData.dob}
    onChange={handleChange}
    className="w-full p-2 border rounded-md"
    required
  />
</div>

{/* Date of Entry */}
<div className="mb-4">
  <label htmlFor="dateOfEntry" className="block text-gray-600 text-sm font-semibold mb-2">
    Date of Entry
  </label>
  <input
    type="date"
    id="dateOfEntry"
    name="dateOfEntry"
    value={formData.dateOfEntry}
    onChange={handleChange}
    className="w-full p-2 border rounded-md"
    required
  />
</div>

{/* DOA */}
<div className="mb-4">
  <label htmlFor="doa" className="block text-gray-600 text-sm font-semibold mb-2">
    DOA
  </label>
  <input
    type="date"
    id="doa"
    name="doa"
    value={formData.doa}
    onChange={handleChange}
    className="w-full p-2 border rounded-md"
    required
  />
</div>

            </div>
    
            {/* Column 2 */}
            <div>
              {/* State */}
              <div className="mb-4">
                <label htmlFor="state" className="block text-gray-600 text-sm font-semibold mb-2">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
    
              {/* City */}
              <div className="mb-4">
                <label htmlFor="city" className="block text-gray-600 text-sm font-semibold mb-2">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
    
              {/* District */}
              <div className="mb-4">
                <label htmlFor="district" className="block text-gray-600 text-sm font-semibold mb-2">
                  District
                </label>
                <input
                  type="text"
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
    
              {/* PIN */}
              <div className="mb-4">
                <label htmlFor="pin" className="block text-gray-600 text-sm font-semibold mb-2">
                  PIN
                </label>
                <input
                  type="text"
                  id="pin"
                  name="pin"
                  value={formData.pin}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
    
              {/* Referred By */}
              <div className="mb-4">
                <label htmlFor="referredBy" className="block text-gray-600 text-sm font-semibold mb-2">
                  Referred By
                </label>
                <input
                  type="text"
                  id="referredBy"
                  name="referredBy"
                  value={formData.referredBy}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
    
              {/* Reference ID */}
              <div className="mb-4">
                <label htmlFor="referenceId" className="block text-gray-600 text-sm font-semibold mb-2">
                  Reference ID
                </label>
                <input
                  type="text"
                  id="referenceId"
                  name="referenceId"
                  value={formData.referenceId}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
    
              {/* Can Introduce */}
              <div className="mb-4">
                <label htmlFor="canIntroduce" className="block text-gray-600 text-sm font-semibold mb-2">
                  Can Introduce
                </label>
                <input
                  type="checkbox"
                  id="canIntroduce"
                  name="canIntroduce"
                  checked={formData.canIntroduce}
                  onChange={handleChange}
                  className="mr-2"
                />
              </div>
            </div>
    
            {/* Submit button */}
            <div className="col-span-2 mt-4 flex justify-center items-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Submit
          </button>
        
        </div>
        {submitSuccess && (
        <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md">
          Form submitted successfully!
        </div>
      )}
      </form>

     
    </div>
  );
}