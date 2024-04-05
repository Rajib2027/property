import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";



export default function SeekInvestment() {
    const [formData, setFormData] = useState({
        projectName: "",
        state: "",
        city: "",

        pin: "",
        size: "",
        description: "",
        perUnitValue: "",
        totalAmount:"",
        minIncrementAmount: "",
        numOfUnits: "",        
        assuredReturnValue: "",
        lockInPeriod: "",
      });            
      const [isDraftSaved, setIsDraftSaved] = useState(false);
      const [isFormSubmitted, setIsFormSubmitted] = useState(false);
     
      const { projectId } = useParams();
      const [draft, setDraft] = useState(null);
  
      const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedFormData = { ...formData, [name]: value };
      
        // Calculate Total Amount if both Per Unit Value and Number of Units are present
        if (name === 'perUnitValue' || name === 'numOfUnits') {
          const perUnitValue = updatedFormData.perUnitValue !== '' ? parseFloat(updatedFormData.perUnitValue) : 0;
          const numOfUnits = updatedFormData.numOfUnits !== '' ? parseInt(updatedFormData.numOfUnits) : 0;
          updatedFormData = { ...updatedFormData, totalAmount: (perUnitValue * numOfUnits).toString() };
        }
      
        setFormData(updatedFormData);
      };
      const handleSubmit = (e) => {
        e.preventDefault();
      
        // Assuming you have an API endpoint for submitting the form data
        fetch('/api/investor/createInvestment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to submit form. Server response: ${response.statusText}`);
          }
          console.log('Form submitted successfully:', formData);
      
          // Reset the form data
          setFormData({
            projectId: "",
            projectName: "",
            state: "",
            city: "",
            district: "",
            pin: "",
            size: "",
            description: "",
            perUnitValue: "",
            totalAmount: "",
            minIncrementAmount: "",
            numOfUnits: "",
            assuredReturnValue: "",
            lockInPeriod: "",
          });
      
          // Optionally, you can set a state variable to show a success message
          setIsFormSubmitted(true);
      // Delete draft if present
      if (draft) {
        fetch(`/api/investor/deleteDraft/${projectId}`, {
          method: 'DELETE',
        })
          .then(deleteResponse => {
            if (!deleteResponse.ok) {
              throw new Error(`Failed to delete draft. Server response: ${deleteResponse.statusText}`);
            }
            console.log('Draft deleted successfully:', draft);
          })
          .catch(deleteError => {
            console.error('Error deleting draft:', deleteError.message);
          });
      }

      // Optionally, you can redirect the user after successful submission
      // window.location.href = '/success-page';
    })
    .catch(error => {
      console.error('Error submitting form:', error.message);
    });
};

     useEffect(() => {
  const fetchDraft = async () => {
    try {
      const response = await fetch(`/api/investor/draft/${projectId}`);
      const data = await response.json();

      if (data.success && data.draft) {
        // Directly initialize formData with draft values
        setFormData({
          ...formData,
          ...data.draft,
        });

        setDraft(data.draft);
      } else {
        console.error("Draft data not available:", data);
      }
    } catch (error) {
      console.error("Error fetching draft:", error.message);
    }
  };

  fetchDraft();
}, [projectId]);

    
      const handleSaveDraft = () => {
        fetch('/api/investor/draft', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to save draft. Server response: ${response.statusText}`);
          }
          console.log('Form saved as draft:', formData);
          setIsDraftSaved(true); // Add this line
        })
        .catch(error => {
          console.error('Error saving draft:', error.message);
        });
      };
      
      console.log("Draft:", draft);
      console.log("Draft Project Name:", draft && draft.projectName);
      
      return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-gray-100 font-mono rounded-md shadow-md">
          <h2 className="text-3xl font-extrabold text-center font-serif mb-6">Seek Investment</h2>
      
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
         
      
            <div className="mb-4">
              <label className="block  text-sm font-bold mb-2" htmlFor="projectName">
                Project Name
              </label>
              <input
      type="text"
      id="projectName"
      name="projectName"
      value={formData.projectName}   
      onChange={handleChange}
      className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-300 bg-white text-gray-800"
    />


            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="state">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-300 bg-white text-gray-800"
              />
            </div>
          </div>
      
          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="city">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-300 bg-white text-gray-800"
              />
            </div>
           
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="pin">
                Pin
              </label>
              <input
                type="text"
                id="pin"
                name="pin"
                value={formData.pin}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-300 bg-white text-gray-800"
              />
            </div>
          
          </div>
      
          {/* Row 3 */}
        
      
           
         
      
          {/* Row 4 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="size">
                Size
              </label>
              <input
                type="text"
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-300 bg-white text-gray-800"
              />
            </div>
      
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded resize-none focus:outline-none focus:border-blue-300 bg-white text-gray-800"
              ></textarea>
            </div>
          </div>
      
          {/* Row 5 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="perUnitValue">
                Per Unit Value
              </label>
              <input
                type="text"
                id="perUnitValue"
                name="perUnitValue"
                value={formData.perUnitValue}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-300 bg-white text-gray-800"
              />
            </div>
      
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="minIncrementAmount">
                Minimum Increment Amount
              </label>
              <input
                type="text"
                id="minIncrementAmount"
                name="minIncrementAmount"
                value={formData.minIncrementAmount}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-300 bg-white text-gray-800"
              />
            </div>
          </div>
      
          {/* Row 6 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="numOfUnits">
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
      
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="assuredReturnValue">
                Assured Return Value
              </label>
              <input
                type="text"
                id="assuredReturnValue"
                name="assuredReturnValue"
                value={formData.assuredReturnValue}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-300 bg-white text-gray-800"
              />
            </div>
          </div>
      
          {/* Row 7 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="lockInPeriod">
                Lock-in Period
              </label>
              <input
                type="text"
                id="lockInPeriod"
                name="lockInPeriod"
                value={formData.lockInPeriod}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-300 bg-white text-gray-800"
              />
            </div>
            <div className="mb-4">
    <label className="block text-sm font-bold mb-2" htmlFor="totalAmount">
      Total Amount
    </label>
    <div className="w-full border border-gray-300 p-2 rounded bg-white text-gray-800">
      {formData.perUnitValue !== '' && formData.numOfUnits !== '' ?
        (parseFloat(formData.perUnitValue) * parseInt(formData.numOfUnits)).toString() :
        '0'
      }
    </div>
  </div>
          </div>
          <div className="col-span-2 mt-6 grid grid-cols-2 gap-4">
        <div>
          <button
            type="button"
            onClick={handleSaveDraft}
            className="w-full bg-gray-400 font-serif font-bold text-white py-3 rounded-md hover:bg-gray-500 focus:outline-none transition duration-300"
          >
            Save as Draft
          </button>
        </div>

      
           <div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-blue-600 font-serif font-bold text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none transition duration-300"
          >
            Submit
          </button>
        </div>
      </div>
       {/* Success message */}
      {isDraftSaved && (
        <div className="mt-4 text-green-500 font-bold">
          Draft successfully saved!
        </div>
      )}
    </div>     
      );
      }   