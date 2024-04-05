import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Assuming you're using Axios for HTTP requests
import { useSelector } from 'react-redux';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase'

const ReferralsPage = () => {
  const [referralsData, setReferralsData] = useState([]);
  const [panFiles, setPanFiles] = useState([]);
  const [aadharFiles, setAadharFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [show, setShow] = useState(false);
  const [uploadingPan, setUploadingPan] = useState(false);
  const [uploadingAadhar, setUploadingAadhar] = useState(false);
  const [panUploadError, setPanUploadError] = useState(false);
  const [aadharUploadError, setAadharUploadError] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    alternativeContact: '',
    state: '',
    city: '',
    pin: '',
    district: '',
    pan: [],
    aadhar: [],
  });

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await axios.get(`/api/user/getRef/${currentUser._id}`);
        setReferralsData(response.data);
      } catch (error) {
        console.error('Error fetching referral data:', error);
      }
    };
  
    fetchReferrals();
  }, [currentUser._id]); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePanFileUpload = (e) => {
    const files = e.target.files;
    setPanFiles(files);
  };

  const handleAadharFileUpload = (e) => {
    const files = e.target.files;
    setAadharFiles(files);
  };

  const handlePanSubmit = () => {
    if (panFiles.length > 0 && panFiles.length + formData.pan.length < 2) {
      setUploadingPan(true);
      setPanUploadError(false);

      const promises = [];

      for (let i = 0; i < panFiles.length; i++) {
        promises.push(storePanFile(panFiles[i]));
      }
      
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            pan: formData.pan.concat(urls),
          });
          setPanUploadError(false);
          setUploadingPan(false);
        })
        .catch((err) => {
          setPanUploadError('File upload failed (2 MB max per file)');
          setUploadingPan(false);
        });
    } else {
      setPanUploadError('You can only upload 1 file');
      setUploadingPan(false);
    }
  };

  const handleAadharSubmit = () => {
    if (aadharFiles.length > 0 && aadharFiles.length + formData.aadhar.length < 2) {
      setUploadingAadhar(true);
      setAadharUploadError(false);

      const promises = [];

      for (let i = 0; i < aadharFiles.length; i++) {
        promises.push(storeAadharFile(aadharFiles[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            aadhar: formData.aadhar.concat(urls),
          });
          setAadharUploadError(false);
          setUploadingAadhar(false);
        })
        .catch((err) => {
          setAadharUploadError('File upload failed (2 MB max per file)');
          setUploadingAadhar(false);
        });
    } else {
      setAadharUploadError('You can only upload 1 file');
      setUploadingAadhar(false);
    }
  };















    const storePanFile = async (file) => {
      // Check file size
      const maxSize = 2 * 1024 * 1024; // 2 MB
      if (file.size > maxSize) {
        throw new Error('File size exceeds 2 MB limit');
      }
    
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Unsupported file type');
      }
    
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
    

    const storeAadharFile= async (file) => {
      // Check file size
      const maxSize = 2 * 1024 * 1024; // 2 MB
      if (file.size > maxSize) {
        throw new Error('File size exceeds 2 MB limit');
      }
    
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Unsupported file type');
      }
    
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
    















  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const postData = new FormData();
      
      // Include user reference in form data
      postData.append('userRef', currentUser._id);
      
      // // Append other form data
      // for (const key in formData) {
      //   postData.append(key, formData[key]);
      // }
  
      await axios.post('/api/user/addRefs', postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      alert('Form data saved successfully');
      console.log([...postData]); // Convert FormData to array to log its contents

      // Reset form data after successful submission
      setFormData({
        name: '',
        contactNumber: '',
        alternativeContact: '',
        state: '',
        city: '',
        pin: '',
        district: '',
        pan: [],
        aadhar: [],
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Server Error');
    }
  };




  const handleRemoveImage = (index) =>{
    setFormData({
      ...formData,
      pan: formData.pan.filter((_,i)=> i !== index),
    });
  };




  
 
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Referrals</h2>
      <div className="mb-4">
        <p className="text-lg font-semibold text-center">{currentUser.username}</p>
      </div>
    
     
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Sl No.</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Code</th>
              <th className="border border-gray-300 px-4 py-2">City</th>
              {/* <th className="border border-gray-300 px-4 py-2">Link</th> */}
              <th className="border border-gray-300 px-4 py-2">Status</th>
              {/* Add other table headers */}
            </tr>
          </thead>
          <tbody>
  {referralsData.map((referral, index) => (
    <tr key={referral.slno} className="text-gray-700">
      <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
      <td className="border border-gray-300 px-4 py-2">{referral.name}</td>
      <td className="border border-gray-300 px-4 py-2">{referral.code}</td>
      <td className="border border-gray-300 px-4 py-2">{referral.city}</td>
      {/* <td className="border border-gray-300 px-4 py-2">{referral.link}</td> */}
      <td className="border border-gray-300 px-4 py-2">{referral.status}</td>
      {/* Add other table data */}
    </tr>
  ))}
</tbody>

        </table>
      </div>


 <div className='mt-3'>
 <button onClick={() => setShow(true)} className="bg-blue-500 text-white py-2 px-4 rounded mb-4 ">
        Add New
      </button>
 </div>
      



      {show && (
        <div className="">
        <div className="bg-white shadow-md rounded-md p-6 mt-7">
            <h2 className="text-lg font-semibold mb-4 text-center ">Add New Referral</h2>
            <form onSubmit={handleSubmit}>
             
              <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label htmlFor="name" className="block font-medium">Name:</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="border border-gray-300 px-3 py-2 mt-1 rounded w-full" />
              </div>
              <div className="mb-4">
        <label htmlFor="contactNumber" className="block font-medium">Contact Number:</label>
        <input type="text" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} className="border border-gray-300 px-3 py-2 mt-1 rounded w-full" />
      </div>
      <div className="mb-4">
        <label htmlFor="alternativeContact" className="block font-medium">Alternative Contact Number:</label>
        <input type="text" id="alternativeContact" name="alternativeContact" value={formData.alternativeContact} onChange={handleInputChange} className="border border-gray-300 px-3 py-2 mt-1 rounded w-full" />
      </div>
      <div className="mb-4">
        <label htmlFor="state" className="block font-medium">State:</label>
        <input type="text" id="state" name="state" value={formData.state} onChange={handleInputChange} className="border border-gray-300 px-3 py-2 mt-1 rounded w-full" />
      </div>
      <div className="mb-4">
        <label htmlFor="city" className="block font-medium">City:</label>
        <input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} className="border border-gray-300 px-3 py-2 mt-1 rounded w-full" />
      </div>
      <div className="mb-4">
        <label htmlFor="pin" className="block font-medium">PIN:</label>
        <input type="text" id="pin" name="pin" value={formData.pin} onChange={handleInputChange} className="border border-gray-300 px-3 py-2 mt-1 rounded w-full" />
      </div>
      <div className="mb-4">
        <label htmlFor="district" className="block font-medium">District:</label>
        <input type="text" id="district" name="district" value={formData.district} onChange={handleInputChange} className="border border-gray-300 px-3 py-2 mt-1 rounded w-full" />
      </div>
    </div>
    <div className='flex flex-col flex-1 gap-4 sm:p-6'>
          <p className='font-semibold'>
            PAN:
            <span className='font-normal text-gray-600 ml-2'>
              Upload pan as jpeg or pdf
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e) => setPanFiles(e.target.files)}
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='pan'
              accept='image/*'
              
            />
            <button
              type='button'
              disabled={uploadingPan}
              onClick={handlePanSubmit}
              className='p-3 text-green-700 font-serif font-bold   border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className='text-red-700 text-sm'>
            {panUploadError && panUploadError}
          </p>
          {formData.pan.length > 0 && formData.pan.map((url, index) => (
            
  <div key={url} className='flex justify-between p-3 border items-center'>
{/*     
    {url.lastIndexOf('.pdf') ? (
      // Render PDF
      <embed src={url} type='application/pdf' width='200' height='200' />
    ) : ( */}
     
      <img src={url} alt='image' className='w-20 h-20 object-contain rounded-lg' />
    {/* )} */}
    <button
      type='button'
      onClick={() => handleRemoveImage(index)}
      className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
    >
      Delete
    </button>
  </div>
))}


