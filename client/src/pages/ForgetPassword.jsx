
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); // State for loading effect
  const [error, setError] = useState(''); // State for error message
  const navigate = useNavigate();

  
  const handleSubmit = () => {
    setLoading(true); // Start loading effect
    setError(''); // Reset error message

    axios.post('/api/user/sendOtp', {
      email: email
    }).then(res => {
      console.log(res.data)
      if (res.data.code === 200) {
        navigate('/password-otp')
      }
    }).catch(err => {
      console.log(err);
      if (err.response && err.response.status === 404) {
        setError('User not found');
      } else {
        setError('Failed to send OTP');
      }
    }).finally(() => {
      setLoading(false); // Stop loading effect
    });
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-100 fomt-mono rounded-md shadow-lg">
      <h2 className="text-3xl font-extrabold font-serif mb-6">Lost Your Password?</h2>
      <p className="font-mono mb-8">Enter your email to receive a One-Time Password (OTP).</p>
      <input
        type="text"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        value={email}
        placeholder="Email"
        className="w-full font-mono px-4 py-2 mb-4 border rounded-md focus:outline-none focus:border-blue-300 bg-white text-gray-800"
      />
      {error && <p className="text-red-500 font-sans font-bold text-center">{error}</p>} {/* Display error message */}
      <button
        onClick={handleSubmit}
        className={`w-full py-3 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none rounded-md font-serif font-bold transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} // Disable button and change cursor when loading
        disabled={loading} // Disable button when loading
      >
        {loading ? 'SENDING...' : 'SEND OTP'} {/* Change button text when loading */}
      </button>
    </div>
  );
}
