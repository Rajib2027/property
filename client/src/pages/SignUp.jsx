import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { FaLessThanEqual } from 'react-icons/fa';
import { app } from '../firebase';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";


const auth = getAuth(app);




export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEmailEntered, setIsEmailEntered] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpSentSuccess, setOtpSentSuccess] = useState(false);
  const [otp, setOtp] = useState('');
  const [phone,setPhone]= useState('')
  const [verifyButtonVisible, setVerifyButtonVisible] = useState(false);
  const [otpInputVisible, setOtpInputVisible] = useState(false);
  const [mobile, setMobile] = useState('');
  const [verifyotp, setVerifyOtp] = useState(FaLessThanEqual);
  const [verified, setVerified] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const navigate = useNavigate();





  // const onCaptchaVerify = () => {
  //   window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
  //     'size': 'invisible',
  //     'callback': (response) => {
  //       onSignInSubmit();
  //     },
  //   }, auth);
  // };


  // const onSignInSubmit = () => {
  //   setLoading(true); 
  //   onCaptchaVerify();
  //   const phoneNumber = "+91" + mobile;
  //   const appVerifier = window.recaptchaVerifier;
    
  //   signInWithPhoneNumber(auth, phoneNumber, appVerifier)
  //     .then((confirmationResult) => {
  //       window.confirmationResult = confirmationResult;
  //       alert('OTP Sent');
  //       setOtpInputVisible(true);
  //     })
  //     .catch((error) => {
  //       if (error.code === 'auth/too-many-requests') {
  //         alert('Too many unsuccessful attempts. Please try again later.');
  //         // You can also disable the UI or take other actions here
  //       } else {
  //         // alert('Error sending OTP');
  //         console.error(error);
  //       }
  //     }) .finally(() => {
  //       setLoading(false); // Set loading to false after the verification process completes
  //     });
  // };
  

  // const verifyCode = () => {
  //   window.confirmationResult.confirm(otp).then((result) => {
  //     alert('Verification done');
  //     setOtpVerified(true);
  //     // ... handle successful verification
  //   }).catch((error) => {
  //     alert('Invalid OTP');
  //     setOtpVerified(false);
  //   });
  // };

  // const changeMobile = (e) => {
  //   setErrors({
  //     ...errors,
  //     [e.target.id]: '',
  //   });
  //   setMobile(e.target.value);
  //   if (e.target.value.length === 10) {
  //     setVerifyButtonVisible(true);
  //   } else {
  //     setVerifyButtonVisible(false);
  //     setOtpInputVisible(false);
  //   }
  // };

  // const handleOtpChange = (e) => {
  //   setOtp(e.target.value);
  // };


  const handleChange = (e) => {
    // Clear error message for the current field
    setErrors({
      ...errors,
      [e.target.id]: '',
    });
  
    // Update form data
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });


    if (e.target.id === 'email' && e.target.value.trim() !== '') {
      setIsEmailEntered(true);
    } else {
      setIsEmailEntered(false);
    }
  };
  const handleSendOTP = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/user/userOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
  
      if (data.code === 200) {
        setOtpSent(true); // Set otpSent to true only on successful OTP sending
      } else if (data.code === 400 && data.message === "User email already present") {
        alert("User email already exists. Please try with a different email.");
      } else if (data.code === 400) {
        setError(data.message); // Set error message received from the server
      } else {
        setError('Failed to send OTP');
      }
    } catch (error) {
      setError('Internal Server Error');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
  
      const emailKey = formData.email.replace(/\./g, '_'); // Replace dots with underscores
  
      const requestBody = {
        [emailKey]: otp,
      };
  
      const res = await fetch('/api/user/verifyOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!res.ok) {
        throw new Error(`Failed to verify OTP: ${res.statusText}`);
      }
  
      const data = await res.json();
  
      if (data.success) {
        setOtpSentSuccess(true);
        console.log('OTP Verified successfully');
      } else {
        throw new Error(`Failed to verify OTP: ${data.message}`);
      }
    } catch (error) {
      setError(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };











  const validateForm = () => {
    let errors = {};
    let isValid = true;

    // Validate username
    if (!formData.username) {
      errors.username = 'Username is required';
      isValid = false;
    }

    // Validate email
    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    // Validate password
    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
      isValid = false;
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirm Password is required';
      isValid = false;
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    if (!formData.mobile) {
      errors.mobile = 'Mobile number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      errors.mobile = 'Mobile number must be 10 digits';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };
















  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      if (!otpSentSuccess) {
        alert('Please verify your email before signing up.');
        return;
      }
  
      try {
        setLoading(true);
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
  
        if (data.success === false) {
          setLoading(false);
          setError(data.message);
          return;
        }
  
        setLoading(false);
        setError(null);
        navigate('/sign-in');
      } catch (error) {
        setLoading(false);
        setError(error.message);
      }
    }
  };
   
  
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="p-6 max-w-5xl mx-auto mt-5 mb-5 bg-white rounded-lg shadow-md font-mono">
      <h1 className="text-2xl  font-semibold font-serif my-7 text-center">Begin Your Journey</h1>

        <div id='recaptcha-container'></div>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <input
              type="text"
              placeholder="Username"
              className="border p-3 rounded-lg w-full"
              id="username"
              autoComplete="username"
              onChange={handleChange}
            />
              {errors.username && <span className='text-red-700 font-semibold'>{errors.username}</span>}
          </div>
          <div className="col-span-2">
          <input
            type="email"
            placeholder="Email"
            className="border p-3 rounded-lg w-full"
            id="email"
            autoComplete="email"
            onChange={handleChange}
            required
          />
          {errors.email && <span className='text-red-700 font-semibold'>{errors.email}</span>}
        </div>
        <div className="col-span-2">
          {isEmailEntered && !otpSent && (
            <button
              disabled={loading}
              onClick={handleSendOTP}
              className="bg-blue-500 font-serif font-bold text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 w-full"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          )}

          {otpSent && !otpSentSuccess && (
            <>
              <div className="col-span-2">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="border p-3 rounded-lg w-full"
                  id="otp"
                  autoComplete="off"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <div className="col-span-2">
                <button
                  disabled={loading}
                  onClick={handleVerifyOTP}
                  className="bg-green-500  font-serif font-bold text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 w-full"
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </>
          )}
                 
{otpSentSuccess && (
  <div className="col-span-2 font-serif font-bold">
    <button 
     style={{ backgroundColor: "#0163d2", width: "100%", padding: "8", color: "white", border: "none" }}
      disabled
    >
      Verified
    </button>
  </div>
)}

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
              {errors.password && <span className='text-red-700 font-semibold'>{errors.password}</span>}
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              className="border p-3 rounded-lg w-full"
              id="confirmPassword"
              autoComplete="password"
              onChange={handleChange}
            />
              {errors.confirmPassword && <span className='text-red-700 font-semibold'>{errors.confirmPassword}</span>}
          </div>
          <div className="col-span-2">
          <input
  type="tel"
 
  placeholder="Mobile"
  id="mobile"
 
  onChange={handleChange}
  className="border p-3 rounded-lg w-full"
/> 
{errors.mobile && <span className='text-red-700 font-semibold'>{errors.mobile}</span>}

{/* 
{verifyButtonVisible && (
              <input
              type="button"
              value={loading ? "Verifying..." : (verified || otpVerified ? "Verified" : "Verify")}
              className="bg-blue-500 font-serif font-bold text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 w-full"
              onClick={(e) => { e.preventDefault(); onSignInSubmit(); }}
              disabled={loading}
            />
            )} 
            {otpInputVisible && !otpVerified && (
              <div>
                <label htmlFor='otp' className='block text-sm font-medium text-gray-700'>
                  OTP
                </label>
                <input
                  type='number'
                  placeholder='Enter OTP'
                  className='border p-3 rounded-lg w-full'
                  id='otp'
                  onChange={handleOtpChange}
                />
                <input
                  type="button"
                  onClick={(e) => { e.preventDefault(); verifyCode(); }}
                  value="Verify"
                  className="bg-blue-500 font-serif font-bold text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 w-full"
                />
              </div>
            )} */}

          </div> 

          <button disabled={loading} className="col-span-2 bg-slate-700 font-serif font-bold text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 w-full">
            {loading ? 'Loading...' :  'Sign Up'}

          </button>
        </form>

       <div className="flex gap-2 mt-5 font-mono font-semibold">
          <p>Have an account?</p>
          <Link to="/sign-in">
            <span className="text-blue-700 font-sans font-bold">Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
