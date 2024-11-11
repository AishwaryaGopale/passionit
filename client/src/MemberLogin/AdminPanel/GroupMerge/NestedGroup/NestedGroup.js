import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as API from "../../../../Endpoint/endpoint";

const NestedGroup = () => {

    useEffect(() => {
        Getdata();
        MemberidWise();
    }, []);

    const [ogroup, setOgrou] = useState([]);
    const [group, setGroups] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const navigate = useNavigate();
    const group_name = useRef();
    const group_owner = useRef();
    const new_group = useRef();
   
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const MemberidWise = () => {
        const id = sessionStorage.getItem("user_id");
        axios({
            url: (API.GET_GROUP_API(id)),
            method: 'GET',
            contentType: 'application/json',
        }).then((res) => {
            setOgrou(res.data);
        }).catch((err) => {
            console.error(err);
        });
    };

    const Getdata = () => {
        axios({
            url: (API.ADD_GROUP_API),
            method: 'GET',
            contentType: 'application/json',
        }).then((res) => {
            setGroups(res.data);
        }).catch((err) => {
            console.error(err);
        });
    };

    const handleCheckboxChange = (event, group) => {
        if (event.target.checked) {
            setSelectedGroups([...selectedGroups, group]);
        } else {
            setSelectedGroups(selectedGroups.filter(g => g !== group));
        }
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const AddData = async () => {
        const memberid = sessionStorage.getItem("user_id");
        const formData = new FormData();
        formData.append('member_id', memberid);
        formData.append('group_name', group_name.current.value);
        formData.append('other_group_name', selectedGroups.join(", "));
        formData.append('group_owner', group_owner.current.value);
        formData.append('new_group', new_group.current.value);

        if (file) {
            formData.append('groupLogo', file);
        }

        try {
            const response = await axios.post(API.POST_GROUP_API, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Response:', response.data);
            alert('Group created successfully!');
            navigate("/admin/groupmergertable");
        } catch (error) {
            console.error('Error:', error);
            alert('Error creating group.');
        }
    };

    const GoBack = () => {
        navigate("/admin/groupmergertable");
      };

    return (
        <>
            <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
                <div className="container max-w-screen-lg mx-auto">
                    <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                        <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                            <div className="text-gray-600">
                                <p className="font-medium text-lg">Join Group</p>
                                <p>Please fill out all the fields.</p>
                            </div>
                            <div className="lg:col-span-2">
                                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-4">
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium leading-6 text-gray-900">Your Group Name</label>
                                        <select ref={group_name} className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm">
                                            <option>Select Name</option>
                                            {group.map((d, k) => (
                                                <option key={k} value={d.groupname}>name: {d.groupname} value: {d.transactionvalue}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="sm:col-span-2 relative">
                                        <label className="block text-sm font-medium leading-6 text-gray-900">Merge Group with</label>
                                        <div className="relative">
                                            <button type="button" onClick={toggleDropdown} className="w-full p-2 flex justify-between items-center rounded-md border shadow-sm focus:outline-none">
                                                <span>{selectedGroups.length > 0 ? selectedGroups.join(", ") : "Select Groups"}</span>
                                                <span className={`transform transition-transform ${dropdownOpen ? "rotate-180" : ""}`}>▼</span>
                                            </button>
                                            {dropdownOpen && (
                                                <div className="absolute mt-2 w-full max-h-60 overflow-y-auto rounded-md bg-white shadow-lg">
                                                    {group.map((d, index) => (
                                                        <label key={index} className="flex items-center px-4 py-2 cursor-pointer">
                                                            <input type="checkbox" value={d.groupname} onChange={(e) => handleCheckboxChange(e, d.groupname)} className="mr-2" />
                                                            name: {d.groupname} value: {d.transactionvalue}
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium leading-6 text-gray-900">Owner Name</label>
                                        <input type="text" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={group_owner} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium leading-6 text-gray-900">New Group</label>
                                        <input type="text" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={new_group} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium leading-6 text-gray-900">Group Logo</label>
                                        <input type="file" className="h-10 border mt-1 p-1 rounded px-4 w-full bg-gray-50" onChange={handleFileChange} />
                                    </div>
                                    <div className="md:col-span-5 text-right">
                                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={AddData}>Submit</button>
                                    </div>
                                   
                                </div>
                                <div className="flex justify-end mt-4">
                                     <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={GoBack}> Go Back </button>
                               </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NestedGroup;
