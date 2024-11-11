import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as API from "../../../Endpoint/endpoint";
  
const Groupmergetable = () => {
  useEffect(() => {
    GetData();
  }, []);
  const navigate = useNavigate();

  const [data, setData] = useState([]);

  const GetData = async () => {
    try {
      const response = await axios.get(API.ADD_MERGEDGROUP_API);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error
    }
  };

  const DeleteData = async (id) => {
    try {
      await axios.delete(API.DELETE_GROUPMERGE_API(id));
      console.log('Data deleted successfully');
      GetData(); // Refresh data after deletion
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };
  
  

const AddGroup = () => {
  navigate("/admin/groupmerge");
};
 
  return (
    <>
      <div className='bg-[#B5B5B5] h-[auto] pb-20 pt-10'>
      <div className='p-4'>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-full flex justify-center items-center mx-auto" onClick={AddGroup}>
                    Join Group
                </button>
            </div>
      
      <div className="max-w-5xl mx-auto pt-[30px] pb-[100px]">
        <div className="flex flex-col">
          <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700">
                  <thead className="bg-white">
                    <tr>
                    <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-center text-black uppercase dark:text-gray-400">
                        ID
                      </th>
                      <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-center text-black uppercase dark:text-gray-400">
                        Group Name
                      </th>
                      <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-center text-black uppercase dark:text-gray-400">
                      Merge group with
                      </th>
                      <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-start text-black uppercase dark:text-gray-400">
                      Owner name
                      </th>
                      <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-center text-black uppercase dark:text-gray-400">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className=" bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {data.map((d, k) => (
                      <tr key={k} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                         <td className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 dark:text-gray-400">{d.id}</td>
                        <td className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 dark:text-gray-400">{d.group_name}</td>
                        <td className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 dark:text-gray-400">{d.other_group_name}</td>
                        <td className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 dark:text-gray-400">{d.group_owner}</td>
                       
                        <td className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 dark:text-gray-400">
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full ml-1" onClick={() => DeleteData(d.id)}>Delete</button>

                        </td>
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
    </>
  );
};

export default Groupmergetable;
