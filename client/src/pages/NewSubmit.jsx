import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';


export default function NewSubmit() {
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // State for loading effect
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [confirmPassword, setConfirmPassword] = useState('');















  
  const validateForm = () => {
    let errors = {};
    let isValid = true;
  
    // Validate password
    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 8 || password.length > 16) {
      errors.password = 'Password must be between 8 and 16 characters long';
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}/.test(password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one special character, and one number and must be between 8 and 16 characters';
      isValid = false;
    }
  
    // Validate confirm password
    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm Password is required';
      isValid = false;
    } else if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
  
    setErrors(errors);
    return isValid;
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
    setLoading(true); // Start loading effect

    axios.post('/api/user/submitOtp', {
      otp: otp,
      password: password
    }).then(res => {
      console.log(res.data);
      if (res.data.code === 200) {
        navigate('/sign-in');
      }
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      setLoading(false); // Stop loading effect
    });
  }}

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-100 font-mono rounded-md shadow-lg">
      <input
        onChange={(e) => { setOtp(e.target.value) }}
        value={otp}
        type="text"
        placeholder="Enter OTP"
        className="w-full px-4 py-2 mb-4 border font-mono  rounded-md focus:outline-none focus:border-blue-300 bg-white text-gray-800"
      />

      <input
        onChange={(e) => { setPassword(e.target.value) }}
        value={password}
        type="password"
        placeholder="New Password"
        className="w-full px-4 py-2 mb-4 border font-mono rounded-md focus:outline-none focus:border-blue-300 bg-white text-gray-800"
      />
       {errors.password && <span className="text-red-700 font-semibold">{errors.password}</span>}
       <input
  onChange={(e) => { setConfirmPassword(e.target.value) }}
  value={confirmPassword}
  type="password"
  placeholder="Confirm Password"
  className="w-full px-4 py-2 mb-6 border font-mono rounded-md focus:outline-none focus:border-blue-300 bg-white text-gray-800"
/>

       {errors.confirmPassword && <span className="text-red-700 font-semibold">{errors.confirmPassword}</span>}
      <button
        onClick={handleSubmit}
        className={`w-full py-3 bg-blue-600 font-serif font-bold text-white hover:bg-blue-700 focus:outline-none rounded-md transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} // Disable button and change cursor when loading
        disabled={loading} // Disable button when loading
      >
        {loading ? 'CHANGING...' : 'CHANGE PASSWORD'} {/* Change button text when loading */}
      </button>
    </div>
  );
}
