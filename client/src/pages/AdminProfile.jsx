import React, { useState } from 'react';
import AddProperty from './AddProperty';
import Property from './Property';
import FavoritesPage from './Favourite';
import { BookedPropertiesPage } from './BookedPropertiesPage';
import ApprovalPage from './ApprovalPage';
import ApprovedPages from './ApprovedPages';
import InvestorForm from './InvestorForm';
import SeekInvestment from './SeekInvestment';
import ShowAllInvestor from './ShowAllInvestor';
import ShowDraft from './ShowDraft';
import InvestmentData from './InvestmentData';
import ProjectAddingPage from './ProjectAddingPage';
import AllProjects from './AllProjects';
import InvestorList from './InvestorList';
import ViewReferalls from './ViewReferalls';

const LeftColumn = ({ setComponent }) => {
  const handleLinkClick = (component) => {
    setComponent(component);
  };

  return (
    <div className="w-40 bg-gray-200 overflow-y-auto">
      <h1 className=" font-serif font-bold p-4 text-center">ADMIN</h1>
      
      {/* Add navigation links */}
      <nav className="p-4">
        <ul className="space-y-4 font-mono">
         
          <li className="  border  border-red-500 rounded-lg p-4 py-2">
            <button className="text-blue-500 hover:text-blue-700" onClick={() => handleLinkClick(<AddProperty/>)}>Add Property</button>
          </li>
         
          <li className="  border  border-red-500 rounded-lg p-4 py-2">
            <button className="text-blue-500 hover:text-blue-700" onClick={() => handleLinkClick(<ProjectAddingPage/>)}>Add Project</button>
          </li>
          <li className="  border  border-red-500 rounded-lg p-4 py-2">
            <button className="text-blue-500 hover:text-blue-700" onClick={() => handleLinkClick(<Property />)}>Listed Properties</button>
          </li>
          <li className="  border  border-red-500 rounded-lg p-4 py-2">
            <button className="text-blue-500 hover:text-blue-700" onClick={() => handleLinkClick(<AllProjects/>)}>Listed Projects</button>
          </li>
          <li className="  border  border-red-500 rounded-lg p-4 py-2">
            <button className="text-blue-500 hover:text-blue-700" onClick={() => handleLinkClick(<ApprovalPage />)}>Approval Pending</button>
          </li>
          <li className="  border  border-red-500 rounded-lg p-4 py-2">
            <button className="text-blue-500 hover:text-blue-700" onClick={() => handleLinkClick(<ApprovedPages />)}>Approved Properties</button>
          </li>
          <li className="  border  border-red-500 rounded-lg p-4 py-2">
            <button className="text-blue-500 hover:text-blue-700" onClick={() => handleLinkClick(<InvestorForm/>)}>Add Investor</button>
          </li>
          <li className="  border  border-red-500 rounded-lg p-4 py-2">
            <button className="text-blue-500 hover:text-blue-700" onClick={() => handleLinkClick(<SeekInvestment/>)}>Seek Investment</button>
          </li>
          <li className="  border  border-red-500 rounded-lg p-4 py-2">
            <button className="text-blue-500 hover:text-blue-700" onClick={() => handleLinkClick(<InvestorList/>)}>All Investment</button>
          </li>
          
          <li className="  border  border-red-500 rounded-lg p-4 py-2">
            <button className="text-blue-500 hover:text-blue-700" onClick={() => handleLinkClick(<ShowAllInvestor/>)}>Investor List</button>
          </li>
          <li className="  border  border-red-500 rounded-lg p-4 py-2">
            <button className="text-blue-500 hover:text-blue-700" onClick={() => handleLinkClick(<ShowDraft/>)}>Investment Draft</button>
          </li>
          <li className="  border  border-red-500 rounded-lg p-4 py-2">
            <button className="text-blue-500 hover:text-blue-700" onClick={() => handleLinkClick(<InvestmentData/>)}>Publish Investment</button>
          </li>
          
          <li className="  border  border-red-500 rounded-lg p-4 py-2">
            <button className="text-blue-500 hover:text-blue-700" onClick={() => handleLinkClick(<ViewReferalls/>)}>Referal List</button>
          </li>



        </ul>
      </nav>
    </div>
  );
  }  

const RightColumn = ({ component }) => {
  const rightColumnStyle = {
    flex: 1,
    overflow: 'auto ', // Change to 'auto' to show scrollbar if content overflows
    height: '100%',
  };

  return <div style={rightColumnStyle} className="flex-1 bg-white p-4">{component}</div>;
};


export default function AdminProfile() {
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
          <LeftColumn setComponent={setSelectedComponent}  />
          <div className="w-px bg-white"></div>
          <RightColumn component={selectedComponent} />
        </div>
      );
    };
    