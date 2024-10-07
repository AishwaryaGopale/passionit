import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as API from "./../../../../Endpoint/endpoint";

const ViewAllOpportunity = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(API.GET_OPPORTUNITIES_API); // Replace with your actual API endpoint
            setData(response.data);
        } catch (err) {
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
              <div className='flex justify-center'>
        <h1 className='font-bold text-xl mx-auto pt-[3px]'>All Opportunity</h1>
          </div>
            {loading && <p className="text-blue-500">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {data.length > 0 && (
                <div className="mt-4">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border-b border-gray-300 text-left">ID</th>
                                <th className="px-4 py-2 border-b border-gray-300 text-left">Name</th>
                                <th className="px-4 py-2 border-b border-gray-300 text-left">Description</th>
                                <th className="px-4 py-2 border-b border-gray-300 text-left">Provider</th>
                                {/* Add more headers as needed */}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(item => (
                                <tr key={item.id} className="hover:bg-gray-100">
                                    <td className="px-4 py-2 border-b border-gray-300">{item.id}</td>
                                    <td className="px-4 py-2 border-b border-gray-300">{item.opportunity_name}</td>
                                    <td className="px-4 py-2 border-b border-gray-300">{item.opportunity_description}</td>
                                    {/* Add more cells as needed */}
                                    <td className="px-4 py-2 border-b border-gray-300">{item.opportunity_provider}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ViewAllOpportunity;
