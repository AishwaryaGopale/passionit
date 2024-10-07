import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate,useLocation,useParams } from 'react-router-dom';
import * as API from "./../../../../Endpoint/endpoint";

const EolDataView = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    // const [member, setMemberid] = useState([]);
    useEffect(() => {
        getData();
    }, []);
    const location = useLocation();
    const { userId } = useParams();  // Access the state data
    console.log(userId);
    const getData = async () => {
    try {
        
        // setMemberid(id);
        const response = await axios.get(API.GET_INTERESTEDPEOPLE_API(userId));
        // const response = await axios.get(API.POST_INTERESTEDPEOPLE_API);
        console.log('Fetched data:', response.data);
        setData(response.data.map(item => ({ ...item, selectedOption: null })));
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};


    const deleteData = async (id) => {
        try {
            await axios.delete(API.DELETE_INTERESTED_API);
            alert("Deleted successfully");
            getData();
        } catch (error) {
            alert("Failed to delete");
            console.error("Delete error:", error);
        }
    };

    const viewMember = (id) => {
        sessionStorage.setItem("member_id", id);
        navigate("/admin/viewmember");
    };

    const handleCheckboxChange = (index, option, id, opportunityName, interestedName, phoneNumber) => {
        const newData = [...data];
        newData[index].selectedOption = option;
        setData(newData);

        if (option === "Yes") {
            const payload = {
                selection_status: "yes",
                applicant_name: interestedName,
                opportunity_name: opportunityName,
                phonenumber: phoneNumber,
                opportunity_id: id,
                flag: true,
                memberid: sessionStorage.getItem("user_id"),
            };
             
            axios.post(API.POST_EOLDATAVIEW_API, payload)
                .then((res) => {
                    alert("hello");
                })
                .catch((err) => {
                    alert("Error occurred while processing request.");
                });
        } else if (option === "No") {
            const payload = {
                selection_status: "No",
                applicant_name: interestedName,
                opportunity_name: opportunityName,
                phonenumber: phoneNumber,
                opportunity_id: id,
                flag: false,
                member_id:sessionStorage.getItem("user_id"),
            };
            console.log(payload);
            axios.post(API.POST_EOLDATAVIEW_API, payload)
                .then((res) => {
                    alert("hello");
                })
                .catch((err) => {
                    alert("Error occurred while processing request.");
                });
        }
    };
    const Goback = () => {
        navigate("/user/oppo");
    }

    return (
        <>
        <div className='flex justify-center'>
        <h1 className='font-bold text-xl mx-auto pt-[3px]'>Applicant's Opportunity</h1>
    </div>
            <div className='p-6'>
    <div className="max-w-7xl mx-auto pt-[3px]">
        <div className='p-4'>
            <button className='p-2 bg-[#D62102] text-white font-bold rounded-[10px] hover:bg-red-700' onClick={() => Goback()}>&larr; Go Back</button>
        </div>
        <div className="flex flex-col">
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 table-fixed">
                            <thead className="bg-white">
                                <tr>
                                    <th scope="col" className="py-3 px-6 text-xs font-bold font-poppins tracking-wider text-center text-gray-700 uppercase">
                                        Member Name
                                    </th>
                                    <th scope="col" className="py-3 px-6 text-xs font-bold font-poppins tracking-wider text-center text-gray-700 uppercase">
                                        Phone Number
                                    </th>
                                    <th scope="col" className="py-3 px-6 text-xs font-bold font-poppins tracking-wider text-center text-gray-700 uppercase hidden lg:flex">
                                        Email
                                    </th>
                                    <th scope="col" className="py-3 px-6 text-xs font-bold font-poppins tracking-wider text-center text-gray-700 uppercase">
                                        Opportunity
                                    </th>
                                    <th scope="col" className="py-3 px-6 text-xs font-bold font-poppins tracking-wider text-center text-gray-700 uppercase">
                                        Action
                                    </th>
                                    <th scope="col" className="py-3 px-6 text-xs font-bold font-poppins tracking-wider text-center text-gray-700 uppercase">
                                        Selection status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.map((d, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-500">{d.interested_name}</td>
                                        <td className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-500">{d.phonenumber}</td>
                                        <td className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-500 hidden lg:flex">{d.email}</td>
                                        <td className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-500">{d.opportunity_name}</td>
                                        <td className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-500">
                                            <button className="bg-[#D62102] hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full ml-1" onClick={() => deleteData(d.id)}>Delete</button>
                                            <button className="bg-[#D62102] hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full ml-1" onClick={() => viewMember(d.interest_id)}>Details</button>
                                        </td>
                                        <td className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-500">
                                            <label className="text-black font-bold py-2 px-4 rounded-full ml-1">
                                                <input type="checkbox" checked={d.selectedOption === 'Yes'} onChange={() => handleCheckboxChange(index, 'Yes', d.id, d.opportunity_name, d.interested_name, d.phonenumber)} />Yes
                                            </label>
                                            <label className="text-black font-bold py-2 px-4 rounded-full ml-1">
                                                <input type="checkbox" checked={d.selectedOption === 'No'} onChange={() => handleCheckboxChange(index, 'No', d.id, d.opportunity_name, d.interested_name, d.phonenumber)} />No
                                            </label>
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
export default EolDataView;
