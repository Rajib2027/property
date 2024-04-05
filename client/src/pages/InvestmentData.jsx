import React, { useState, useEffect } from "react";



export default function InvestmentData() {
    const [investments, setInvestments] = useState([]);
    const [investorEmails, setInvestorEmails] = useState([]);
    const [loading, setLoading] = useState(false);
   

    useEffect(() => {
      // Fetch all investments from the backend API
      fetch('/api/investor/getAllInvestments')
        .then(response => response.json())
        .then(data => {
          if (data.success) { 
            setInvestments(data.investments);
          } else {
            console.error("Failed to fetch investments:", data.message);
          }
        })
        .catch(error => {
          console.error("Error fetching investments:", error.message);
        });
    }, []);
          
    const handleSendMail = async (investmentId) => {
      try {
        setLoading(true);
    
        const emailResponse = await fetch(`/api/investor/send/${investmentId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        const emailResult = await emailResponse.json();
        console.log(emailResult);
    
        if (emailResult.error) {
          console.error(`Failed to send email for investment ID ${investmentId}:`, emailResult.message);
        } else {
          // Introduce a delay to allow time for the UI to update
          setTimeout(() => {
            // Update the button text to 'Published' on success
            console.log('Updating button text to "Published"');
            const publishButton = document.getElementById(`publishButton_${investmentId}`);
            if (publishButton) {
              publishButton.innerText = 'Published';
              publishButton.disabled = true; // Disable the button
            }
          }, 100); // You can adjust the delay time as needed
        }
    
        return emailResult;
      } catch (error) {
        console.error('Error handling sending email:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    };

    

    return (
        <div className="container mx-auto mt-8 p-6 bg-gray-100 rounded-lg shadow-md">
          <h1 className="text-3xl font-semibold mb-4">Publish Investments</h1>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-3">Project Name</th>
                  <th className="border border-gray-300 p-3">State</th>
                  <th className="border border-gray-300 p-3">City</th>
                  <th className="border border-gray-300 p-3">Size</th>
                  <th className="border border-gray-300 p-3">Description</th>
                  <th className="border border-gray-300 p-3">Per Unit Value</th>
                  <th className="border border-gray-300 p-3">Min Increment Amount</th>
                  <th className="border border-gray-300 p-3">Number of Units</th>
                  <th className="border border-gray-300 p-3">Assured Return Value</th>
                  <th className="border border-gray-300 p-3">Lock-in Period</th>
                  <th className="border border-gray-300 p-3">Total Amount</th>
                  <th className="border border-gray-300 p-3">Circulate</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((investment, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-3 md:py-4">{investment.projectName}</td>
                    <td className="border border-gray-300 p-3 md:py-4">{investment.state}</td>
                    <td className="border border-gray-300 p-3 md:py-4">{investment.city}</td>
                    <td className="border border-gray-300 p-3 md:py-4">{investment.size}</td>
                    <td className="border border-gray-300 p-3 md:py-4">{investment.description}</td>
                    <td className="border border-gray-300 p-3 md:py-4">{investment.perUnitValue}</td>
                    <td className="border border-gray-300 p-3 md:py-4">{investment.minIncrementAmount}</td>
                    <td className="border border-gray-300 p-3 md:py-4">{investment.numOfUnits}</td>
                    <td className="border border-gray-300 p-3 md:py-4">{investment.assuredReturnValue}</td>
                    <td className="border border-gray-300 p-3 md:py-4">{investment.lockInPeriod}</td>
                    <td className="border border-gray-300 p-3 md:py-4">{investment.totalAmount}</td>
                    <td className="border border-gray-300 p-3 md:py-4">
                    <button
  id={`publishButton_${investment._id}`}
  className={`bg-blue-700 text-white p-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
  onClick={() => !loading && handleSendMail(investment._id)} // Disable click when loading
>
  {loading ? 'Publishing...' : (investment.status ? 'Published' : 'Publish')}
</button>


                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    };