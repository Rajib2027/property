// Import the correct hook from 'react-router-dom'
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { signOutFailure, signOutStart, signOutSuccess } from "../redux/user/userSlice";


export default function Header() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch();

 
  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess(data));
      handleRedirect("/sign-in");
    } catch (error) {
      dispatch(signOutFailure(data.message));
    }  
  };
  

  const handleRedirect = (path) => {
    navigate(path);
    setShowDropdown(false);
  };

  const handleProfileClick = () => {
    // Toggle the dropdown when clicking the profile picture
    setShowDropdown(!showDropdown);
  };

  const handleProfileLinkClick = () => {
    // Redirect to the appropriate profile page and close the dropdown
    handleRedirect(currentUser.role === "admin" ? "/admin-profile" : "/profile");
    setShowDropdown(false);
  };






  useEffect(() => {
    const unlisten = navigate(() => {
      setShowDropdown(false);
    });

    return unlisten;
  }, [navigate]);

  return (
    <header className="bg-gradient-to-r from-pink-500 to-purple-500">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-xl text-white flex flex-wrap">
            <span className="text-yellow-300">COMPANY</span>
            <span className="text-blue-300">NAME</span>
          </h1>
        </Link>
        <ul className="flex gap-4 font-sans font-semibold">
          <Link to="/about">
            <li
              className="hidden sm:inline text-white hover:text-yellow-300"
              onClick={() => handleRedirect("/about")}
            >
              About
            </li>
          </Link>


          <Link to="/properties">
            <li
              className="hidden sm:inline text-white hover:text-yellow-300"
              onClick={() => handleRedirect("/properties")}
            >
              Properties
            </li>
          </Link>


          <li className="sm:inline relative group">
            <div
              onClick={handleProfileClick}
              className="cursor-pointer flex items-center group-hover:text-yellow-300"
            >
              {currentUser ? (
                <img
                  className="rounded-full h-10 w-10 object-cover border-2 border-white transition-all transform group-hover:scale-110"
                  src={currentUser.avatar}
                  alt="profile"
                />
              ) : (
                <Link to="/sign-in">
                <span className="text-white hover:text-yellow-300 transition-all transform group-hover:scale-110">
                  Sign In
                </span>
                </Link>
              )}
            </div>
            {currentUser && showDropdown && (
              <div className="absolute right-0 mt-2 bg-white shadow-md rounded-md p-2 transition-all transform origin-top z-10 animate-fadeIn scale-110">
              <div
                onClick={handleProfileLinkClick}
                className="text-blue-500 hover:text-blue-700 cursor-pointer py-2 px-4 block transition-colors duration-300"
              >
                {currentUser.role === "admin" ? "Admin" : "Profile"}
              </div>
              <div
                onClick={handleSignOut}
                className="text-red-500 inline-grid hover:text-blue-500 cursor-pointer py-2 px-4  transition-colors duration-300"
              >
                <span>SignOut</span>
              </div>
            </div>
            )}
          </li>  
        </ul>
      </div>
    </header>
  );
}  