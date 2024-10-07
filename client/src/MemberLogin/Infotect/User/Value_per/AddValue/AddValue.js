import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import logo from '../image/logo.png';
// import logox from '../image/logo1.png';
import * as API from "../../../../../Endpoint/endpoint";

const AddValue = () => {

    useEffect(() => {
        GetaTypes();
    }, [])

    const opportunity_type = useRef();
    const rol_e = useRef();
    const level_of_member = useRef();


    const [type, setType] = useState([]);
    const GetaTypes = () => {
        axios({
            url: API.ADD_OPPORTUNITYTYPE_API,
            method: 'GET',
        }).then((res) => {
            setType(res.data)
        }).catch((err) => {
            alert("error")
        })
    }
    
    const navigate = useNavigate();
    
    
    
    
    const PostData = () => {
        var playload = { opportunity_type: opportunity_type.current.value, rol_e: rol_e.current.value, level_of_member: level_of_member.current.value }
        
        axios({
            url: (API.POST_VALUEPER_API),
            method: 'POST',
            data: playload,
            contentType: 'application/json',
        }).then((res) => {
            alert("done");
            navigate("/user/valueper")
        }).catch((err) => {
            alert("error")
        })
    }

    


    return (
        <>
        <div>
            
        </div>
            <div class="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
                <div class="container max-w-screen-lg mx-auto">
                    <div>
                        <div class="lg:col-span-2 p-2">
                            <h1></h1>
                        </div>
                        <div class="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                            <div class="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                                <div class="text-gray-600">
                                    <p class="font-medium text-lg">Form</p>
                                    <p>Please fill out all the fields.</p>
                                </div>
                                <div class="lg:col-span-2">
                                    <div class="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-4">
                                        <div class="md:col-span-2">
                                            <label for="budget_currency">Select opportunity type</label>
                                            <select class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={opportunity_type}>
                                                <option value="">Select Opportunity Type</option>
                                                {
                                                    type.map((d, k) => (
                                                        <option value={d.opportunity_type}>{d.opportunity_type}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div class="md:col-span-2">
                                            <label >Role</label>
                                            <input type="text" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={rol_e} />
                                        </div>
                                        <div class="md:col-span-2">
                                            <label>membership  level</label>
                                            <input type="number" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={level_of_member} />
                                        </div>
                                        <br />
                                        <div class="md:col-span-5 text-right ">
                                            <div class="inline-flex items-end gap-x-3">
                                                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => PostData()}>Submit</button>
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

export default AddValue;