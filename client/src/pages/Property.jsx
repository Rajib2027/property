import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Import Link from react-router-dom
import axios from "axios";
import { BsFilter } from "react-icons/bs";
import { ClipLoader } from "react-spinners";
import { PulseLoader } from "react-spinners";
import { css } from "@emotion/react";

const override = css`
  display: block;
  margin: 0 auto;
`;
const Card = ({ type, title, price, make, center, imgUrls, _id, sold, hold ,propertyName,propertyType,minBookingAmount}) => {
  const cardStyle = {
    width: "18rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
    overflow: "hidden",
    textAlign: "center",
    position: "relative",
  };

  const imageStyle = {
    objectFit: "cover",
    height: "200px",
    width: "100%",
  };

  const statusTextStyle = {
    position: "absolute",
    bottom: "0",
    right: "0",
    padding: "8px",
    borderRadius: "4px",
    color: "#fff",
    display: "flex",
    alignItems: "center",
  };

  const handleClick = () => {
    if (!sold ) {
      window.location.href = `/listing/${_id}`;
    }
  };

  return (
    <div
      className={`card mx-auto mb-4 ${center ? "text-center" : ""}`}
      style={{ ...cardStyle, backgroundColor: "#f2f2f2" }}
      onClick={handleClick}
    >
      <img
        className="card-img-top"
        src={imgUrls[0]} // Assuming the first image is used
        alt={title}
        style={imageStyle}
      />
     <div className="card-body">
  <h5 className="card-title font-semibold font-serif">{title || propertyName}</h5>
  <p className="card-text capitalize font-bold font-sans">{type || propertyType}</p>
  <p className="card-text font-bold font-mono">&#8377;{price || minBookingAmount}</p>
  {make && <p className="card-text capitalize">{make}</p>}
</div>

      <div style={{ ...statusTextStyle, backgroundColor: sold ? "rgba(255, 0, 0, 0.7)" : (hold ? "rgba(255, 165, 0, 0.7)" : "transparent") }}>
        {sold ? "Sold" : (hold ? "Booked" : "")}
      </div>
    </div>
  );
};


const GridView = ({ properties }) => {
  const handleClick = (_Id, sold) => {
    if (!sold) {
      window.location.href = `/listing/${_Id}`;
    }
  };

  return (
    <div className="overflow-x-auto mt-2 w-full">
      <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-md">
        <colgroup>
          <col style={{ width: '27%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '16%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '10%' }} />
        </colgroup>
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="p-3 lg:border lg:border-gray-300">Image</th>
            <th className="p-3 lg:border lg:border-gray-300">Type</th>
            <th className="p-3 lg:border lg:border-gray-300">Title</th>
            <th className="p-3 lg:border lg:border-gray-300 text-right">Price</th>
            <th className="p-3 lg:border lg:border-gray-300 text-right">State</th>
            <th className="p-3 lg:border lg:border-gray-300 text-right">City</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr key={property._id} className="lg:border-b hover:bg-gray-100">
              <td className="p-3 lg:border-r">
                <div
                  onClick={() => handleClick(property._id, property.sold)}
                  style={{ position: 'relative', cursor: property.sold ? 'not-allowed' : 'pointer' }}
                >
                  {property.sold && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(255, 0, 0, 0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '8px',
                      }}
                    >
                      Sold
                    </div>
                  )}
                  <img
                    src={property.imgUrls[0]}
                    alt={`Property ${property.id} Image`}
                    className="w-96 h-40 object-cover rounded-md"
                  />
                </div>
              </td>
              <td className="p-3 lg:border-r capitalize">{property.type || property.propertyType}</td>
              <td className="p-3 lg:border-r">{property.title || property.propertyName}</td>
              <td className="p-3 lg:text-right lg:border-r">&#8377;{property.price || property.minBookingAmount}</td>
              <td className="p-3 lg:text-right lg:border-r">{property.state}</td>
              <td className="p-3 lg:text-right lg:border-r">{property.city}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


