import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import * as API from './../../../../Endpoint/endpoint';

const TMasterUpdate = () => {
    const [tmaster, settmaster] = useState({
        tmasterid: '',
        transactiontype: '',
        percentage: '',
        amount: ''
    });

    const navigate = useNavigate();
    const {tmasterid} =useParams();
    useEffect(() => {
        fetchTmasterData();
    }, []);

    const fetchTmasterData = () => {
        axios({
            url: API.GET_TMASTER_BYID(tmasterid),
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => {
            settmaster(res.data[0]);
        }).catch((err) => {
            alert("Error fetching master data: " + err);
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        settmaster({ ...tmaster, [name]: value });
    };

    const UpdateTMaster = (e) => {
        e.preventDefault();
        console.log('Updating TMaster with data: ', tmaster); // Debugging the data
        axios({
            url: API.PUT_TMASTER_API(tmasterid),
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            data: tmaster
        })
        .then((res) => {
            alert("Records updated successfully");
            navigate('/admin/transactionmaster');
        })
        .catch((err) => {
            console.log("Error: ", err); // Log error for debugging
            alert("Error updating transaction records: " + err);
        });
    };
    
    const GoBack = () => {
        navigate("/admin/transactionmaster");
    };

    return (
        <div className='bg-[#B5B5B5] h-[auto] pb-20 pt-10'>
            <div className="max-w-4xl mx-auto pt-10">
                <form onSubmit={UpdateTMaster} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                   
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Transaction Type</label>
                        <input 
                            type="text"
                            name="transactiontype"
                            value={tmaster.transactiontype}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Percentage</label>
                        <input
                            type="percentage"
                            name="percentage"
                            value={tmaster.percentage}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Amount</label>
                        <input
                            type="text"
                            name="amount"
                            value={tmaster.amount}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Stock Exchange Type</label>
                        <input
                            type="text"
                            name="stockexchange"
                            value={tmaster.stockexchange}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Update Records
                        </button>

                        <div className="mt-6">
                <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => GoBack()}
                >
                    Go Back
                </button>
            </div>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default TMasterUpdate;

