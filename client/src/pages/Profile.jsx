import React, { useState } from 'react';
import AddProperty from './AddProperty';
import Property from './Property';
import FavoritesPage from './Favourite';
import { BookedPropertiesPage } from './BookedPropertiesPage';
import PersonalInfo from './PersonalInfo';
import PublishedData from './PublishedData';
import ReferralsPage from './Referals';

const LeftColumn = ({ setComponent }) => {
  const handleLinkClick = (component) => {
    setComponent(component);
  };

  return (
    <div className="w-40 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold p-4">Profile</h1>
      
      {/* Add navigation links */}
      <nav className="p-4">
        <ul className="flex flex-col divide-y divide-blue-600">
        <li className="hover:bg-gray-100">
            <button
              className="w-full p-4 text-left text-blue-500 hover:bg-gray-100 hover:text-blue-700"
              onClick={() => handleLinkClick(<PersonalInfo />)}
            >
              Personal Info
            </button>
          </li>
          <li className="hover:bg-gray-100">
            <button
              className="w-full p-4 text-left text-blue-500 hover:bg-gray-100 hover:text-blue-700"
              onClick={() => handleLinkClick(<AddProperty />)}
            >
              Sell
            </button>
          </li>
          <li className="hover:bg-gray-100">
            <button
              className="w-full p-4 text-left text-blue-500 hover:bg-gray-100 hover:text-blue-700"
              onClick={() => handleLinkClick(<Property />)}
            >
              Buy
            </button>
          </li>
          <li className="hover:bg-gray-100">
            <button
              className="w-full p-4 text-left text-blue-500 hover:bg-gray-100 hover:text-blue-700"
              onClick={() => handleLinkClick(<FavoritesPage />)}
            >
              Favorites
            </button>
          </li>
          <li className="hover:bg-gray-100">
            <button
              className="w-full p-4 text-left text-blue-500 hover:bg-gray-100 hover:text-blue-700"
              onClick={() => handleLinkClick(<BookedPropertiesPage />)}
            >
              Bookings
            </button>
          </li>
          <li className="hover:bg-gray-100">
            <button
              className="w-full p-4 text-left text-blue-500 hover:bg-gray-100 hover:text-blue-700"
              onClick={() => handleLinkClick(<PublishedData/>)}
            >
              All Published Property
            </button>
          </li>
          <li className="hover:bg-gray-100">
            <button
              className="w-full p-4 text-left text-blue-500 hover:bg-gray-100 hover:text-blue-700"
              onClick={() => handleLinkClick(<ReferralsPage/>)}
            >
              Referrals
            </button>
          </li>



        </ul>
      </nav>
    </div>
  );
};
const RightColumn = ({ component }) => {
  const rightColumnStyle = {
    flex: 1,
    overflow: 'auto ', // Change to 'auto' to show scrollbar if content overflows
    height: '100%',
  };

  return <div style={rightColumnStyle} className="flex-1 bg-white p-4">{component}</div>;
};


export default function Profile() {
  const [selectedComponent, setSelectedComponent] = useState(
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-500 to-pink-500">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4 animate__animated animate__fadeIn animate__delay-2s">
          Welcome to Our Awesome Website!
        </h1>
        <p className="text-lg animate__animated animate__fadeIn animate__delay-4s">
          Discover the best properties and book your dream home with us.
        </p>

        {/* Additional animated messages */}
        <div className="mt-8">
          <p className="text-gray-300 animate-pulse">
            🌟 Explore amazing features on our site!
          </p>
          <p className="text-gray-300 animate-pulse">
            🚀 Fast and secure booking experience awaits you!
          </p>
          <p className="text-gray-300 animate-bounce">
            🏡 Find your perfect home today!
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen">
      <LeftColumn setComponent={setSelectedComponent} />
      <div className="w-px bg-white"></div>
      <RightColumn component={selectedComponent} />
    </div>
  );
};