const NoResultsMessage = () => {
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [messageError, setMessageError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear previous error when user starts typing
    switch (name) {
      case "name":
        setNameError("");
        break;
      case "email":
        setEmailError("");
        break;
      case "mobile":
        setMobileError("");
        break;
      case "message":
        setMessageError("");
        break;
      default:
        break;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let isValid = true;

    // Simple validation example, you can replace with more robust validation logic

    // Name validation
    if (formData.name.trim() === "") {
      setNameError("Name is required");
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setEmailError("Invalid email address");
      isValid = false;
    }

    // Mobile validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobile.trim())) {
      setMobileError("Mobile must be a 10-digit number");
      isValid = false;
    }

    // Message validation
    if (formData.message.trim() === "") {
      setMessageError("Message is required");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      // Make a POST request to your backend API
      const response = await fetch("/api/user/send-enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any other headers if needed
        },
        body: JSON.stringify({ formData }),
      });

      // Check if the request was successful (status code 2xx)
      if (response.ok) {
        console.log("Email sent successfully");
        // Close the modal after submission
        setShowContactForm(false);
        setSubmissionSuccess(true);
      } else {
        // Handle the case where the request was not successful
        console.error("Failed to send email:", response.statusText);
      }
    } catch (error) {
      // Handle any network or other errors that may occur
      console.error("Error sending email:", error.message);
    } finally {
      setLoading(false); // Set loading state back to false after the request is complete
    }
  };

  return (
    <div className="text-center mt-8">
      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-4xl font-bold text-red-500 mb-4 animate__animated animate__fadeInDown">
          Oops! No results found.
        </h2>
        <p className="text-lg text-gray-700 animate__animated animate__fadeIn">
          We couldn't find any properties matching your search criteria.
        </p>
        {submissionSuccess ? (
          <div className="bg-green-500 text-white p-4 rounded-md shadow-md inline-block mt-4 animate__animated animate__fadeInUp">
            <p className="text-lg font-bold mb-2">
              Request Submitted Successfully!
            </p>
            <p>
              Your request has been received, and we'll get back to you soon.
            </p>
          </div>
        ) : (
          <div className="bg-red-500 text-white p-4 rounded-md shadow-md inline-block mt-4 animate__animated animate__fadeInUp">
            <p className="text-lg font-bold mb-2">What you can do:</p>
            <ul className="list-disc list-inside">
              <li>Double-check your search criteria.</li>
              <li>Expand your search radius.</li>
              <li>Contact us for personalized assistance.</li>
            </ul>
          </div>
        )}
        {/* Additional personalized error message with animation */}
        <div className="mt-8">
          <p className="text-gray-600 animate-bounce">
            🤔 Can't find what you're looking for? Let us help you! Click below
            to request assistance.
          </p>
          <button
            className={`mt-4 ${
              submissionSuccess ? "bg-gray-500" : "bg-blue-500"
            } text-white px-4 py-2 rounded-md hover:${
              submissionSuccess ? "bg-gray-500" : "bg-blue-600"
            } focus:outline-none focus:ring focus:border-blue-300`}
            onClick={() => setShowContactForm(!submissionSuccess)}
          >
            {submissionSuccess ? "Request Submitted" : "Request Assistance"}
          </button>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-md">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="tel"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Mobile
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
                {mobileError && <p className="text-red-500">{mobileError}</p>}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:border-green-300 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading} // Disable the button when loading is true
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
                <button
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded-md ml-4"
                  onClick={() => setShowContactForm(false)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Pproperties() {
  const [properties, setProperties] = useState([]);
  const [viewMode, setViewMode] = useState("card");
  const [itemsToShow, setItemsToShow] = useState(12);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    desc: "",
    imgUrls: [],
    price: 0,

    sqrmeter: "",
    sqrfeet: "",
    decimil: "",
    state: "",
    city: "",
    district: "",
    pin: "",
    featured: false,
    bathrooms: 0,
    bedrooms: 0,
    furnished: false,
    parking: false,
  });
  const [sizeUnit, setSizeUnit] = useState("sqrmeter");
  const [sizeValues, setSizeValues] = useState({
    sqrmeter: "",
    sqrfeet: "",
    decimil: "",
  });

  const [locationData, setLocationData] = useState({
    state: [],
    citie: [],
    district: [],
    pin: [],
  });
  const location = useLocation();
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch properties and set initial state
        const propertiesResponse = await fetch("/api/property/allProp");
        const propertiesData = await propertiesResponse.json();
        setProperties(propertiesData);

        // Fetch property types and location data
        const propertyTypesResponse = await axios.get(
          "/api/property/propertyType"
        );
        setPropertyTypes(propertyTypesResponse.data);

        const locationDataResponse = await axios.get(
          "/api/property/getLocation"
        );
        setLocationData(locationDataResponse.data);

        // Handle filtered properties from navigation
        if (location.state && location.state.filteredProperties) {
          const { filteredProperties } = location.state;
          if (
            Array.isArray(filteredProperties) &&
            filteredProperties.length > 0
          ) {
            // If there are filtered properties from navigation, set them
            setFilteredProperties(filteredProperties);
          } else {
            // If there are no filtered properties, set the propertiesData as initial state
            setFilteredProperties(propertiesData);
          }
        } else {
          // If there is no location state, set the propertiesData as initial state
          setFilteredProperties(propertiesData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data. Please try again later."); // Set the error state
      } finally {
        // Set loading to false once the operation is completed
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleView = (mode) => {
    setViewMode(mode);
  };

  const handleShowMore = () => {
    setItemsToShow(itemsToShow + 12);
  };
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (name === "type") {
      setSelectedPropertyType(value);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "minPrice" || name === "maxPrice") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    if (name === "sqrfeet") {
      console.log("Sqrfeet value:", value);
      setFormData((prevData) => ({
        ...prevData,
        [name]: value !== "" ? parseFloat(value) : "",
      }));
    }

    if (name === "state") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
        city: "",
        district: "",
        pin: "",
      }));
    } else if (name === "city") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
        district: "",
        pin: "",
      }));
    } else if (name === "district") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
        pin: "",
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSizeUnitChange = (e) => {
    setSizeUnit(e.target.value);
  };
  const handleReset = () => {
    // Reset the formData state to its initial state
    setFormData({
      title: "",
      type: "",
      desc: "",
      imgUrls: [],
      price: 0,
      sqrmeter: "",
      sqrfeet: "",
      decimil: "",
      state: "",
      city: "",
      district: "",
      pin: "",
      featured: false,
      bathrooms: 0,
      bedrooms: 0,
      furnished: false,
      parking: false,
    });
  };

  const searchProperties = async () => {
    try {
      const response = await axios.post("/api/property/filter", formData);
      setFilteredProperties(response.data);
      console.log("Filtered Properties:", response.data); // Log filtered data
      toggleFilterPopup();
    } catch (error) {
      console.error("Error searching properties:", error);
    }
  };

  const toggleFilterPopup = () => {
    var filterPopup = document.getElementById("filterPopup");
    filterPopup.classList.toggle("hidden");
  };
  const ErrorPage = () => {
    return (
      <div className="text-center mt-16">
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          {/* <img src="/path/to/error-image.png" alt="Error" className="mb-8 mx-auto" width="200" /> */}
          <h2 className="text-4xl font-bold text-red-500 mb-4">
            Oops! Something went wrong.
          </h2>
          <p className="text-gray-700 mb-8">
            We apologize for the inconvenience. Please try again later.
          </p>

          <div className="bg-red-500 text-white p-4 rounded-md shadow-md inline-block">
            <p className="text-lg font-bold mb-2">What you can do:</p>
            <ul className="list-disc list-inside">
              <li>Check your internet connection.</li>
              <li>Refresh the page.</li>
              <li>Contact support if the issue persists.</li>
            </ul>
          </div>

          {/* Additional error animation or message */}
          <div className="mt-8">
            <p className="text-gray-600 animate-bounce">
              🤔 Need a break? Take a deep breath and try again!
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className=" ">
      <div
        id="filterPopup"
        class="filter-popup hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white z-10 p-4 border w-fit border-gray-300 shadow-lg"
      >
        {/* Left column with border */}
        <div className="">
          {/* TYPE SEARCH */}
          <select
            id="type"
            name="type"
            onChange={handleChange}
            value={formData.type}
            className="mt-4 md:mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 w-full"
          >
            <option value="" disabled>
              Select Property Type
            </option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* SIZE */}

          <div className="flex items-center gap-2 mb-4 mt-6">
            {/* <label className="font-semibold">Size Unit:</label> */}
            <div className="flex gap-2">
              <input
                type="radio"
                id="sqrmeter"
                name="sizeUnit"
                value="sqrmeter"
                checked={sizeUnit === "sqrmeter"}
                onChange={handleSizeUnitChange}
              />
              <label htmlFor="sqrmeter">Square Meter</label>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="sqrfeet"
                name="sizeUnit"
                value="sqrfeet"
                checked={sizeUnit === "sqrfeet"}
                onChange={handleSizeUnitChange}
              />
              <label htmlFor="sqrfeet">Square Feet</label>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="decimil"
                name="sizeUnit"
                value="decimil"
                checked={sizeUnit === "decimil"}
                onChange={handleSizeUnitChange}
              />
              <label htmlFor="decimil">Decimal</label>
            </div>
          </div>
          {/* ... (previous code) */}
          {sizeUnit === "sqrmeter" && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="sqrmeter"
                name="sqrmeter"
                placeholder="Square Meter"
                className="p-3 border-gray-300 rounded-lg"
                value={formData.sqrmeter}
                onChange={handleChange}
              />
              <p>Square Meter</p>
            </div>
          )}
          {sizeUnit === "sqrfeet" && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="sqrfeet"
                name="sqrfeet"
                placeholder="Square Feet"
                className="p-3 border-gray-300 rounded-lg"
                value={formData.sqrfeet}
                onChange={handleChange}
              />
              <p>Square Feet</p>
            </div>
          )}
          {sizeUnit === "decimil" && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="decimil"
                name="decimil"
                placeholder="Decimal"
                step="0.01"
                className="p-3 border-gray-300 rounded-lg"
                value={formData.decimil}
                onChange={handleChange}
              />
              <p>Decimal</p>
            </div>
          )}

          {/* PRICE RANGE */}
          <div className="flex flex-col items-center mb-4 mt-6">
            {/* <p className="font-semibold mb-2">Price Range</p> */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-2">
              <div className="border rounded-lg">
                <input
                  type="number"
                  id="minPrice"
                  name="minPrice"
                  placeholder="Min Price"
                  className="p-3 border-gray-300 w-full"
                  value={formData.minPrice}
                  onChange={handleChange}
                />
              </div>
              <div className="border rounded-lg">
                <input
                  type="number"
                  id="maxPrice"
                  name="maxPrice"
                  placeholder="Max Price"
                  className="p-3 border-gray-300 w-full"
                  value={formData.maxPrice}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* LOCATION */}
          <div className=" ">
            <div className="mb-4">
              <select
                id="state"
                name="state"
                className="w-full p-2 border rounded"
                value={formData.state}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select State
                </option>
                {Array.isArray(locationData) &&
                  Array.from(
                    new Set(locationData.map((location) => location.state))
                  ).map((state, index) => (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  ))}
              </select>
            </div>

            <div className="mb-4">
              <select
                id="city"
                name="city"
                className="w-full p-2 border rounded"
                value={formData.city}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select City
                </option>
                {Array.isArray(locationData) &&
                  Array.from(
                    new Set(
                      locationData
                        .filter((location) => location.state === formData.state)
                        .map((location) => location.city)
                    )
                  ).map((city, index) => (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  ))}
              </select>
            </div>

            <div className="mb-4">
              <select
                id="district"
                name="district"
                className="w-full p-2 border rounded"
                value={formData.district}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select District
                </option>
                {Array.isArray(locationData) &&
                  Array.from(
                    new Set(
                      locationData
                        .filter((location) => location.city === formData.city)
                        .map((location) => location.district)
                    )
                  ).map((district, index) => (
                    <option key={index} value={district}>
                      {district}
                    </option>
                  ))}
              </select>
            </div>

            <div className="mb-4">
              <select
                id="pin"
                name="pin"
                className="w-full p-2 border rounded"
                value={formData.pin}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select PIN Code
                </option>
                {Array.isArray(locationData) &&
                  Array.from(
                    new Set(
                      locationData
                        .filter(
                          (location) => location.district === formData.district
                        )
                        .map((location) => location.pin)
                    )
                  ).map((pin, index) => (
                    <option key={index} value={pin}>
                      {pin}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex justify-center mt-4 space-x-4">
              <button
                className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
                onClick={searchProperties}
              >
                Search
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
              >
                Reset Filters
              </button>
              <button
                type="button"
                onClick={toggleFilterPopup}
                className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>



      <div className="w-full md:w-auto p-4">
        <div className="flex justify-center mt-4 mb-4 space-x-4">
          <button
            onClick={toggleFilterPopup}
            className="bg-blue-500 text-white px-6 py-2 flex items-center hover:bg-blue-600 focus:outline-none font-serif font-bold"
          >
            <BsFilter className="mr-2" /> Search
          </button>
          <button
            className={`px-4 py-2 ${
              viewMode === "card" ? "bg-blue-500 text-white" : "bg-gray-300 font-serif font-bold"
            }`}
            onClick={() => toggleView("card")}
          >
            Card View
          </button>
          <button
            className={`px-4 py-2 ${
              viewMode === "grid" ? "bg-blue-500 text-white" : "bg-gray-300 font-serif font-bold"
            }`}
            onClick={() => toggleView("grid")}
          >
            Grid View
          </button>
        </div>

        <div className="container mx-auto flex flex-wrap gap-x-28 gap-y-5">
      {loading ? (
        <div className="text-center mt-2">
          <PulseLoader color="#3498db" loading={loading} css={override} size={50} />
          <p>Loading...</p>
        </div>
      ) : error ? (
        <ErrorPage />
      ) : filteredProperties.length === 0 ? (
        <NoResultsMessage />
      ) : (
        <>
          {viewMode === "card" ? (
            <>
              {filteredProperties.slice(0, itemsToShow).map((property, index) => (
  <div
  key={property._id}
  className={`mb-1 px-1 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6`} >
    <Card {...property} sold={property.sold} hold={property.hold} propertyName={property.propertyName} propertyType={property.propertyType} minBookingAmount={property.minBookingAmount} />
  </div>
))}

            </>
          ) : (
            <GridView properties={filteredProperties.slice(0, itemsToShow)} />
          )}

          {itemsToShow < properties.length && (
            <div className="flex justify-center mt-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white"
                onClick={handleShowMore}
              >
                Show More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  </div>
  </div>
);
}
