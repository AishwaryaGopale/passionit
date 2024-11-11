
import React, { useState, useEffect } from "react";
import * as API from "./../../../../Endpoint/endpoint";

const Transaction = () => {
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [formData, setFormData] = useState({
    vouchercode: "",
    date: "",
    member_name: "",
    membercategory: "",
    membertype: "",
    designation: "",
    opportunity_name: "",
    opportunity_work_type: "",
    transactiontype: "",
    stockexchange: "",
    ordervalue: "",
    percentage: "",
    amount: "",
    referencemember: "",
    currency: "",
    creditdays: "",
    paymentstatus: "",
    bankname: "",
    accountholder: "",
    accountnum: "",
    ifsccode: ""
  });
  const [message, setMessage] = useState("");
  const userId = sessionStorage.getItem("user_id");
  
  // Fetch member data
  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const response = await fetch(API.GET_MEMBER_API(userId));
        if (!response.ok) throw new Error("Failed to fetch member data");

        const member = await response.json();
        setFormData(prevData => ({
          ...prevData,
          member_name: member.member_name,
          membercategory: member.membercategory,
          membertype: member.membertype,
        }));
      } catch (error) {
        setMessage("Error fetching member data: " + error.message);
        console.error("Error fetching member data:", error);
      }
    };

    fetchMemberData();
  }, [userId]);

  // Fetch opportunity data
  useEffect(() => {
    const fetchOpportunityData = async () => {
      try {
        const response = await fetch(API.GET_OPPORTUNITY_BYUSERSID(userId));
        if (!response.ok) throw new Error("Failed to fetch opportunity data");
  
        const opportunity = await response.json();
        setFormData(prevData => ({
          ...prevData,
          opportunity_name: opportunity.opportunity_name,
          opportunity_work_type: opportunity.opportunity_work_type,
          opp_id: opportunity.id
        }));
      } catch (error) {
        setMessage("Error fetching opportunity data: " + error.message);
        console.error("Error fetching opportunity data:", error);
      }
    };
  
    fetchOpportunityData();
  }, [userId]);

  // Fetch stock data
  const stockid = sessionStorage.getItem("stockid");
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(API.GET_STOCK_BYID(stockid));
        if (!response.ok) throw new Error("Failed to fetch stock data");

        const stock = await response.json();
        setFormData(prevData => ({
          ...prevData,
          stockexchange: stock.stockexchange,
        }));
      } catch (error) {
        setMessage("Error fetching stock data: " + error.message);
        console.error("Error fetching stock data:", error);
      }
    };

    if (stockid) {
      fetchStockData();
    }
  }, [stockid]);

 
// useEffect(() => {
  // const fetchTransactionData = async () => {
  //   if (formData.transactiontype) {
  //     try {
  //       const response = await fetch(API.GET_TRANSACTION_BYNAME(formData.transactiontype));
  //       if (!response.ok) throw new Error("Failed to fetch transaction data");

  //       const data = await response.json();
        
  //       // Check if data is returned and update the form fields based on the response
  //       if (data.length > 0) {
  //         const { percentage, amount, stockexchange } = data[0]; // Access the first item in the array
  //         setFormData(prevData => ({
  //           ...prevData,
  //           stockexchange,  // Update stockexchange
  //           percentage,     // Update percentage
  //           amount,         // Update amount
  //         }));
  //       }
  //     } catch (error) {
  //       setMessage("Error fetching transaction data: " + error.message);
  //       console.error("Error fetching transaction data:", error);
  //     }
  //   }
  // };

  // Inside the fetchTransactionData function
useEffect(() => {
  const fetchTransactionData = async () => {
    if (formData.transactiontype) {
      try {
        const response = await fetch(API.GET_TRANSACTION_BYNAME(formData.transactiontype));
        if (!response.ok) throw new Error("Failed to fetch transaction data");

        const data = await response.json();

       
        if (data.length > 0) {
          const { percentage, amount, stockexchange } = data[0]; 
          const calculatedToken = percentage ? (amount / percentage).toFixed(2) : 0; 

          setFormData(prevData => ({
            ...prevData,
            stockexchange,  
            percentage,    
            amount,        
            token: calculatedToken, 
          }));
        }
      } catch (error) {
        setMessage("Error fetching transaction data: " + error.message);
        console.error("Error fetching transaction data:", error);
      }
    }
  };

  fetchTransactionData();
}, [formData.transactiontype]); // Run when transactiontype changes


  

