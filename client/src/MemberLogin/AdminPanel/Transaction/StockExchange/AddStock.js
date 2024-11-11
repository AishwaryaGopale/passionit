import React, { useState } from "react";
import * as API from "./../../../../Endpoint/endpoint";
import { useNavigate } from 'react-router-dom';

const AddStock = () => {
  const [formData, setFormData] = useState({
    stockexchange: "",
    facevalue: "",
    currency: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API.POST_STOCK_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),  // Ensure formData contains 'stockexchange' and 'facevalue'
      });
  
      if (!response.ok) throw new Error("Stock submission failed.");
  
      const data = await response.json();
      setMessage("Stock saved successfully!");
  
      setFormData({  // Reset form after successful submission
        stockexchange: "",
        facevalue: "",
        currency: ""

      });
  
      console.log("Stock saved:", data);
    } catch (error) {
      setMessage("Error submitting stock: " + error.message);
      console.error("Error submitting stock:", error);
    }
  };
  
  const navigate = useNavigate();

  const GoBack = () => {
    navigate("/admin/StockExchange");
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Add Stock</h2>
      {message && <p className="text-red-500 mb-4">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block font-semibold mb-1">Exchange Type</label>
            <input
              name="stockexchange"
              type="text"
              className="w-full border rounded p-2"
              value={formData.stockexchange}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Face Value</label>
            <input
              name="facevalue"
              type="number"
              className="w-full border rounded p-2"
              value={formData.facevalue}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Currency</label>
            <input
              name="currency"
              type="number"
              className="w-full border rounded p-2"
              value={formData.currency}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Submit
        </button>

        <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"
            onClick={GoBack}
          >
            Go Back
          </button>

      </form>
    </div>
  );
};

export default AddStock;
