import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as API from "./../../../../Endpoint/endpoint";


const Value_per = () => {
    const navigate = useNavigate();

    useEffect(() => {
        getData();
        GetaTypes();
    }, []);

    const [data, setData] = useState([]);
    const getData = () => {
        axios({
            url: (API.GET_VALUEPER_API),
            method: 'GET',
            conetntType: 'application/json',
        }).then((res) => {
            setData(res.data)
        }).catch((err) => {
            alert("error")
        })
    }

    const DeleteData = (id) => {
        axios({
            url: (API.DELETE_VALUEPER_API(id)),
            method: 'DELETE',
        }).then((res) => {
            getData();
            alert("done")
        }).catch((err) => {
            alert("error")
        })
    }

    const Addvaluepage = () => {
        navigate("/user/addvalue")
    }

    const opportunity_type = useRef();
    const rol_e = useRef();
    const level_of_member = useRef();


    const [type, setType] = useState([]);
    console.log(type);
    const GetaTypes = () => {
        axios({
            url: (API.ADD_OPPORTUNITYTYPE_API),
            method: 'GET',
        }).then((res) => {
            setType(res.data)
        }).catch((err) => {
            alert("error")
        })
    }


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


    const UpdateData = (id) => {
        navigate(`/user/updatevalue/${id}`)
    }





    return (
        <>
            {/* <div>
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
            </div> */}
            {/*  */}
            <div class="max-w-5xl mx-auto  pb-[50px] ">
                <h3 className='p-3 font-bold text-center'>Opportunity Type level Configuration</h3>
                <div class="flex flex-col">
                    <div class="overflow-x-auto shadow-md sm:rounded-lg">
                        <div class="inline-block min-w-full align-middle">
                            <div class="overflow-hidden ">
                                <div className='pb-2'>
                                    <button onClick={() => Addvaluepage()} className='bg-[#359ff7] p-2 border rounded-2xl hover:bg-[#53f1f7]'>Add</button>
                                </div>
                                <table class="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700">
                                    <thead class="bg-[#7f7ff5] dark:bg-[#8b8bf7]">
                                        <tr>
                                            <th scope="col" class="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">
                                                id
                                            </th>
                                            <th scope="col" class="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">
                                                opportunity type
                                            </th>
                                            <th scope="col" class="py-3 px-6 text-xs font-medium tracking-widertext-center text-gray-700 uppercase dark:text-gray-400">
                                                role
                                            </th>
                                            <th scope="col" class="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">
                                                Level of membership
                                            </th>
                                            <th scope="col" class="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">
                                                action
                                            </th>

                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700 text-center">
                                        {
                                            data.map((d, k) => (
                                                <tr class="hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    <td class="py-3 px-6 text-xs font-medium tracking-wider  text-gray-700 uppercase dark:text-gray-400">{d.id}</td>
                                                    <td class="py-3 px-6 text-xs font-medium tracking-wider  text-gray-700  dark:text-gray-400">{d.opportunity_type}</td>
                                                    <td class="py-3 px-6 text-xs font-medium tracking-wider  text-gray-700  dark:text-gray-400">{d.rol_e}</td>
                                                    <td class="py-3 px-6 text-xs font-medium tracking-wider  text-gray-700  dark:text-gray-400"> 1</td>
                                                    <td class="py-3 px-6 text-xs font-medium tracking-wider  text-gray-700 uppercase dark:text-gray-400 ">
                                                        <button onClick={() => DeleteData(d.id)} className='bg-[#3596f1] p-2 rounded-[20px]'>Delete</button>
                                                        <div className='inline pl-[2px]'>
                                                            <button onClick={() => UpdateData(d.id)} className='bg-[#3596f1] p-2 rounded-[20px]'>Update</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Value_per