import React, { useEffect, useState } from "react";
import axios from "axios";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase'
import {useSelector} from 'react-redux';

export default function ProjectAddingPage() {
  const [formData, setFormData] = useState({
    propertyName: "",
    state: "",
    type:"projects",
    city: "",
    district: "",
    pin: "",
    desc:"",
    unitsAvailable: "",
    propertyType: "",
    minBookingAmount: "",
    features: "",
    imgUrls: [],
    additionalFields: [],
  });

  const [propertyTypes, setPropertyTypes] = useState([]);
  const [fractionEntered, setFractionEntered] = useState(false);
  const [additionalFields, setAdditionalFields] = useState([]);
  const { plotType, plotSize, plotPricing, minBookingAmount } = formData;
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const {currentUser} =useSelector(state=>state.user)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError(false);
    setSuccessMessage(null);
    if (name === "unitsAvailable") {
      const isFraction = /^\d+\/\d+$/.test(value);
      setFractionEntered(isFraction);
    }
  };

  const generateSubtypes = (additionalFields) => {
    const subtypes = [];
   additionalFields.forEach((field) => {
      for (let i = 1; i <= field.units; i++) {
        const subtypeType = `${field.type}${i}`;
        subtypes.push({
          type: subtypeType,
          size: field.size,
          units: `unit${i}`,
          price: field.price,
          status: "Available",
          superbuiltup: field.superbuiltup, 
          builtup: field.builtup, 
          carpetarea: field.carpetarea, 
          category: field.category, 
        });
      }
    });
   return subtypes;
  };

  const handleAddMore = () => {
    setFormData((prevData) => ({
      ...prevData,
      additionalFields: [
        ...prevData.additionalFields,
        { type: "", size: "NA", units: "", price: "", superbuiltup: "NA", builtup: "NA", carpetarea: "NA" , category: ""},
      ],
    }));
  };


  const handleAdditionalFieldChange = (index, field, e) => {
    const newAdditionalFields = [...formData.additionalFields];
    newAdditionalFields[index][field] = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      additionalFields: newAdditionalFields,
    }));
  };
  

  useEffect(() => {
  // Fetch property types from your project model or any other data source
  
  // Show initial set of fields 
  setupInitialAdditionalFields();
    // // Show initial set of fields
    // handleAddMore();
}, []);

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
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
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
        "state_changed",
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

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imgUrls: formData.imgUrls.filter((_, i) => i !== index),
    });
  };


  const setupInitialAdditionalFields = () => {
    setFormData((prevData) => ({
      ...prevData,
      additionalFields: [{ type: '', size: 'NA', units: '', price: '' , superbuiltup: 'NA', builtup: 'NA', carpetarea: 'NA',category:'' }],
    }));
  };
  

  const handleFeaturesChange = (e) => {
    const featuresArray = e.target.value.split("\n").map((line) => line.trim());
    const featuresString = featuresArray.join(", "); // or any other delimiter you prefer
    setFormData({
      ...formData,
      features: featuresString,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const additionalFieldsFilled = formData.additionalFields.every(
      (field) =>
        field.type &&
        field.size &&
        field.units &&
        field.price &&
        field.superbuiltup &&
        field.builtup &&
        field.carpetarea &&
        field.category // Include category check here
    );
    
  if (!additionalFieldsFilled) {
    setError(true);
    setSuccessMessage(null);
    return;
  }

  // Generate subtypes based on additional fields and include category information
  const subtypes = generateSubtypes(formData.additionalFields);

  // Add subtypes property to each field in additionalFields
  const additionalFieldsWithSubtypes = formData.additionalFields.map((field, index) => ({
    ...field,
    subtypes: subtypes.filter((subtype) => subtype.type.startsWith(field.type)),
  }));

  // Include category information in the payload for each additional field
  const additionalFieldsWithCategory = additionalFieldsWithSubtypes.map((field, index) => ({
    ...field,
    // category: formData.propertyType, // Add category information
  }));

  // Prepare data for API submission
  const postData = {
    ...formData,
    userRef: currentUser._id,
    additionalFields: additionalFieldsWithCategory, // Include category information
  };

    try {
      setLoading(true);
  
      // Make API call to submit the data
      const response = await fetch('/api/property/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
  
      const data = await response.json();
  
      // Handle the response from the API
      console.log('API Response:', data);
  
      if (data.status) {
        // Set success message and reset form data
        alert('Form submitted successfully!');
        setFormData({
          propertyName: "",
          state: "",
          city: "",
          district: "",
          pin: "",
          desc: "",
          unitsAvailable: "",
          propertyType: "",
          minBookingAmount: "",
          features: "",
          imgUrls: [],
          additionalFields: [{ type: '', size: '', units: '', price: '' ,superbuiltup: '', builtup: '', carpetarea: '',category:''}],
        });
        setError(false); // Reset error state
      } else {
        // If the API call was not successful, display an error message
        setError(true);
        setSuccessMessage(null);
      }
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error('API Error:', error);
      setError(true);
      setSuccessMessage(null);
    } finally {
      setLoading(false);
    }
  };
  

  
  return (
    <div className="bg-gray-100 min-h-screen  flex items-center justify-center">
      <div className="mx-auto mt-8 p-8 grid  grid-cols-2 gap-8 w-fit bg-white rounded-lg shadow-md font-mono">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-4 font-mono  mx-auto"
        >
          {/* First Column */}
          <div className="mb-4">
            <label
              htmlFor="propertyName"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Name of the property
            </label>
            <input
              type="text"
              id="propertyName"
              name="propertyName"
              value={formData.propertyName}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
      <label
        htmlFor="type"
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        Type
      </label>
      <input
        type="text"
        id="type"
        name="type"
        value={formData.type}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        disabled // This disables the input field
      />
    </div>

          <div className="mb-4">
            <label
              htmlFor="state"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              State
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="city"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="district"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              District
            </label>
            <input
              type="text"
              id="district"
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Second Column */}
          <div className="mb-4">
            <label
              htmlFor="pin"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              PIN
            </label>
            <input
              type="text"
              id="pin"
              name="pin"
              value={formData.pin}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

        

          
         
        
              <div className="col-span-2">
                  {formData.additionalFields.map((field, index) => (
  <div className="mb-8 md:flex md:gap-5" key={index}>
    <div className="mb-4 md:w-1/5">
      <label htmlFor={`category${index}`} className="block text-gray-700 text-sm font-bold mb-2">
        Category
      </label>
      <select
        id={`category${index}`}
        name={`category${index}`}
        value={field.category}
        onChange={(e) => handleAdditionalFieldChange(index, "category", e)}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required
      >
        <option value="">Select Category</option>
        <option value="LAND">LAND</option>
        <option value="FLAT">FLAT</option>
        <option value="SHOP">SHOP</option>
      </select>
    </div>

    <div className="mb-4 md:w-1/5">
      <label htmlFor={`type${index}`} className="block text-gray-700 text-sm font-bold mb-2">
        Type
      </label>
      <input
        type="text"
        id={`type${index}`}
        name={`type${index}`}
        value={field.type}
        onChange={(e) => handleAdditionalFieldChange(index, "type", e)}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required
      />
    </div>

    <div className="mb-4 md:w-1/5">
      <label htmlFor={`units${index}`} className="block text-gray-700 text-sm font-bold mb-2">
        Units
      </label>
      <input
        type="text"
        id={`units${index}`}
        name={`units${index}`}
        value={field.units}
        onChange={(e) => handleAdditionalFieldChange(index, "units", e)}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required
      />
    </div>

    <div className="mb-4 md:w-1/6">
      <label htmlFor={`price${index}`} className="block text-gray-700 text-sm font-bold mb-2">
        Price
      </label>
      <input
        type="text"
        id={`price${index}`}
        name={`price${index}`}
        value={field.price}
        onChange={(e) => handleAdditionalFieldChange(index, "price", e)}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required
      />
    </div>

    <div className="mb-4 md:w-1/6">
      <label htmlFor={`size${index}`} className="block text-gray-700 text-sm font-bold mb-2">
        LandSize
      </label>
      <input
        type="text"
        id={`size${index}`}
        name={`size${index}`}
        value={field.size}
        onChange={(e) => handleAdditionalFieldChange(index, "size", e)}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>

    <div className="mb-4 md:w-1/5">
      <label htmlFor={`superbuiltup${index}`} className="block text-gray-700 text-sm font-bold mb-2">
        SuperBuiltUp
      </label>
      <input
        type="text"
        id={`superbuiltup${index}`}
        name={`superbuiltup${index}`}
        value={field.superbuiltup}
        onChange={(e) => handleAdditionalFieldChange(index, "superbuiltup", e)}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required
      />
    </div>

    <div className="mb-4 md:w-1/5 ml-2">
      <label htmlFor={`builtup${index}`} className="block text-gray-700 text-sm font-bold mb-2">
        BuiltUp
      </label>
      <input
        type="text"
        id={`builtup${index}`}
        name={`builtup${index}`}
        value={field.builtup}
        onChange={(e) => handleAdditionalFieldChange(index, "builtup", e)}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required
      />
    </div>

    <div className="mb-4 md:w-1/5">
      <label htmlFor={`carpetarea${index}`} className="block text-gray-700 text-sm font-bold mb-2">
        CarpetArea
      </label>
      <input
        type="text"
        id={`carpetarea${index}`}
        name={`carpetarea${index}`}
        value={field.carpetarea}
        onChange={(e) => handleAdditionalFieldChange(index, "carpetarea", e)}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required
      />
    </div>
  </div>
))}

      <div className="mb-4">
        <button
          type="button"
          onClick={handleAddMore}
          className="bg-green-500 text-white font-serif font-bold py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
        >
          Add More
        </button>
                </div>
                <div>
                  <div className="mb-4">
                    <label
                      htmlFor="minBookingAmount"
                      className="block text-sm font-medium text-gray-600"
                    >
                      Minimum Booking Amount
                    </label>
                    <input
                      type="text"
                      id="minBookingAmount"
                      name="minBookingAmount"
                      className="mt-1 p-2 w-full border rounded-md"
                      value={minBookingAmount}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
          

          {/* Features and Submit */}
          <div className="col-span-2 mb-4">
            <label
              htmlFor="features"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Features List
            </label>
            <textarea
              id="features"
              name="features"
              value={formData.features}
              onChange={handleFeaturesChange}
              placeholder="Enter features separated by new lines (e.g., Feature 1, Feature 2)"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="4"
              required
            ></textarea>
          </div>


          <div className="col-span-2 mb-4">
            <label
              htmlFor="features"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Description
            </label>

          <textarea
            type="text"
            placeholder="Description"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="4"
            id="desc"
            name="desc"
            required
            value={formData.desc}
            onChange={handleChange}
          />
           </div>

        </form>

        {/* Image Upload Section */}
       <div className="mb-4 p-6">
  <p className="font-semibold">
    Images:
    <span className="font-normal text-gray-600 ml-2">
      The first image will be the cover (max 6)
    </span>
  </p>
  <div className="flex flex-col md:flex-row gap-4">
    <input
      onChange={(e) => setFiles(e.target.files)}
      className="p-3 border border-gray-300 rounded w-full"
      type="file"
      id="images"
      accept="image/*"
      multiple
    />
    <button
      type="button"
      disabled={uploading}
      onClick={handleImageSubmit}
      className="p-3 text-green-700 border font-serif font-bold border-green-700 rounded uppercase hover:shadow-lg md:w-auto"
    >
      {uploading ? "Uploading..." : "Upload"}
    </button>
  </div>
  <div className="col-span-1 mb-4 text-center">
  <button
    type="submit"
    onClick={handleSubmit}
    className="bg-blue-500 text-white py-2 px-4 font-serif font-bold mt-4 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
  >
    {loading ? 'Submitting...' : 'Submit'}
  </button>
</div>
  <p className="text-red-700 text-sm">
    {imageUploadError && imageUploadError}
  </p>
  {formData.imgUrls.length > 0 &&
    formData.imgUrls.map((url, index) => (
      <div
        key={url}
        className="flex justify-between p-3 border items-center"
      >
        <img
          src={url}
          alt="listing image"
          className="w-20 h-20 object-contain rounded-lg"
        />
        <button
          type="button"
          onClick={() => handleRemoveImage(index)}
          className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75 font-serif font-bold"
        >
          Delete
        </button>
      </div>
    ))}
</div>

{error && (
  <div className="col-span-2 mb-4 text-center text-red-600 font-bold">
    Form submission failed. Please try again.
  </div>
)}
{/* {successMessage && (
  <div className="col-span-2 mb-4 text-center text-green-600 font-bold">
    {successMessage}
  </div>
)} */}





        </div>
      </div>
    
  );
}
