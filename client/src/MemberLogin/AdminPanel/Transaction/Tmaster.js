import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as API from "./../../../Endpoint/endpoint";

const TransactionMaster = () => {
  const [records, setRecords] = useState([]); // Store fetched records
  const navigate = useNavigate();

  const GoBack = () => {
    navigate("/admin/transaction");
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios({
      url: API.GET_TMASTER_API,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        setRecords(res.data); // Update state with fetched records
      })
      .catch((err) => {
        alert("Failure: " + err);
      });
  };

  const DeleteTMaster = (tmasterid) => {
    axios({
      url: API.DELETE_TMASTER_API(tmasterid),
      method: 'DELETE',
    })
      .then((res) => {
        alert("Deleted transaction type successfully");
        getData(); // Refresh records after deletion
      })
      .catch((err) => {
        alert("Error: " + err);
      });
  };

  const ViewTMaster = (tmasterid) => {
    navigate(`/admin/Tmasterview/${tmasterid}`);
  };

  const AddRecords = () => {
    navigate("/admin/addmaster");
  };

  const UpdateTMaster = (tmasterid) => {
    navigate(`/admin/TmasterUpdate/${tmasterid}`);
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="w-3/4">    
        <h1 className="text-2xl font-bold mb-4 text-center">Transaction Type Master</h1>
        <div className='p-4'>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-full flex justify-center items-center mx-auto" onClick={AddRecords}>
            Add Records
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto mx-auto">
            <thead>
              <tr className="bg-red-500 hover:bg-red-700 text-white">
              <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Transaction Type</th>
                <th className="px-4 py-2">Percentage</th>
                <th className="px-4 py-2">Amount</th>
                 <th className="px-4 py-2">Stock Exchange Type</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map((t, index) => (
                <tr key={index} className="bg-gray-100 even:bg-gray-200">
                   <td className="border px-4 py-2">{t.tmasterid}</td>
                  <td className="border px-4 py-2">{t.transactiontype}</td>
                  <td className="border px-4 py-2">{t.percentage}</td>                 
                  <td className="border px-4 py-2">{t.amount}</td>
                  <td className="border px-4 py-2">{t.stockexchange}</td>

                  
                  <td className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">
                    <div className='inline pr-[3px]'>
                      <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-full" onClick={() => ViewTMaster(t.tmasterid)}>
                        View
                      </button>
                      <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full ml-1" onClick={() => DeleteTMaster(t.tmasterid)}>
                        Delete
                      </button>
                      <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full ml-1" onClick={() => UpdateTMaster(t.tmasterid)}>
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Button to add new records */}
        <div className="flex justify-end mt-4">
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={GoBack}
          >
            Go Back
          </button>
        </div>

      </div>
    </div>
  );
};

export default TransactionMaster;
