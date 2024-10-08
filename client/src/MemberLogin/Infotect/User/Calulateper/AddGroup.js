import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as API from "./../../../../Endpoint/endpoint";


const AddGroup = () => {
    const navigate = useNavigate();
    const groupcode = useRef();
  const groupname = useRef();
  const groupcaption = useRef();
  const groupwebsitelink = useRef();
  const group_owner = useRef();
  const email = useRef();
  const phone = useRef();
  const transactionvalue = useRef();
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const AddData = async () => {
    var memberid= sessionStorage.getItem("user_id");
    const formData = new FormData();
    formData.append('memberid', memberid);
    formData.append('groupcode', groupcode.current.value);
    formData.append('groupname', groupname.current.value);
    formData.append('groupcaption', groupcaption.current.value);
    formData.append('groupwebsitelink', groupwebsitelink.current.value);
    formData.append('group_owner', group_owner.current.value);
    formData.append('email', email.current.value);
    formData.append('phone', phone.current.value);
    formData.append('transactionvalue', transactionvalue.current.value);
    
    if (file) {
      formData.append('groupLogo', file);
    }

    try {
      const response = await axios.post(API.POST_CREATEGROUP_API, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Response:', response.data);
      alert('Group created successfully!');
      navigate("/user/group")
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating group.');
    }
  };

    return (
        <>
            <div class="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
                <div class="container max-w-screen-lg mx-auto">
                    <div>

                        <div class="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                            <div class="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                                <div class="text-gray-600">
                                    <p class="font-medium text-lg">Create Group</p>
                                    <p>Please fill out all the fields.</p>
                                </div>

                                <div class="lg:col-span-2">
                                    <div class="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-4">

                                        <div class="md:col-span-2">
                                            <label >group code</label>
                                            <input type="text" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={groupcode} />
                                        </div>

                                        <div class="md:col-span-2">
                                            <label for="address">group name</label>
                                            <input type="text" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={groupname} />
                                        </div>

                                        <div class="md:col-span-2">
                                            <label for="city">group caption</label>
                                            <input type="text" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={groupcaption} />
                                        </div>

                                        <div class="md:col-span-2">
                                            <label for="full_name">group website link</label>
                                            <input type="url" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={groupwebsitelink} />
                                        </div>

                                        <div class="md:col-span-2">
                                            <label for="email">group owner</label>
                                            <input type="text" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={group_owner} />
                                        </div>

                                        <div class="md:col-span-2">
                                            <label for="address"> email</label>
                                            <input type="email" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={email} />
                                        </div>

                                        <div class="md:col-span-2">
                                            <label>phone</label>
                                            <input type="text" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={phone} />
                                        </div>

                                        <div class="md:col-span-2">
                                            <label>transaction value</label>
                                            <input type="text" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={transactionvalue} />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label htmlFor="photo">group logo</label>
                                            <input type="file" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" onChange={handleFileChange} />
                                        </div>
                                
                                        <div class="md:col-span-5 text-right">
                                            <div class="inline-flex items-end">
                                                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => AddData()}>Submit</button>
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

export default AddGroup;

