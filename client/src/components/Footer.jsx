// Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-5 mt-2">
      <div className="container mx-auto flex flex-wrap justify-between">
        <div className="w-full md:w-1/2 lg:w-1/3 mb-8">
          <h2 className="text-2xl font-bold mb-4">Company Name</h2>
          <p className="text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <div className="w-full md:w-1/2 lg:w-1/3 mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
          <ul className="list-none p-0">
            <li className="mb-2"><a href="/">Home</a></li>
            <li className="mb-2"><a href="/about">About Us</a></li>
            <li className="mb-2"><a href="/services">Services</a></li>
            <li className="mb-2"><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="w-full md:w-1/2 lg:w-1/3 mb-8">
          <h2 className="text-2xl font-bold mb-4">Connect With Us</h2>
          <div className="flex space-x-4">
            <a href="#" className="text-white hover:text-gray-400 transition duration-300">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="text-white hover:text-gray-400 transition duration-300">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-white hover:text-gray-400 transition duration-300">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" className="text-white hover:text-gray-400 transition duration-300">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-600 text-center">
        <p className="text-sm">&copy; 2024 Company Name. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
