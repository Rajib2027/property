import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link from react-router-dom
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import Select from 'react-select';
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [viewMode, setViewMode] = useState("card");
  const [itemsToShow, setItemsToShow] = useState(6);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  const navigate = useNavigate();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // Adjust this value for the desired auto slide duration
  };

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
  const [locationData, setLocationData] = useState({
    state: [],
    citie: [],
    district: [],
    pin: [],
  });



  const propertyDetails = [
    "residential",
    "commercial",
    "farmHouse",
    "agriculturalLand",
    "flat",
    "duplex",
    "coreHouse",
    "commercialBuildings",
    "projects",
    "leasePlots",
    "wareHouse",
  ];

  const [selectedDetail, setSelectedDetail] = useState(null);

  const handleSelectChange = (selectedOption) => {
    setSelectedDetail(selectedOption);
  };

  const getDetailDescription = () => {
    if (selectedDetail) {
      // You can add logic here to fetch or display the description based on the selected detail.
      return (
        <div>
          <h2 className="text-lg font-bold">{selectedDetail.label}</h2>
          <p className="mt-2 text-gray-600">
            Description for {selectedDetail.label} goes here. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit.
          </p>
        </div>
      );
    }
    return null;
  };

  const dropdownOptions = propertyDetails.map((detail) => ({
    value: detail,
    label: detail.charAt(0).toUpperCase() + detail.slice(1),
  }));


  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        const response = await axios.get("/api/property/propertyType");
        setPropertyTypes(response.data);
      } catch (error) {
        console.error("Error fetching property types:", error);
      }
    };
    fetchPropertyTypes();

    const fetchLocationData = async () => {
      try {
        const response = await axios.get("/api/property/getLocation");
        setLocationData(response.data);
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };
    fetchLocationData();

   const fetchImageUrls = async ()=>{
    try {
       const response = await axios.get("/api/property/getUrls");
       setImageUrls(response.data);
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
   }

    fetchImageUrls()

  }, []);

  const toggleView = (mode) => {
    setViewMode(mode);
  };

  const handleShowMore = () => {
    setItemsToShow(itemsToShow + 4);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

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
  };

  const handleSizeUnitChange = (e) => {
    setSizeUnit(e.target.value);
  };

  const handleReset = () => {
    // Implement reset logic if needed
  };
  const searchProperties = async () => {
    try {
      const response = await axios.post("/api/property/filter", formData);
      console.log("Response", response.data);
      const filteredData = response.data;

      console.log("Filtered Properties:", filteredData);

      // Merge new filteredData with existing properties
      const updatedFilteredProperties = [...properties, ...filteredData];

      navigate("/properties", {
        state: { filteredProperties: updatedFilteredProperties },
      });
    } catch (error) {
      console.error("Error searching properties:", error);
    }
  };

  const StatisticsCards = ({ totalCustomers, totalProperties, awardWinnings }) => {
    const [animatedTotalCustomers, setAnimatedTotalCustomers] = useState(0);
    const [animatedTotalProperties, setAnimatedTotalProperties] = useState(0);
    const [animatedAwardWinnings, setAnimatedAwardWinnings] = useState(0);
  
    useEffect(() => {
      const animationDuration = 1000; // in milliseconds
  
      const startAnimation = (finalValue, setAnimatedValue) => {
        let startTime;
  
        const updateAnimation = (timestamp) => {
          startTime = startTime || timestamp;
          const progress = (timestamp - startTime) / animationDuration;
  
          if (progress < 1) {
            const animatedValue = Math.floor(progress * finalValue);
            setAnimatedValue(animatedValue);
            requestAnimationFrame(updateAnimation);
          } else {
            setAnimatedValue(finalValue);
          }
        };
  
        requestAnimationFrame(updateAnimation);
      };
  
      const animateCounters = () => {
        startAnimation(totalCustomers, setAnimatedTotalCustomers);
        startAnimation(totalProperties, setAnimatedTotalProperties);
        startAnimation(awardWinnings, setAnimatedAwardWinnings);
      };
  
      // Initial animation on mount
      animateCounters();
  
      // Set interval to trigger animation every 3 seconds
      const intervalId = setInterval(animateCounters, 3000);
  
      // Cleanup interval on component unmount
      return () => clearInterval(intervalId);
    }, [totalCustomers, totalProperties, awardWinnings]);
      
    return (
      <div className="flex justify-around items-center mt-8 space-x-4">
        {/* Card for Total Number of Customer Counters */}
        <div className="bg-blue-200 p-4 rounded-lg shadow-md transition-transform">
          <h2 className="text-xl font-semibold mb-2">Total Customers</h2>
          <p className="text-3xl font-bold transform scale-110 transition-transform">
            {animatedTotalCustomers}
          </p>    
        </div>
    
        {/* Card for Total Number of Properties */}
        <div className="bg-green-200 p-4 rounded-lg shadow-md transition-transform">
          <h2 className="text-xl font-semibold mb-2">Total Properties</h2>
          <p className="text-3xl font-bold transform scale-110 transition-transform">
            {animatedTotalProperties}
          </p>
        </div> 
  
        {/* Card for Award Winnings */}
        <div className="bg-yellow-200 p-4 rounded-lg shadow-md transition-transform">
          <h2 className="text-xl font-semibold mb-2">Award Winnings</h2>
          <p className="text-3xl font-bold transform scale-110 transition-transform">
            {animatedAwardWinnings}
          </p>
        </div>
      </div>
    );
  };
  
  const totalCustomers = 1000 ;
  const totalProperties = 500 ;
  const awardWinnings = 10 ;
  
  const dropdownStyles = {
    control: (provided, state) => ({
      ...provided,
      border: '2px solid #6B7280',
      borderRadius: '8px',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(107, 114, 128, 0.5)' : 'none',
      '&:hover': {
        borderColor: '#4B5563',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#6B7280' : 'white',
      color: state.isSelected ? 'white' : '#111827',
      '&:hover': {
        backgroundColor: '#6B7280',
        color: 'white',
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999, // Ensure the dropdown covers other elements
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: '100px', // Set a max height for the dropdown menu
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#6B7280',
    }),
  };     


  return (
    <div className="overflow-x-hidden">
   <Slider {...settings} className="mt-2 ml-5 mr-5">
  {imageUrls.map((url, index) => (
    <div key={index}>
      <img
        src={url}
        alt={`Slide ${index + 1}`}
        className="w-full h-full rounded-lg"
        style={{ objectFit: 'cover', width: '150%', height: '600px' }} // Adjust the height as needed
      />
    </div>
  ))}
</Slider>


    
    <div className="flex flex-col md:flex-row">

  {/* Left column with border */}
  <div className="w-full md:max-w-2xl md:mr-4">

    {/* <!-- Left Column Content -->
    <!-- This column will take up 60% of the parent container's width --> */}
    <div className="container mx-auto mt-8 md:ml-5 md:mr-5 p-6 bg-gray-100 bg-opacity-50 rounded-lg shadow-lg">

            <div className="text-center mb-8 mt-5">
              <h1 className="text-4xl font-bold">Your Website Name</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left side: Type */}
              <div>
                <select
                  id="type"
                  name="type"
                  onChange={handleChange}
                  value={formData.type}
                  className="mt-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 w-full"
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
              </div>

              {/* Right side: Min Max Price */}
              <div>
                <div className="flex flex-col items-center my-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left side: State, City, District, and PIN on one line */}
              <div className="flex flex-col items-center my-4">
                <div className="mb-4 flex">
                  <select
                    id="state"
                    name="state"
                    className="w-full p-2 border rounded mr-2"
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

                  <select
                    id="city"
                    name="city"
                    className="w-full p-2 border rounded mr-2"
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
                            .filter(
                              (location) => location.state === formData.state
                            )
                            .map((location) => location.city)
                        )
                      ).map((city, index) => (
                        <option key={index} value={city}>
                          {city}
                        </option>
                      ))}
                  </select>

                  <select
                    id="district"
                    name="district"
                    className="w-full p-2 border rounded mr-2"
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
                            .filter(
                              (location) => location.city === formData.city
                            )
                            .map((location) => location.district)
                        )
                      ).map((district, index) => (
                        <option key={index} value={district}>
                          {district}
                        </option>
                      ))}
                  </select>

                  <select
                    id="pin"
                    name="pin"
                    className="w-full p-2 border rounded mr-2"
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
                              (location) =>
                                location.district === formData.district
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
              </div>

              {/* Right side: Size Unit Radio */}
              <div>
                <div className="flex items-center gap-2 my-4">
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

                {sizeUnit === "sqrmeter" && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      id="sqrmeter"
                      name="sqrmeter"
                      placeholder="Square Meter"
                      className="p-3 border-gray-300 rounded-lg w-full"
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
                      className="p-3 border-gray-300 rounded-lg w-full"
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
                      className="p-3 border-gray-300 rounded-lg w-full"
                      value={formData.decimil}
                      onChange={handleChange}
                    />
                    <p>Decimal</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center my-4">
              <button
                className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-full"
                onClick={searchProperties}
              >
                Search
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-full mt-4"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
        <div className="w-full md:w-3/4 p-4">
          {/* Right column content */}
          <div className="flex justify-center mt-4">
            {/* Add your code for adding a photo here */}
            <div className="relative">
              <img
                src="https://img.freepik.com/free-photo/river-surrounded-by-hills-covered-greenery-sunlight-blue-sky_181624-16002.jpg?size=626&ext=jpg&ga=GA1.1.1654351847.1707128661&semt=sph"
                alt="Your Alt Text"
                className="rounded border border-gray-500 ml-2"
              />
              <p className="ml-2">
                Land, an ancient canvas sculpted by time's patient hand,
                whispers tales of epochs gone by. Majestic mountains stand as
                stoic sentinels, their peaks caressed by clouds. Meadows sway in
                the breeze, adorned with wildflowers that dance in harmony.
                Rivers carve stories into the earth, etching a narrative
                embraced by the vast embrace of land.
              </p>
            </div>
          </div>
        </div>    
      </div>

      <hr className="mt-1 bg-green-700  " />
      <div className="flex flex-col lg:flex-row justify-between">
  {/* <!-- Left Column --> */}
  <div className="w-full lg:w-1/2 mb-4 lg:mb-0">
    <div className="container mt-3 p-6 bg-gray-100 bg-opacity-50 rounded-lg shadow-lg lg:ml-5 lg:mr-20">
      <h1 className="text-3xl font-semibold text-center mb-4">
        Business Statistics
      </h1>
      <StatisticsCards
        totalCustomers={totalCustomers}
        totalProperties={totalProperties}
        awardWinnings={awardWinnings}
      />
    </div>
  </div>

  {/* <!-- Right Column --> */}
  <div className="w-full lg:w-1/2">
    <div className="ml-2 mr-2 lg:ml-7">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Property Type Descriptions
      </h1>
      <Select
        options={dropdownOptions}
        value={selectedDetail}
        onChange={handleSelectChange}
        placeholder="Select a property detail"
        styles={dropdownStyles}
      />
      {getDetailDescription()}
    </div>
  </div>
</div>
<hr className="mt-4 lg:mt-1 bg-green-700" />



    </div>
  );
}
