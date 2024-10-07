import React, { useRef } from 'react';
import axios from 'axios';
import * as API from "../../../../Endpoint/endpoint";

const MemberShipAdd = () => {
    const member_id = useRef();
    const membership_type = useRef();
    const membership_category = useRef();
    const membership_duration = useRef();
    const membership_frequency_renewal = useRef();
    const membership_status = useRef();
    const photo = useRef();

    const AddMembers = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('member_id', member_id.current.value);
        formData.append('membership_type', membership_type.current.value);
        formData.append('membership_category', membership_category.current.value);
        formData.append('membership_duration', membership_duration.current.value);
        formData.append('membership_frequency_renewal', membership_frequency_renewal.current.value);
        formData.append('membership_status', membership_status.current.value);
        formData.append('photo', photo.current.files[0]);

        try {
            const response = await axios.post(API.POST_MEMBERSHIPRECORDS_API, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert("Member added successfully");
        } catch (error) {
            alert("Error: " + error);
        }
    };

    return (
        <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
            <div className="container max-w-screen-lg mx-auto">
                <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                        <div className="text-gray-600">
                            <p className="font-medium text-lg">Membership</p>
                            <p></p>
                        </div>
                        <div className="lg:col-span-2">
                            <form className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5" onSubmit={AddMembers}>
                                <div className="md:col-span-5">
                                    <label htmlFor="member_id">Member Id</label>
                                    <input type="text" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={member_id} placeholder="Enter member Id" />
                                </div>
                                <div className="md:col-span-5">
                                    <label htmlFor="membership_type">Membership Type</label>
                                    <select className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={membership_type}>
                                        <option value="">Select Membership Type</option>
                                        <option value="Premium">Premium</option>
                                        <option value="Standard">Standard</option>
                                        <option value="Basic">Basic</option>
                                    </select>
                                </div>
                                <div className="md:col-span-5">
                                    <label htmlFor="membership_category">Membership Category</label>
                                    <select className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={membership_category}>
                                        <option value="">Select Membership Category</option>
                                        <option value="Gold">Gold</option>
                                        <option value="Silver">Silver</option>
                                        <option value="Bronze">Bronze</option>
                                    </select>
                                </div>
                                <div className="md:col-span-3">
                                    <label htmlFor="membership_duration">Membership Duration</label>
                                    <input type="text" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={membership_duration} placeholder="Enter membership duration" />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="membership_frequency_renewal">Membership Frequency Renewal</label>
                                    <input type="text" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="Enter renewal frequency" ref={membership_frequency_renewal} />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="membership_status">Membership Status</label>
                                    <select className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={membership_status}>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="md:col-span-5">
                                    <label htmlFor="photo">Photo</label>
                                    <input type="file" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={photo} />
                                </div>
                                <div className="md:col-span-5 text-right">
                                    <div className="inline-flex items-end">
                                        <button type="submit" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Submit</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberShipAdd;
