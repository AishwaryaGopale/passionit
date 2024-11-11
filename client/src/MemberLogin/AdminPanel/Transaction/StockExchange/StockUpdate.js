import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import * as API from "../../../../Endpoint/endpoint";

const StockUpdate = () => {
  const [stock, setStock] = useState({
    stockexchange: '',
    facevalue: '',
    currency: ''
  });

  const { stockid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Stock ID:", stockid); // Debugging to check stockid
    fetchStockData();
  }, [stockid]);

  // Fetch stock data by ID
  const fetchStockData = async () => {
    try {
      const res = await axios.get(API.GET_STOCK_BYID(stockid), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setStock(res.data[0]);
    } catch (err) {
      alert("Error fetching stock data: " + err);
      console.error("Fetch error: ", err);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStock({ ...stock, [name]: value });
  };

  // Update stock data
  const UpdateStock = async (e) => {
    e.preventDefault();
    console.log("Updating stock with data: ", stock); // Debugging log
    try {
      const res = await axios.put(API.PUT_STOCK_API(stockid), stock, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      alert("Stock updated successfully");
      navigate('/admin/Stockexchange');
    } catch (err) {
      alert("Error updating stock: " + err);
      console.error("Update error: ", err);
    }
  };

  return (
    <div className='bg-[#B5B5B5] h-[auto] pb-20 pt-10'>
      <div className="max-w-4xl mx-auto pt-10">
        <form onSubmit={UpdateStock} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Exchange Type</label>
            <input
              type="text"
              name="stockexchange"
              value={stock.stockexchange}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Face Value</label>
            <input
              type="number"
              name="facevalue"
              value={stock.facevalue}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Currency</label>
            <input
              type="text"
              name="currency"
              value={stock.currency}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update Stock
            </button>

            <button
              type="button"
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"
              onClick={() => navigate("/admin/Stockexchange")}
            >
              Go Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockUpdate;
