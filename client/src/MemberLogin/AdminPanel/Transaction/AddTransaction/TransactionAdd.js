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
  const [message, setMessage] = useState("");
const userId= sessionStorage.getItem("user_id")
  // Assuming memberId is obtained from somewhere (e.g., route params or state)
 console.log("console log", userId)
  
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

  // Fetch Opportunity Data
  useEffect(() => {
    const fetchOpportunityData = async () => {
      try {
        const response = await fetch(API.GET_OPPORTUNITY_BYUSERSID(userId)); // Pass the opportunity id
        if (!response.ok) throw new Error("Failed to fetch opportunity data");
  
        const opportunity = await response.json();
        setFormData(prevData => ({
          ...prevData,
          opportunity_name: opportunity.opportunity_name,
          opportunity_work_type: opportunity.opportunity_work_type,
          opp_id:opportunity.id
        }));
      } catch (error) {
        setMessage("Error fetching opportunity data: " + error.message);
        console.error("Error fetching opportunity data:", error);
      }
    };
  
    fetchOpportunityData();
  }, [userId]);
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch(API.POST_TRANSACTION_API, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(formData),
  //     });

  //     if (!response.ok) throw new Error("Transaction submission failed.");

  //     const data = await response.json();
  //     setMessage("Transaction saved successfully!");
  //     console.log("Transaction saved:", data);
  //   } catch (error) {
  //     setMessage("Error submitting transaction: " + error.message);
  //     console.error("Error submitting transaction:", error);
  //   }
  // };
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
            <label className="block font-semibold mb-1">Transaction Type</label>
            <select name="transactiontype" className="w-full border rounded p-2" onChange={handleChange} required>
              <option value="">Select Type</option>
              <option value="referral">Referral</option>
              <option value="project">Project</option>
              <option value="product">Product Sale</option>
              <option value="placement">Placement</option>
              <option value="mentoring">Mentoring</option>
              <option value="research">Research Royalty</option>
              <option value="audit">Audit</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Opportunity Name</label>
            <input name="opportunity_name" type="text" className="w-full border rounded p-2" value={formData.opportunity_name} onChange={handleChange} required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Opportunity Type</label>
            <input name="opportunity_work_type" type="text" className="w-full border rounded p-2" value={formData.opportunity_work_type} onChange={handleChange} required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Order Value</label>
            <input name="ordervalue" type="text" className="w-full border rounded p-2" onChange={handleChange} required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Percentage</label>
            <input name="percentage" type="text" className="w-full border rounded p-2" onChange={handleChange} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Amount</label>
            <input name="amount" type="text" className="w-full border rounded p-2" onChange={handleChange} required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Reference Member</label>
            <input name="referencemember" type="text" className="w-full border rounded p-2" onChange={handleChange} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Currency</label>
            <input name="currency" type="text" className="w-full border rounded p-2" onChange={handleChange} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Credit Days</label>
            <input name="creditdays" type="text" className="w-full border rounded p-2" onChange={handleChange} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Payment Status</label>
            <select name="paymentstatus" className="w-full border rounded p-2" onChange={handleChange} required>
              <option value="">Select Status</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowAccountDetails(!showAccountDetails)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Cheque
          </button>
        </div>

        {showAccountDetails && (
          <div className="mt-4">
            <h3 className="text-xl font-bold mb-2">Account Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Bank and Branch</label>
                <input name="bankname" type="text" className="w-full border rounded p-2" onChange={handleChange} />
              </div>
              <div>
                <label className="block font-semibold mb-1">Account Holder Name</label>
                <input name="accountholder" type="text" className="w-full border rounded p-2" onChange={handleChange} />
              </div>
              <div>
                <label className="block font-semibold mb-1">Account Number</label>
                <input name="accountnum" type="text" className="w-full border rounded p-2" onChange={handleChange} />
              </div>
              <div>
                <label className="block font-semibold mb-1">IFSC Code</label>
                <input name="ifsccode" type="text" className="w-full border rounded p-2" onChange={handleChange} />
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="mt-6 bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded "
        >
          Submit 
        </button>
      </form>
    </div>
  );
};

export default Transaction;
