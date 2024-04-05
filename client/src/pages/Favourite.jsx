// FavoritesPage.js
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';


const NoFavoritesPage = () => {
  return (
    <div className="text-center mt-8">
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
      <h2 className="text-4xl font-bold text-red-500 mb-4 animate__animated animate__fadeInDown">
          Oops! No Favorites Found.
        </h2>
        <p className="text-lg text-gray-700 animate__animated animate__fadeIn">
          You haven't added any properties to your favorites yet.
        </p>
        {/* Additional message specific to no favorites */}
        <div className="bg-blue-500 text-white p-4 rounded-md shadow-md inline-block mt-4 animate__animated animate__fadeInUp">
          <p className="text-lg font-bold mb-2">What you can do:</p>
          <ul className="list-disc list-inside">
            <li>Explore our listings and add properties to your favorites.</li>
            <li>Contact us if you need assistance in finding your ideal property.</li>
          </ul>
        </div>
        {/* Additional personalized message with animation */}
        <div className="mt-8">
          <p className="text-gray-600 animate-bounce">
            🏡 Ready to find your dream home? Start exploring our listings now!
          </p>
        </div>
      </div>
    </div>
  );
};













  const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useSelector((state) => state.user);
  
    useEffect(() => {
      const userId = currentUser._id;
      const fetchFavorites = async () => {
        try {
          // Assuming you have an endpoint to fetch user favorites
          const res = await fetch(`/api/user/all/${userId}`);
          const data = await res.json();
          setFavorites(data.favorites);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching favorites:', error);
          setLoading(false);
        }
      };
  
      fetchFavorites();
    }, [currentUser._id]);
  
    if (loading) {
      return <p>Loading favorites...</p>;
    }
  
    if (favorites.length === 0) {
      return <NoFavoritesPage />;
    }
  
    return (
      <div className="bg-gray-100 min-h-screen">
        <div className="max-w-screen-xl mx-auto p-4">
          <h1 className="text-3xl font-extrabold mb-4 text-center animate-bounce text-purple-600 ">
            Welcome to Your Favorites! 🌟
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favorites.map((favorite) => (
              <div
                key={favorite.listingId}
                className="bg-white p-4 rounded-md shadow-md transform transition-transform hover:scale-105"
              >
                <img
                  src={favorite.image}
                  alt={favorite.title}
                  className="w-full h-32 object-cover mb-4 rounded-md"
                />
                <h5 className="text-lg font-semibold text-center mb-2">{favorite.title}</h5>
                <p className="text-black font-bold text-center capitalize">{favorite.type}</p>
                <p className="text-black text-center font-black">{favorite.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  

export default FavoritesPage;
