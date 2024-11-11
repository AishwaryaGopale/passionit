import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import * as API from "../../../../Endpoint/endpoint";

const TMasterView = () => {
  const [tmaster, settmaster] = useState();
  const {tmasterid}=useParams();
 
  useEffect(() => {
    const getTmasterdata = () => {
      axios({
        url: API.GET_TMASTER_BYID(tmasterid),
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        settmaster(res.data[0]);
      }).catch((error) => {
        console.error('Error fetching transaction:', error);
      });
    };
    if (tmasterid) {
      getTmasterdata(tmasterid);
    }
  }, []);

  const navigate = useNavigate();

  const deleteTmaster = (tmasterid) => {
    const deleteUrl = API.DELETE_TMASTER_API(tmasterid);
    console.log('Deleting records at:', deleteUrl); // Log the URL
    axios.delete(deleteUrl)
      .then((res) => {
        alert("Delete stock successfully");
        navigate("/admin/transactionmaster");
      })
      .catch((error) => {
        alert("records not deleted");
        console.error('Error details:', error.response ? error.response.data : error.message); // Log error details
      });
  }

  const goBack = () => {
    navigate("/admin/transactionmaster");
  };

  return (
    <div className="py-16 bg-[#d6d6d5] h-full">
      <div className="container px-6 m-auto text-gray-500 md:px-12 xl:px-0">
        <div className="grid gap-6 mx-auto md:w-3/6 lg:w-full lg:grid-cols-1">
          <div className="bg-white rounded-2xl shadow-xl px-8 py-12 sm:px-12 lg:px-8">
            <div className="mb-12 space-y-4">
              {tmaster && (
                <div>
                  <h5 className="text-xl font-small text-red-700">TMaster Id: {tmaster.tmasterid}</h5>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <div className="flex flex-col">
                      <span className="font-bold">Transaction Type</span>
                      <span>{tmaster.transactiontype}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Percentage</span>
                      <span>{tmaster.percentage}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Amount</span>
                      <span>{tmaster.amount}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Stock Exchange Type</span>
                      <span>{tmaster.stockexchange}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center p-4">
                    <button
                      className="bg-red-500 text-white hover:bg-red-700 font-bold py-2 px-4 rounded-full"
                      onClick={() => deleteTmaster(tmaster.tmasterid)}
                    >
                      Delete
                    </button>
                    <div className="flex items-center justify-center p-3">
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
                        onClick={goBack}
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
  );
};

export default TMasterView;
