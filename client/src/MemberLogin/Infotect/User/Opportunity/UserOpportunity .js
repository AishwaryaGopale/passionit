import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as API from "./../../../../Endpoint/endpoint";
import { useParams } from 'react-router-dom';

const UserOpportunity = () => {
  const [opportunities, setOpportunities] = useState([]);
  const  user_id =sessionStorage.getItem("user_id");

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await axios.get(API.GET_USEROPPORTUNITIES_API(user_id));
        setOpportunities(response.data);
      } catch (error) {
        console.error('Error fetching opportunities', error);
      }
    };

    fetchOpportunities();
  }, []);

  return (
    <div className="p-6">
         <div className='flex justify-center'>
        <h1 className='font-bold text-xl mx-auto pt-[3px]'>User Opportunity</h1>
    </div>
      <div className="max-w-7xl mx-auto pt-[30px]">
        <div className="flex flex-col">
          <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 table-fixed">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="py-3 px-6 text-xs font-bold tracking-wider text-center text-gray-700 uppercase">Member Name</th>
                      <th scope="col" className="py-3 px-6 text-xs font-bold tracking-wider text-center text-gray-700 uppercase">Phone Number</th>
                      <th scope="col" className="py-3 px-6 text-xs font-bold tracking-wider text-center text-gray-700 uppercase hidden lg:table-cell">Email</th>
                      <th scope="col" className="py-3 px-6 text-xs font-bold tracking-wider text-center text-gray-700 uppercase">Opportunity</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {opportunities.map((opportunity, index) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="py-3 px-6 text-xs font-medium text-center text-gray-500">{opportunity.interested_name}</td>
                        <td className="py-3 px-6 text-xs font-medium text-center text-gray-500">{opportunity.phonenumber}</td>
                        <td className="py-3 px-6 text-xs font-medium text-center text-gray-500 hidden lg:table-cell">{opportunity.email}</td>
                        <td className="py-3 px-6 text-xs font-medium text-center text-gray-500">{opportunity.opportunity_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOpportunity;
