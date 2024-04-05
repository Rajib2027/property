import React, { useEffect, useState } from "react";
import axios from "axios";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase'
import {useSelector} from 'react-redux';

export default function AddProperty() {
const {currentUser} =useSelector(state=>state.user)
const [sizeUnit, setSizeUnit] = useState("sqrmeter");
const [sizeValues, setSizeValues] = useState({
  sqrmeter: "",
  sqrfeet: "",
  decimil: "",
});

//const { token } = useSelector((state) => state.auth)
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    desc: "",
    imgUrls: [],
    price: 0,
  
    sqrmeter:"",
    sqrfeet:"",
    decimil:"",
    state:"",
    city: "",
    district: "",
    pin: "",
    featured: false,
    bathrooms: 0,
    bedrooms: 0,
    furnished: false,
    parking: false,
  });

  console.log(formData)

  const [propertyTypes, setPropertyTypes] = useState([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [files,setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error,setError] = useState(false);
  const [loading,setLoading] = useState(false);
  // Effect to fetch property types from the backend when the component mounts
  useEffect(() => {
    // Fetch property types from the backend
    const fetchPropertyTypes = async () => {
      try {
        const response = await axios.get("/api/property/propertyType"); // Update the API endpoint
        setPropertyTypes(response.data);
      } catch (error) {
        console.error("Error fetching property types:", error);
      }
    };

    // Call the fetchPropertyTypes function
    fetchPropertyTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    if (name === 'type') {
      setSelectedPropertyType(value);
    }
    if (name === 'type') {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    if (name === 'parking' || name === 'furnished') {
      setFormData({
        ...formData,
        [name]: checked,
      });
    }
  
    if (type === 'number' || type === 'text' || type === 'textarea') {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  
    const currentSizeUnit = sizeUnit; // Get the current sizeUnit from state

    if (currentSizeUnit === "sqrmeter" && name === "sqrmeter") {
      setSizeValues({
        sqrmeter: value,
        sqrfeet: (value * 10.764).toFixed(2),
        decimil: (value * 0.02471).toFixed(2),
      });
  
      setFormData({
        ...formData,
        [name]: value,
        sqrfeet: (value * 10.764).toFixed(2),
        decimil: (value * 0.02471).toFixed(2),
      });
    } else if (currentSizeUnit === "sqrfeet" && name === "sqrfeet") {
      setSizeValues({
        sqrmeter: (value / 10.764).toFixed(2),
        sqrfeet: value,
        decimil: (value * 0.0022957).toFixed(2),
      });
  
      setFormData({
        ...formData,
        [name]: value,
        sqrmeter: (value / 10.764).toFixed(2),
        decimil: (value * 0.0022957).toFixed(2),
      });
    } else if (currentSizeUnit === "decimil" && name === "decimil") {
      setSizeValues({
        sqrmeter: (value / 0.02471).toFixed(2),
        sqrfeet: (value / 0.0022957).toFixed(2),
        decimil: value,
      });
  
      setFormData({
        ...formData,
        [name]: value,
        sqrmeter: (value / 0.02471).toFixed(2),
        sqrfeet: (value / 0.0022957).toFixed(2),
      });
    }
  };
  
    
   
    
  

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imgUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imgUrls: formData.imgUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };


const storeImage = async (file) => {
  return new Promise((resolve, reject) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};



const handleRemoveImage = (index) =>{
  setFormData({
    ...formData,
    imgUrls: formData.imgUrls.filter((_,i)=> i !== index),
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (formData.imgUrls.length < 1)
      return setError('You must upload at least one image');
   
    setLoading(true);
    setError(false);

    const res = await fetch('/api/property/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        userRef: currentUser._id,
      }),
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status} - ${res.statusText}`);
    }

    let data;

    try {
      data = await res.json();
    } catch (jsonError) {
      throw new Error(`Error parsing JSON: ${jsonError.message}`);
    }

    setLoading(false);

    if (data.success === false) {
      setError(data.message);
    } else {
      console.log("Successfully added:", data);
      // Reset the form and show success message
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
      setImageUploadError(false);
      setFiles([]);
      // Display a success message (you can replace this with your preferred way of displaying messages)
      alert('Property added successfully!');
    }
  } catch (error) {
    setError(error.message);
    setLoading(false);
  }
};



// const handleSizeInputChange = (value, unit) => {
//   setFormData((prevData) => ({
//     ...prevData,
//     size: `${value} ${unit}`,
//   }));
// };


const handleSizeUnitChange = (e) => {
  setSizeUnit(e.target.value);
};

  return (
    <main className="p-4 max-w-4xl mx-auto font-mono bg-gray-100 rounded-lg shadow-lg">
    <h1 className="text-2xl font-bold font-sans my-7 text-center text-blue-700">Add Property</h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row  gap-4">
        {/* Add other form fields as needed */}
        
        <div className="flex flex-col gap-4 flex-1">
       
          <select
            id="type"
            name="type" 
            onChange={handleChange}
            value={formData.type}
            className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 w-full"
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
          <input
            type="text"
            placeholder="Title"
            className="border p-3 rounded-lg"
            id="title"
            name="title"
            maxLength="35"
            minLength="5"
            required
            value={formData.title}
            onChange={handleChange}     
          />
           
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="desc"
            name="desc"
            required
            value={formData.desc}
            onChange={handleChange}
          />
        
        <div className='flex flex-col gap-4 sm:flex-row'>
          <div className="flex flex-col gap-4 sm:flex-1">
            <div className="flex items-center gap-2">
              <input
                type="text"
                id="state"
                name="state"
                placeholder="STATE"
                className="border rounded-lg p-2 w-full"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                id="district"
                name="district"
                placeholder="DISTRICT"
                className="border rounded-lg p-2 w-full"
                value={formData.district}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Second Column */}
          <div className="flex flex-col gap-4 sm:flex-1">
            <div className="flex items-center gap-2">
              <input
                type="text"
                id="city"
                name="city"
                placeholder="CITY"
                className="border rounded-lg p-2 w-full"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                id="pin"
                name="pin"
                placeholder="PINCODE"
                className="border rounded-lg p-2 w-full"
                value={formData.pin}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>




          <div className="flex items-center gap-2 mb-4">
            <label className="font-semibold">Size Unit:</label>
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
            </div>)}












          {selectedPropertyType === "flat" ||
          selectedPropertyType === "duplex" ||
          selectedPropertyType === "coreHouse" ? (
            <div>
              <div className="flex gap-6 flex-wrap">
                {/* Parking Spot */}
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="parking"
                    name="parking"
                    className="w-5"
                    value={formData.parking}
                    onChange={handleChange}
                  />
                  <span>Parking Spot</span>
                </div>

                {/* Furnished */}
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="furnished"
                    name="furnished"
                    className="w-5"
                    value={formData.furnished}
                    onChange={handleChange}
                  />
                  <span>Furnished</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 pt-4">
                {/* Beds */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="bedrooms"
                    name="bedrooms"
                    className="p-3 border-gray-300 rounded-lg"
                    value={formData.bedrooms}
                    onChange={handleChange}
                  />
                  <p>Beds</p>
                </div>

                {/* Baths */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="bathrooms"
                    name="bathrooms"
                    className="p-3 border-gray-300 rounded-lg"
                    value={formData.bathrooms}
                    onChange={handleChange}
                  />
                  <p>Baths</p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Price */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              id="price"
              name="price"
              className="p-3 border-gray-300 rounded-lg"
              value={formData.price}
              onChange={handleChange}
            />
            <p>Price</p>
          </div>
        </div>
        
        <div className='flex flex-col flex-1 gap-4 sm:p-6'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e) => setFiles(e.target.files)}
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className='p-3 text-green-700 font-serif font-bold   border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>
          {formData.imgUrls.length > 0 &&
            formData.imgUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center'
              >
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}
        <button disabled={loading || uploading} className="p-3 bg-slate-700 font-serif font-bold text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
        {loading? 'Adding....': 'Add Property'}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}
        