//   fetchTransactionData();
// }, [formData.transactiontype]); // Run when transactiontype changes




  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API.POST_TRANSACTION_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) throw new Error("Transaction submission failed.");
  
      const data = await response.json();
      setMessage("Transaction saved successfully!");
  
      // Reset form data after successful submission
      setFormData({
        vouchercode: "",
        date: "",
        member_name: "",
        membercategory: "",
        membertype: "",
        designation: "",
        stockexchange: "",
        transactiontype: "",
        opportunity_name: "",
        opportunity_work_type: "",
        ordervalue: "",
        percentage: "",
        amount: "",
        referencemember: "",
        currency: "",
        creditdays: "",
        paymentstatus: "",
        bankname: "",
        accountholder: "",
        accountnum: "",
        ifsccode: ""
      });
  
      console.log("Transaction saved:", data);
    } catch (error) {
      setMessage("Error submitting transaction: " + error.message);
      console.error("Error submitting transaction:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Transaction Form</h2>
      {message && <p className="text-red-500 mb-4">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Voucher Code</label>
            <input name="vouchercode" type="text" className="w-full border rounded p-2" onChange={handleChange} required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Date</label>
            <input name="date" type="date" className="w-full border rounded p-2" onChange={handleChange} required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Member Name</label>
            <input name="member_name" type="text" className="w-full border rounded p-2" value={formData.member_name} readOnly />
          </div>
          <div>
            <label className="block font-semibold mb-1">Member Category</label>
            <input name="membercategory" type="text" className="w-full border rounded p-2" value={formData.membercategory} readOnly />
          </div>
          <div>
            <label className="block font-semibold mb-1">Member Type</label>
            <input name="membertype" type="text" className="w-full border rounded p-2" value={formData.membertype} readOnly />
          </div>
          <div>
            <label className="block font-semibold mb-1">Designation</label>
            <input name="designation" type="text" className="w-full border rounded p-2" onChange={handleChange} required />
          </div>

          <div>
            <label className="block font-semibold mb-1">Opportunity Name</label>
            <input name="opportunity_name" type="text" className="w-full border rounded p-2" value={formData.opportunity_name} readOnly />
          </div>
          <div>
            <label className="block font-semibold mb-1">Opportunity Type</label>
            <input name="opportunity_work_type" type="text" className="w-full border rounded p-2" value={formData.opportunity_work_type} readOnly />
          </div>

          <div>
            <label className="block font-semibold mb-1">Transaction Type</label>
            <select name="transactiontype" className="w-full border rounded p-2" onChange={handleChange} required>
              <option value="">Select Type</option>
              <option value="Referral">Referral</option>
              <option value="Project">Project</option>
              <option value="Product">Product Sale</option>
              <option value="Placement">Placement</option>
              <option value="Mentoring">Mentoring</option>
              <option value="Research">Research Royalty</option>
              <option value="Audit">Audit</option>
            </select>
          </div>

          <div>
  <label className="block font-semibold mb-1">Stock Exchange Type</label>
  <input 
    name="stockexchange" 
    type="text" 
    className="w-full border rounded p-2" 
    value={formData.stockexchange} 
    readOnly // If you want it to be read-only
  />
</div>
<div>
  <label className="block font-semibold mb-1">Percentage</label>
  <input 
    name="percentage" 
    type="number" 
    className="w-full border rounded p-2" 
    value={formData.percentage} 
    readOnly // If you want it to be read-only
  />
</div>
<div>
  <label className="block font-semibold mb-1">Amount</label>
  <input 
    name="amount" 
    type="number" 
    className="w-full border rounded p-2" 
    value={formData.amount} 
    readOnly // If you want it to be read-only
  />
</div>

<div>
  <label className="block font-semibold mb-1">Token</label>
  <input 
    name="token" 
    type="number" 
    className="w-full border rounded p-2" 
    value={formData.token || ''} // Make sure to read from formData.token
    readOnly // If you want it to be read-only
  />
</div>


<div>
            <label className="block font-semibold mb-1">Order Value</label>
            <input name="ordervalue" type="number" className="w-full border rounded p-2" onChange={handleChange} required />
          </div>

          <div>
            <label className="block font-semibold mb-1">Reference Member</label>
            <input name="referencemember" type="text" className="w-full border rounded p-2" onChange={handleChange} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Currency</label>
            <input name="currency" type="text" className="w-full border rounded p-2" onChange={handleChange} required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Credit Days</label>
            <input name="creditdays" type="number" className="w-full border rounded p-2" onChange={handleChange} required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Payment Status</label>
            <select name="transactiontype" className="w-full border rounded p-2" onChange={handleChange} required>
              <option value="">Select Type</option>
              <option value="Placement">Paid</option>
              <option value="Mentoring">Pending</option>
              <option value="Research">Unpaid</option>
            </select>
          </div>


          <div className="col-span-2">
            <button type="button" className="bg-blue-500 text-white py-2 px-4 rounded" onClick={() => setShowAccountDetails(!showAccountDetails)}>
              {showAccountDetails ? "Hide Account Details" : "Show Account Details"}
            </button>
          </div>
        </div>

        {showAccountDetails && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Account Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Bank Name</label>
                <input name="bankname" type="text" className="w-full border rounded p-2" onChange={handleChange} required />
              </div>
              <div>
                <label className="block font-semibold mb-1">Account Holder</label>
                <input name="accountholder" type="text" className="w-full border rounded p-2" onChange={handleChange} required />
              </div>
              <div>
                <label className="block font-semibold mb-1">Account Number</label>
                <input name="accountnum" type="text" className="w-full border rounded p-2" onChange={handleChange} required />
              </div>
              <div>
                <label className="block font-semibold mb-1">IFSC Code</label>
                <input name="ifsccode" type="text" className="w-full border rounded p-2" onChange={handleChange} required />
              </div>
            </div>
          </div>
        )}

        <div className="mt-4">
          <button type="submit" className="bg-red-500 text-white py-2 px-4 rounded">Submit Transaction</button>
        </div>
      </form>
    </div>
  );
};

export default Transaction;
