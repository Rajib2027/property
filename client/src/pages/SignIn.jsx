import { useState } from "react";
import { Link , useNavigate } from "react-router-dom";
import {  useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";




export default function SignIn() {

const [formData, setFormData] = useState({});
const [errors, setErrors] = useState({});
const {loading, error} = useSelector((state)=>state.user);
const navigate = useNavigate();
const dispatch = useDispatch();
 // Update your handleChange function
const handleChange = (e) => {
  setErrors({
    ...errors,
    [e.target.id]: '',
  });
  setFormData({
    ...formData,
    [e.target.id]: e.target.value,
  });
};


  const handleSubmit = async  (e)=>{
    e.preventDefault();
    if (validateForm()) {
    try {
      dispatch(signInStart());
      const res = await fetch ('/api/auth/signin',{
        method: 'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data)
      if (data.success === false) {
        dispatch(signInFailure(data.message));
          
          return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  }
    
  };






  const validateForm = () => {
    let errors = {};
    let isValid = true;

    // Validate email
    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    // Validate password
    // if (!formData.password) {
    //   errors.password = 'Password is required';
    //   isValid = false;
    // } else if (formData.password.length < 8 || formData.password.length > 16) {
    //   errors.password = 'Password must be between 8 and 16 characters long';
    //   isValid = false;
    // } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}/.test(formData.password)) {
    //   errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one special character, and one number and  must be between 8 and 16 characters';
    //   isValid = false;
    // }
    

   

    setErrors(errors);
    return isValid;
  };








  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <div className="p-6 max-w-lg w-full mx-auto bg-white rounded-lg shadow-md">
        <h1 className="text-2xl text-center font-semibold font-serif my-7">Let's Get Started</h1>
  
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 font-mono">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="border p-3 rounded-lg w-full"
              id="email"
              autoComplete="email"
              onChange={handleChange}
            />
            {errors.email && <span className="text-red-700 font-semibold">{errors.email}</span>}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="border p-3 rounded-lg w-full"
              id="password"
              autoComplete="password"
              onChange={handleChange}
            />
            {errors.password && <span className="text-red-700 font-semibold">{errors.password}</span>}
          </div>
          <button disabled={loading} className="bg-slate-700 text-white p-3 font-bold font-sans rounded-lg uppercase hover:opacity-95 disabled:opacity-80 w-full">
            {loading ? 'Loading....' : 'Sign In'}
          </button>
          <OAuth />
        </form>
  
      

        <div className="flex flex-col md:flex-row items-center justify-center mt-5 font-mono font-semibold">
          <p className="mb-2 md:mb-0 md:mr-2">Don't Have an account?</p>
          <Link to="/sign-up">
            <span className="text-blue-700 font-sans font-bold">Sign Up</span>
          </Link>
        </div>
  
        <div className="text-center mt-2">
          <Link to="/forget-password">
            <span className="text-blue-700 font-sans font-bold">Forget Password?</span>
          </Link>
        </div>
      </div>
      {error && <p className="text-red-500 mt-3">{error}</p>}
    </div>
  );
  
  
  }  