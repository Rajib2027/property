import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
  FaMountain,
  FaSchool,
  FaShieldAlt,
  FaBus,
  FaPlug,
  FaShoppingCart,
  FaHandshake,
  FaTools,
  FaChartBar,
  FaRoad,
  FaBuilding,
  FaExpand,
  FaUtensils,
} from "react-icons/fa";
import "swiper/css/bundle";
import Map from "../components/Map";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [expandedIndexes, setExpandedIndexes] = useState([]);
  const [hiddenExpandIndex, setHiddenExpandIndex] = useState(null);

  const [initialFormData, setInitialFormData] = useState({
    name: "",
    email: "",
    number: "",
    message: "",
  });
  const [contactFormData, setContactFormData] = useState(initialFormData);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [propertyBooked, setPropertyBooked] = useState(false);

  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const isIndexExpanded = (index) => expandedIndexes.includes(index);
  const isHiddenExpandIndex = (index) => hiddenExpandIndex === index;

  const toggleExpand = (index) => {
    setExpandedIndexes((prevIndexes) =>
      isIndexExpanded(index) ? prevIndexes.filter((i) => i !== index) : [...prevIndexes, index]
    );
    setHiddenExpandIndex(null);
  };

  const toggleHideExpand = (index) => {
    setHiddenExpandIndex((prevIndex) => (isHiddenExpandIndex(index) ? null : index));
  };





  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);

        // Fetch property details
        const res = await fetch(`/api/property/get/${params.listingId}`);
        const data = await res.json();

        console.log("Fetch listing data:", data);

        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }

        setListing(data);
        setLoading(false);
        setError(false);

        // Fetch the booked properties for the current user if logged in
        if (currentUser) {
          const bookingStatusRes = await fetch(
            `/api/property/getBookedProperty/${currentUser._id}`
          );
          const bookingStatusData = await bookingStatusRes.json();

          console.log("Booking status data:", bookingStatusData);
           
          // Check if the current listing ID matches any of the booked property IDs
          const isPropertyBooked =
            bookingStatusData.success &&
            bookingStatusData.bookedProperties.some(
              (bookedProperty) => bookedProperty.id === params.listingId
            );

          // Set propertyBooked based on the fetched status
          setPropertyBooked(isPropertyBooked);
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
        setError(true);
        setLoading(false);
      }
    };

    // Fetch property details
    fetchListing();
  }, [params.listingId, currentUser]);

  const addToFavourite = async () => {
    // Check if the user is not logged in, redirect to sign-in page
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }

    try {
      // Add logic to add property to favorites
      const res = await fetch("/api/user/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser._id,
          listingId: listing._id,
        }),
      });

      const data = await res.json();

      if (data.message === "Listing is already in favorites") {
        alert("Listing is already in favorites");
      } else {
        console.log("Added to favorites successfully");
        // Optionally provide feedback to the user (e.g., toast, alert, etc.)
        alert("Added to favorites successfully");
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  const handleContactInputChange = (e) => {
    const { name, value } = e.target;
    setContactFormData({ ...contactFormData, [name]: value });
  };

  const handleShowContact = () => {
    setShowContact(true);
  };

  const handleBookPropertyClick = async () => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }
    try {
      setSendingEmail(true);

      // Add logic to send email and book the property
      const res = await fetch("/api/user/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData: contactFormData,
          listingId: params.listingId,
        }),
      });

      const data = await res.json();

      if (data.success) {
        console.log("Email sent successfully");
        alert("Email sent successfully");

        // Add the property to bookedProperties
        await fetch("/api/property/bookProperty", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser._id,
            listingId: params.listingId,
          }),
        });

        // Set propertyBooked to true
        setPropertyBooked(true);

        // Persist propertyBooked state in localStorage
        localStorage.setItem("propertyBooked", "true");

        resetForm();
      } else {
        console.error("Error sending email:", data.message);
        alert("Error sending email. Please try again later.");
      }

      setSendingEmail(false);
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Error sending email. Please try again later.");
      setSendingEmail(false);
    }
  };

  const resetForm = () => {
    setContactFormData(initialFormData);
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const featuresArray = listing && listing.features ? listing.features.split(',').map(feature => feature.trim()) : [];
const hasFeatures = featuresArray && featuresArray.length > 0;


function getStatusColor(status) {
  switch (status) {
      case 'Booked':
          return 'bg-orange-200'; // Orange color for booked
      case 'Available':
          return 'bg-green-200'; // Green color for available
      case 'SoldOut':
          return 'bg-red-200'; // Red color for soldout
      default:
          return ''; // Default color
  }
}




  return (
    <main className="container mx-auto p-4">
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl text-red-500">
          Something went wrong!
        </p>
      )}

      {listing && !loading && !error && (
      <div className="flex flex-col min-h-screen w-full  mx-auto p-3 my-7 gap-4  bg-white  rounded-lg shadow-md overflow-hidden">
          {/* <h1 className="text-3xl font-extrabold mb-4 text-center animate-pulse text-gray-600  font-sans">
            Welcome to Your Property 🏡
          </h1> */}
          <div className="">
  {/* Left Column - Property Image */}
  <div className="">
    {/* Your existing image code here */}
          <Swiper navigation>
            <SwiperSlide>
              <div
                style={{
                  backgroundImage: `url(${listing.imgUrls})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  height: "400px",
                  width: "100%",
                  border: "2px solid #D8BFD8", // Light purple border color
                  borderRadius: "10px", // 10px border radius for rounded corners
                }}
              ></div>
            </SwiperSlide>
          </Swiper>
          {/* Left Column - Property Details */}
        
          </div>

{/* Right Column - Property Details */}
<div className=" ml-4">
          <div className="">
            <div className="mb-4">
              <div className="mt-4">
              
<p class="text-slate-700 font-semibold text-center text-4xl font-serif">
  {listing.title || listing.propertyName}
</p>


<p class="font-bold text-slate-700 text-center text-3xl capitalize mt-2 font-sans">
  {listing.type || listing.propertyType}
</p>

                <ul className="mt-2 font-semibold text-center text-slate-700 text-3xl font-mono">
  <li>
    {listing.price != null ? (
      <>
        <span>PRICE:</span>
        <span>&#8377;{listing.price}</span>
      </>
    ) : listing.minBookingAmount != null ? (
      <>
        <span>Minimum Booking Amount:</span>
        <span>&#8377;{listing.minBookingAmount}</span>
      </>
    ) : (
      <span>No price information available</span>
    )}
  </li>
</ul>

              </div>
              </div>
  </div>
  

  <div>
  <table className="min-w-full bg-white border border-gray-300 rounded-lg font-mono">
    <thead className="bg-gray-200">
      <tr className="border border-black bg-gray-200">
        <th className="border border-gray-300 px-2 py-2">State</th>
        <th className="border border-gray-300 px-2 py-2">City</th>
        <th className="border border-gray-300 px-2 py-2">District</th>
        <th className="border border-gray-300 px-2 py-2">Pin</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border border-black bg-gray-100 text-center">
        <td className="border border-gray-300 px-2 py-2">{listing.state}</td>
        <td className="border border-gray-300 px-2 py-2">{listing.city}</td>
        <td className="border border-gray-300 px-2 py-2">{listing.district}</td>
        <td className="border border-gray-300 px-2 py-2">{listing.pin}</td>
      </tr>
    </tbody>
  </table>

  {listing.sqrfeet || listing.sqrmeter || listing.decimil ? (
   <div className="overflow-x-auto">
   <table className="mt-4 min-w-full bg-white border border-gray-300 rounded-lg font-mono">
     <thead className="bg-gray-200">
       <tr className="border border-black bg-gray-200">
         <th className="border border-gray-300 px-4 py-2" colSpan="1" rowSpan="2">
           Size
         </th>
         <th className="border border-gray-300 px-4 py-2">SqrFeet</th>
         <th className="border border-gray-300 px-4 py-2">SqrMeter</th>
         <th className="border border-gray-300 px-4 py-2">Decimil</th>
       </tr>
       <tr className="border border-black bg-gray-100 text-center">
         <td className="border border-gray-300 px-4 py-2">{listing.sqrfeet}</td>
         <td className="border border-gray-300 px-4 py-2">{listing.sqrmeter}</td>
         <td className="border border-gray-300 px-4 py-2">{listing.decimil}</td>
       </tr>
     </thead>
   </table>
 </div>
  
 
  ) : null}
</div>
<div className="mx-auto my-2 overflow-x-auto">
      {listing.additionalFields && listing.additionalFields.length > 0 && (
        <table className="min-w-full bg-white border border-gray-300 rounded-lg font-mono">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Type</th>
              <th className="border border-gray-300 px-4 py-2">Category</th>
              <th className="border border-gray-300 px-4 py-2">Land Size</th>
              <th className="border border-gray-300 px-4 py-2">Super Built Up</th>
              <th className="border border-gray-300 px-4 py-2">Built Up</th>
              <th className="border border-gray-300 px-4 py-2">Carpet Area</th>
              <th className="border border-gray-300 px-4 py-2">Units</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listing.additionalFields.map((field, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">{field.type}</td>
                  <td className="border border-gray-300 px-4 py-2">{field.category}</td>
                  <td className="border border-gray-300 px-4 py-2">{field.size}</td>
                  <td className="border border-gray-300 px-4 py-2">{field.superbuiltup}</td>
                  <td className="border border-gray-300 px-4 py-2">{field.builtup}</td>
                  <td className="border border-gray-300 px-4 py-2">{field.carpetarea}</td>
                  <td className="border border-gray-300 px-4 py-2">{field.units}</td>
                  <td className="border border-gray-300 px-4 py-2">{field.price}</td>
                  <td className="border border-gray-300 px-4 py-2">{field.status} { // Ratio calculation
    field.subtypes.some(subtype => subtype.status === 'SoldOut')
      ? (field.units - field.subtypes.reduce((acc, cur) => acc + (cur.status === 'SoldOut' ? 1 : 0), 0)) + '/' + field.units
      : field.subtypes.reduce((acc, cur) => acc + (cur.status === 'Available' ? 1 : 0), 0) + '/' + field.units
  }</td>
                 



           
                  <td className="border border-gray-300 px-4 py-2">
                    {field.subtypes && field.subtypes.length > 0 && (
                      <div>
                        <span
                          onClick={() => toggleExpand(index)}
                          style={{ cursor: 'pointer' }}
                        >
                          {isIndexExpanded(index) ? 'v Hide' : '^ Expand'}
                        </span>
                        {isIndexExpanded(index) && !isHiddenExpandIndex(index) && (
                          <button onClick={() => toggleHideExpand(index)}> </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
                {isIndexExpanded(index) && !isHiddenExpandIndex(index) && (
                  field.subtypes.map((subtype, subIndex) => (
                    <tr key={`${index}-${subIndex}`} className={subIndex % 2 === 0 ? 'bg-gray-100' : ''}>
                    <td className={`border border-gray-300 px-4 py-2 ${getStatusColor(subtype.status)}`}>{subtype.type}</td>
                    <td className={`border border-gray-300 px-4 py-2 ${getStatusColor(subtype.status)}`}>{subtype.category}</td>
                    <td className={`border border-gray-300 px-4 py-2 ${getStatusColor(subtype.status)}`}>{subtype.size}</td>
                    <td className={`border border-gray-300 px-4 py-2 ${getStatusColor(subtype.status)}`}>{subtype.superbuiltup}</td>
                    <td className={`border border-gray-300 px-4 py-2 ${getStatusColor(subtype.status)}`}>{subtype.builtup}</td>
                    <td className={`border border-gray-300 px-4 py-2 ${getStatusColor(subtype.status)}`}>{subtype.carpetarea}</td>
                    <td className={`border border-gray-300 px-4 py-2 ${getStatusColor(subtype.status)}`}>{subtype.units}</td>
                    <td className={`border border-gray-300 px-4 py-2 ${getStatusColor(subtype.status)}`}>{subtype.price}</td>
                    <td className={`border border-gray-300 px-4 py-2 ${getStatusColor(subtype.status)}`} colSpan={2}>{subtype.status}</td>
                </tr>
                
                
                  ))
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
              <div className="my-4">
      {hasFeatures && (
        <>
          <h2 className="text-xl  text-slate-700 font-bold mb-2 font-sans">Features:</h2>
          <ul className="list-disc pl-4 font-mono">
            {featuresArray.map((feature, index) => (
              <li key={index} className="mb-2">{feature}</li>
            ))}
          </ul>
        </>
      )}
    </div>
 





              <div className="my-auto">
                <div className="text-lg font-semibold text-slate-800 font-mono">
                  {showFullDescription && <p>{listing.desc}</p>}
                </div>
                <button
                  className="text-blue-500 underline cursor-pointer  font-bold text-lg"
                  onClick={toggleDescription}
                >
                  <span className="mt-2  font-semibold  text-slate-700 text-2xl font-serif">
                    DESCRIPTION {showFullDescription ? "▲" : "▼"}
                  </span>
                </button>
              </div>

              {/* <p className="text-green-700">PROPERTY TYPE: {listing.type}</p>
              <p className="text-slate-800">PROPERTY NAME: {listing.title}</p> */}
            </div>
            <div className="mt-4">
              {/* <h2 className="text-2xl capitalize font-semibold text-gray-800 text-center">Highlights</h2>

 */}

              <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-start gap-4 sm:gap-6">
                {["flat", "duplex", "coreHouse"].includes(listing.type) && (
                  <>
                    <li className="flex items-center gap-1 whitespace-nowrap">
                      <FaBed className="text-lg" /> {listing.bedrooms} Bedrooms
                    </li>
                    <li className="flex items-center gap-1 whitespace-nowrap">
                      <FaBath className="text-lg" /> {listing.bathrooms}{" "}
                      Bathrooms
                    </li>
                    <li className="flex items-center gap-1 whitespace-nowrap">
                      <FaParking className="text-lg" /> {listing.parking}{" "}
                      Parking Spaces
                    </li>
                    <li className="flex items-center gap-1 whitespace-nowrap">
                      <FaChair className="text-lg" />{" "}
                      {listing.furnished ? "Furnished" : "Not Furnished"}
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>







          <div style={{ display: "flex", height: "100%" }}>
                {/* Right Side Column */}
                <div style={{ flex: 1 }}>
                  <div className="map">
                    <Map
                      pin={listing.pin}
                      state={listing.state}
                      city={listing.city}
                    />
                  </div>
                </div>
              </div>











          {/* Right Column - Property Image */}
          <div className="">
            {/* Add to Favorites Button */}
            {listing && !loading && !error && (
              <div className="flex justify-center">
                {/* Center the button */}
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4 hover:bg-blue-600 transition duration-300 font-serif font-bold"
                  onClick={addToFavourite}
                  disabled={propertyBooked} // Disable the button if property is already booked
                >
                  {propertyBooked ? "Property Booked" : "Add to Favorites"}
                </button>
              </div>
            )}
            {propertyBooked &&
            currentUser &&
            currentUser._id === listing.userId ? (  
              <p className="text-green-500 mt-4">
                Property booked successfully!
              </p>
            ) : (
              <div className="container mx-auto mt-4 flex flex-col items-center">
                {propertyBooked ? (
                  <p className="text-green-500 mt-4">
                    Property booked successfully!
                  </p>
                ) : (
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded font-serif"
                    onClick={
                      currentUser
                        ? handleShowContact
                        : () => navigate("/sign-in")
                    }
                  >
                    Book Property
                  </button>
                )}

                {showContact && !propertyBooked && (
                  <div className="fixed inset-0 flex items-center justify-center overflow-x-hidden bg-black bg-opacity-50 ">
                    <div className="bg-white p-8 rounded-md transform -translate-x-1/2 mx-auto my-auto">
                      <h2 className="text-lg font-semibold text-white">
                        BOOK YOUR PROPERTY
                      </h2>
                      <form>
                        <div className="mb-4">
                          <label
                            htmlFor="number"
                            className="block text-sm font-medium text-black font-mono"
                          >
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="number"
                            name="number"
                            value={contactFormData.number}
                            onChange={handleContactInputChange}
                            className="mt-1 p-2 border rounded-md w-full bg-gray-100"
                          />
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor="message"
                            className="block text-sm font-medium text-black font-mono"
                          >
                            Message
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            value={contactFormData.message}
                            onChange={handleContactInputChange}
                            rows="4"
                            className="mt-1 p-2 border rounded-md w-full bg-gray-100"
                          ></textarea>
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            className="bg-red-500 text-white px-4 py-2 rounded-md mr-4 font-serif font-bold"
                            onClick={() => setShowContact(false)}
                          >
                            Close
                          </button>
                          <button
                            type="button"
                            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 justify-center mr-5 font-serif font-bold"
                            onClick={handleBookPropertyClick}
                            disabled={sendingEmail}
                          >
                            {sendingEmail ? "Booking..." : "Book"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
