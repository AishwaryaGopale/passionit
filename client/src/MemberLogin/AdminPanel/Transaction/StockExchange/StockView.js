
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import * as API from "../../../../Endpoint/endpoint";

const StockView = () => {
  const [stock, setStock] = useState([]);
const {stockid}=useParams();

  // useEffect(() => {
  //   const stockid = sessionStorage.getItem("stockid");
  //   if (stockid) {
  //     GetStock(stockid);
  //   }
  // }, []);


  useEffect(() => {
    const getStockdata = () => {
      axios({
        url: API.GET_STOCK_BYID(stockid),
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        setStock(res.data[0]);
      }).catch((error) => {
        console.error('Error fetching transaction:', error);
      });
    };
    if (stockid) {
      getStockdata(stockid);
    }
  }, []);

  const navigate = useNavigate();

  const DeleteStock = (stockid) => {
    const deleteUrl = API.DELETE_STOCK_API(stockid);
    console.log('Deleting stock at:', deleteUrl); // Log the URL
    axios.delete(deleteUrl)
      .then((res) => {
        alert("Delete stock successfully");
        navigate("/admin/Stockexchange");
      })
      .catch((error) => {
        alert("Stock not deleted");
        console.error('Error details:', error.response ? error.response.data : error.message); // Log error details
      });
  }
  

  const GoBack=()=>{
    navigate("/admin/Stockexchange")
  }
  return (
<div className="py-16 bg-[#d6d6d5] h-full">
      <div className="container px-6 m-auto text-gray-500 md:px-12 xl:px-0">
        <div className="grid gap-6 mx-auto md:w-3/6 lg:w-full lg:grid-cols-1">
          <div className="bg-white rounded-2xl shadow-xl px-8 py-12 sm:px-12 lg:px-8">
            <div className="mb-12 space-y-4">
              {stock && (
                <div>
                  <h5 className="text-xl font-small text-red-700">Stock Id: {stock.stockid}</h5>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <div className="flex flex-col">
                      <span className="font-bold">Stock Exchange Type</span>
                      <span>{stock.stockexchange}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Face Value</span>
                      <span>{stock.facevalue}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Currency</span>
                      <span>{stock.currency}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center p-4">
                    <button
                      className="bg-red-500 text-white hover:bg-red-700 font-bold py-2 px-4 rounded-full"
                      onClick={() => DeleteStock(stock.stockid)}
                    >
                      Delete
                    </button>
                    <div className="flex items-center justify-center p-3">
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
                        onClick={GoBack}
                      >
                        &#8592; Go Back
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StockView
 

