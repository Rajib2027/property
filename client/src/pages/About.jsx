import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';
import { FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function About() {
  return (
    <div className="bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8">About Us</h2>
        <div className="flex flex-col md:flex-row items-center mb-12">
          <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">Welcome to [Your Company Name], your premier destination for finding the perfect property. Our dedicated team of real estate professionals is committed to providing exceptional service and guiding you through every step of your real estate journey.</p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">With years of experience in the local market, we have the knowledge and expertise to help you navigate the complexities of buying, selling, or renting properties. Our mission is to make your real estate experience seamless and enjoyable.</p>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">Whether you're a first-time homebuyer, seasoned investor, or looking to sell your property, we're here to assist you with personalized solutions tailored to your needs.</p>
            <div className="border-t border-gray-300 pt-4">
              <h3 className="text-xl font-semibold mb-4">Why Choose Us?</h3>
              <ul className="list-disc list-inside text-gray-700">
                <li>Expert guidance throughout the entire real estate process</li>
                <li>Personalized service tailored to your needs</li>
                <li>In-depth knowledge of the local market</li>
                <li>Transparent communication and integrity</li>
                <li>Proven track record of successful transactions</li>
              </ul>
            </div>
          </div>
          <div className="md:w-1/2 mb-40">
            <img className="rounded-lg shadow-lg w-full h-full " src="data:image/png;base64,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" alt="About Us" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Team</h3>
          <div className="flex flex-wrap -mx-4">
            {/* Team Member Cards */}
            {/* Replace with actual team member data */}
            <div className="flex flex-wrap -mx-4">
  <div className="w-full sm:w-1/2 lg:w-1/3 px-4 mb-8">
    <div className="bg-gray-200 rounded-lg p-6">
      <img
        className="w-full h-auto rounded-full mb-4"
        src="data:image/jpeg;base64,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"
        alt="Team Member"
      />
      <h4 className="text-xl font-semibold mb-2">Al</h4>
      <p className="text-gray-700 mb-4">Owner</p>
      <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      <div className="mt-4 flex justify-center gap-4">
      <a href="#" className="text-blue-500 hover:text-blue-700 mr-4">
        <FaLinkedin size={20} />
      </a>
      <a href="#" className="text-blue-500 hover:text-blue-700">
        <FaTwitter size={20} />
      </a>
      <a href="#" className="text-blue-500 hover:text-blue-700">
        <FaInstagram size={20} />
      </a>
      </div>
    </div>
  </div>
  <div className="w-full sm:w-1/2 lg:w-1/3 px-4 mb-8">
    {/* Repeat the same structure for other team members */}
  </div>
</div>

            {/* Repeat for other team members */}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Client Testimonials</h3>
          <div className="flex items-center mb-6">
            <FaQuoteLeft className="text-3xl text-gray-600 mr-4" />
            <p className="text-lg text-gray-700 leading-relaxed">Working with [Your Company Name] was an absolute pleasure. They helped us find the perfect home within our budget and guided us through the entire process with professionalism and expertise.</p>
          </div>
          {/* Add more testimonials */}
        </div>
      </div>
    </div>
  );
}

