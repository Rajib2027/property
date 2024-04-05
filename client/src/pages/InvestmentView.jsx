
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";



export default function InvestmentView() {

    const [formData, setFormData] = useState({
        totalAmount:"",
        numOfUnits: "",        
      });    
    const { investmentId } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [investor, setInvestor] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const {currentUser} =useSelector(state=>state.user)
    const [isSaved, setIsSaved] = useState(false);




    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedFormData = { ...formData, [name]: value };
    
        // Calculate Total Amount if both Per Unit Value and Number of Units are present
        if (name === 'numOfUnits') {
            const perUnitValue = investor.perUnitValue !== '' ? parseFloat(investor.perUnitValue) : 0;
            const numOfUnits = updatedFormData.numOfUnits !== '' ? parseInt(updatedFormData.numOfUnits) : 0;
            updatedFormData = { ...updatedFormData, totalAmount: (perUnitValue * numOfUnits).toString() };
        }
    
        setFormData(updatedFormData);
    };
    










    useEffect(() => {
      const fetchInvestor = async () => {
        try {
          setLoading(true);
          const res = await fetch(`/api/investor/get/${investmentId}`);
          const data = await res.json();
          if (data.success === false) {
            setError(true);
            setLoading(false);
            return;
          }
          setInvestor(data);
          setLoading(false);
          setError(false);
        } catch (error) {
          setError(true);
          setLoading(false);
        }
      };
      fetchInvestor();
    }, [investmentId]);
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>Error fetching data!</div>;
    }
  
    if (!investor) {
      return <div>No data available for the specified investment ID.</div>;
    }





    const handleSave = async () => {
      try {
        const updatedInvestor = {
          ...investor,
          numOfUnits: formData.numOfUnits,
          totalAmount: formData.totalAmount,
          userRef: currentUser._id, // Include userRef in the request body
        };
    
        const res = await axios.post('/api/investor/save', updatedInvestor);
    
        if (res.data.success) {
          setSuccessMessage(res.data.message); // Use the server message
          setErrorMessage(null);
          setFormData({
            totalAmount:"",
            numOfUnits: "",        
          });    
          setIsSaved(true);
          // Update UI or perform any other actions if needed
    
        } else {
          setErrorMessage(res.data.message);
          setSuccessMessage(null);
        }
      } catch (error) {
        setSuccessMessage(null);
        setErrorMessage("All ready saved your info");
      }
    };
    









  return (
    <div className="flex items-center justify-center  font-mono min-h-screen">
  <div className="bg-gray-100 p-6 rounded-lg shadow-md " style={{width:"850px"}}>
    {/* Existing property details */}
    <div className="mb-6">
      <h1 className="text-4xl font-semibold mb-2 text-center text-blue-600">
        Investment Details
      </h1>
    </div>
    <div className="mb-2">
      <p className="text-gray-600">
        <span className="font-bold">Project Name:</span> {investor.projectName}
      </p>
    </div>
    <div className="mb-2">
      <p className="text-gray-600">
        <span className="font-bold">Description:</span> {investor.description}
      </p>
    </div>
    <div className="mb-2">
      <p className="text-gray-600">
        <span className="font-bold">Per Unit Value:</span> ${investor.perUnitValue}
      </p>
    </div>
    <div className="mb-2">
      <p className="text-gray-600">
        <span className="font-bold">Size:</span> {investor.size} sqm
      </p>
    </div>
    <div className="mb-2">
      <p className="text-gray-600">
        <span className="font-bold">Location:</span> {investor.city}, {investor.state}
      </p>
    </div>
    <div className="mb-2">
      <p className="text-gray-600">
        <span className="font-bold">Assured Return Value:</span> {investor.assuredReturnValue}
      </p>
    </div>
    <div className="mb-2">
      <p className="text-gray-600">
        <span className="font-bold">Lock-in Period:</span> {investor.lockInPeriod}
      </p>
    </div>



    <div className="mb-2 w-80">
              <label className="block text-gray-600 text-sm font-bold mb-2 " htmlFor="numOfUnits">
                Number of Units
              </label>
              <input
                type="text"
                id="numOfUnits"
                name="numOfUnits"
                value={formData.numOfUnits}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-300 bg-white text-gray-800"
              />
            </div>

            <div className="mb-2 w-80">
    <label className="block text-gray-600 text-sm font-bold mb-2" htmlFor="totalAmount">
      Total Amount
    </label>
    <div className="w-full border border-gray-300 p-2 rounded bg-white text-gray-800">
      {investor.perUnitValue !== '' && formData.numOfUnits !== '' ?
        (parseFloat(investor.perUnitValue) * parseInt(formData.numOfUnits)).toString() :
        '0'
      }
    </div>
  </div>
<div className="text-center">
<button
  onClick={handleSave}
  className={`bg-blue-500 text-white font-bold font-sans justify-center p-2 rounded hover:bg-blue-600 focus:outline-none ${isSaved ? 'cursor-not-allowed opacity-50' : ''}`}
  disabled={isSaved}
>
  {isSaved ? 'Submitted' : 'Submit'}
</button>
</div>
 
{successMessage && (
  <div className="text-green-600">
    {successMessage}
  </div>
)}

{errorMessage && (
  <div className="text-red-600">
    {errorMessage}
  </div>
)}

  </div>
</div>

  )}  