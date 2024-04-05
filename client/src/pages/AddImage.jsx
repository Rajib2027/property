import React, { useState } from 'react';
import axios from 'axios';
export default function AddImage() {
    const [urls, setUrls] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
  
    const handleAddImages = async () => {
      try {
        setIsLoading(true);
  
        const response = await axios.post('/api/property/addImage', { urls: urls.split('\n') });
        console.log(response.data);
  
        // Display success message
        setSuccessMessage('Images added successfully');
  
        // Reset the textarea
        setUrls('');
      } catch (error) {
        console.error('Error adding images:', error);
        setErrorMessage('Error adding images. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className="container mx-auto my-8">
        <h1 className="text-2xl font-bold mb-4">Add Images</h1>
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <textarea
          className="w-full h-40 p-2 border rounded-md mb-4"
          placeholder="Enter image URLs (one per line)"
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={handleAddImages}
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? 'Adding Images...' : 'Add Images'}
        </button>
        {isLoading && (
          <div className="mt-4">
            <p>Loading...</p>
          </div>
        )}
      </div>
    );
  };