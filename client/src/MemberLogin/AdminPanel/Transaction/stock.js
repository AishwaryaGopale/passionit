import React, { useEffect, useState } from "react";
import axios from "axios"; // Import Axios
import * as API from "./../../../Endpoint/endpoint";
import { useNavigate } from 'react-router-dom';

const initialState = {
  stockexchange: "",
  facevalue: "",
  currency: "",
  id: null,
};

const Stock = () => {
//   const userId = sessionStorage.getItem("user_id");
   const [stock, setStock] = useState([initialState]); // Initialize as an array

  const navigate = useNavigate();

  useEffect(() => {
    getData();
}, []);

const getData = () => {
    axios({
        url: API.GET_STOCK_API,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((res) => {
        setStock(res.data);
    }).catch((err) => {
        alert("Failure: " + err);
    });
};


  const DeleteStock = (stockid) => {
    console.log("Deleting stock with stockid:", stockid); 
    axios({
      url: API.DELETE_STOCK_API(stockid),
      method: 'delete',
    }).then((res) => {
      alert("Deleted stock successfully");
      navigate("/admin/Stockexchange");
    }).catch((err) => {
      alert("Stock not deleted");
    });
  };
  

  const ViewStock = (stockid) => {
    navigate(`/admin/Stockview/${stockid}`);
};

const UpdateStock = (stockid) => {
    navigate(`/admin/stockupdate/${stockid}`);
};

  const AddStocks = () => {
    navigate("/admin/addstock");
};

  const GoBack = () => {
    navigate("/admin/transaction");
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="w-3/4">
        <h1 className="text-2xl font-bold mb-4 text-center">Stock Exchange Master</h1>
        <div className="overflow-x-auto">

        <div className='p-4'>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-full flex justify-center items-center mx-auto" onClick={AddStocks}>
                    Add Stocks
                </button>
            </div>

          <table className="min-w-full table-auto mx-auto">
            <thead>
              <tr className="bg-red-500 hover:bg-red-700 text-white">
              <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Stock Exchange Type</th>
                <th className="px-4 py-2">Face Value</th>
                <th className="px-4 py-2">Currency</th>
                <th className="px-4 py-2"> Action </th>                                         
              </tr>
            </thead>
            <tbody>
  {stock.map((item, index) => (
    <tr key={index} className="bg-gray-100 even:bg-gray-200">
      <td className="border px-4 py-2">{item.stockid}</td>
      <td className="border px-4 py-2">{item.stockexchange}</td>  
      <td className="border px-4 py-2">{item.facevalue}</td>
      <td className="border px-4 py-2">{item.currency}</td>
      <td className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">
                                                        <div className='inline pr-[3px]'>
                                                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-full" onClick={() => ViewStock(item.stockid)}>
                                                                View
                                                            </button>
                                                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full ml-1" onClick={() => DeleteStock(item.stockid)}>
                                                                Delete
                                                            </button>
                                                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full ml-1" onClick={() => UpdateStock(item.stockid)}>
                                                                Edit
                                                            </button>
                                                        </div>
                                                    </td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
        <div className="flex justify-end mt-4">

          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"
            onClick={GoBack}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stock;