<div className='flex flex-col flex-1 gap-4 sm:p-6'>
          <p className='font-semibold'>
            AADHAR:
            <span className='font-normal text-gray-600 ml-2'>
              Upload aadhar as jpeg or pdf
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e) => setAadharFiles(e.target.files)}
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='aadhar'
              accept='image/*'
              
            />
            <button
              type='button'
              disabled={uploadingAadhar}
              onClick={handleAadharSubmit}
              className='p-3 text-green-700 font-serif font-bold   border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {uploadingAadhar ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className='text-red-700 text-sm'>
            {aadharUploadError && aadharUploadError}
          </p>
          {formData.aadhar.length > 0 && formData.aadhar.map((url, index) => (
            
  <div key={url} className='flex justify-between p-3 border items-center'>
    
    {/* {url.lastIndexOf('.pdf') ? (
      // Render PDF
      <embed src={url} type='application/pdf' width='200' height='200' />
    ) : ( */}
      
      <img src={url} alt='image' className='w-20 h-20 object-contain rounded-lg' />
    {/* )} */}
    <button
      type='button'
      onClick={() => handleRemoveImage(index)}
      className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
    >
      Delete
    </button>
  </div>
))}

</div>














            </div>

              <div className="mb-4">
                {/* Add other form fields similarly */}
              </div>
              <div className="mb-4 justify-center text-center">
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Submit</button>
                <button onClick={() => setShow(false)} className="bg-red-700 text-white py-2 px-4 rounded ml-4">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}









    </div>
  );
};

export default ReferralsPage;
