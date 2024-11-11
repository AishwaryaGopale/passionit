import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as API from "./../../../../Endpoint/endpoint";

const AddRecords = () => {
  const [formData, setFormData] = useState({
    transactiontype: '', 
    percentage: '',
    amount: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddRecord = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await axios({
        url: API.POST_TMASTER_API,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: formData, // Sending the entire formData object
      });

      setMessage('Record added successfully!');
      // Reset form after successful submission
      setFormData({
        transactiontype: '', // Reset to the same name
        percentage: '',
        amount: ''
      });

      console.log("Record added:", response.data);
    } catch (error) {
      setMessage('Failed to add record: ' + error.message);
      console.error("Error adding record:", error);
    }
  };

  const GoBack = () => {
    navigate("/admin/transactionmaster");
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Add New Transaction Record</h2>
      {message && <p className="text-red-500 mb-4">{message}</p>}
      <form onSubmit={handleAddRecord} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Transaction Type</label>
          <input
            name="transactiontype" // Match the state property
            type="text"
            className="w-full border rounded p-2"
            value={formData.transactiontype} // Match the state property
            onChange={handleChange}
            required
            placeholder="Enter Transaction Type"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Percentage</label>
          <input
            name="percentage"
            type="text"
            className="w-full border rounded p-2"
            value={formData.percentage}
            onChange={handleChange}
            required
            placeholder="Enter Percentage"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Amount</label>
          <input
            name="amount"
            type="number"
            className="w-full border rounded p-2"
            value={formData.amount}
            onChange={handleChange}
            required
            placeholder="Enter Amount"
          />
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Record
          </button>

          <button
            type="button"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={GoBack}
          >
            Go Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRecords;
