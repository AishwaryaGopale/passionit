import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
// import logo from '../image/logo.png';
// import logox from '../image/logo1.png';
import * as API from "../../../../../Endpoint/endpoint";

const UpdateValue = () => {
    const { id } = useParams(); // Assuming you are passing the id as a parameter
    const navigate = useNavigate();

    useEffect(() => {
        GetaTypes();
        fetchExistingData();
    }, [])

    const opportunity_type = useRef();
    const rol_e = useRef();
    const level_of_member = useRef();

    const [type, setType] = useState([]);
    const [existingData, setExistingData] = useState({});

    const GetaTypes = () => {
        axios({
            url: API.ADD_OPPORTUNITYTYPE_API,
            method: 'GET',
        }).then((res) => {
            setType(res.data);
        }).catch((err) => {
            alert("Error fetching opportunity types");
        })
    }

    const fetchExistingData = () => {
        axios({
            url: API.ADD_VALUEPER_API(id), // Replace with the actual endpoint to fetch a single item by id
            method: 'GET',
        }).then((res) => {
            setExistingData(res.data);
            opportunity_type.current.value = res.data.opportunity_type;
            rol_e.current.value = res.data.rol_e;
            level_of_member.current.value = res.data.level_of_member;
        }).catch((err) => {
            alert("Error fetching existing data");
        })
    }

    const updateData = () => {
        var playload = {
            opportunity_type: opportunity_type.current.value,
            rol_e: rol_e.current.value,
            level_of_member: level_of_member.current.value
        }

        axios({
            url: API.PUT_VALUEPER_API(id), // Replace with the actual endpoint to update data by id
            method: 'PUT',
            data: playload,
            contentType: 'application/json',
        }).then((res) => {
            alert("Update successful");
            navigate("/user/valueper")
        }).catch((err) => {
            alert("Error updating data");
        })
    }

    return (
        <>
            <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
                <div className="container max-w-screen-lg mx-auto">
                    <div>
                        <div className="lg:col-span-2 p-2">
                            <h1>Update Data</h1>
                        </div>
                        <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                                <div className="text-gray-600">
                                    <p className="font-medium text-lg">Form</p>
                                    <p>Please fill out all the fields.</p>
                                </div>
                                <div className="lg:col-span-2">
                                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-4">
                                        <div className="md:col-span-2">
                                            <label htmlFor="budget_currency">Select opportunity type</label>
                                            <select className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={opportunity_type}>
                                                <option value="">Select Opportunity Type</option>
                                                {
                                                    type.map((d, k) => (
                                                        <option key={k} value={d.opportunity_type}>{d.opportunity_type}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label>Role</label>
                                            <input type="text" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={rol_e} />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label>Membership Level</label>
                                            <input type="number" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={level_of_member} />
                                        </div>
                                        <br />
                                        <div className="md:col-span-5 text-right">
                                            <div className="inline-flex items-end gap-x-3">
                                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={updateData}>Update</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UpdateValue;
