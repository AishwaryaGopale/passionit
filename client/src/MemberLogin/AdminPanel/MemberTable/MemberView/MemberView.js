import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { encode } from 'base64-arraybuffer';
import * as API from "../../../../Endpoint/endpoint";

const MemberView = () => {
  const [member, setMember] = useState([]);

  useEffect(() => {
    const id = sessionStorage.getItem("member_id");
    if (id) {
      GetMember(id);
    }
  }, []);

  const GetMember = (id) => {
    axios({
      url: API.GET_GETMEMBER_API(id),
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      if (Array.isArray(res.data)) {
        setMember(res.data);
      } else if (typeof res.data === 'object') {
        setMember([res.data]);
        console.log(res.data);
      } else {
        console.error('Invalid API response:', res.data);
      }
    }).catch((error) => {
      console.error('Error fetching member:', error);
    });
  };

  const navigate = useNavigate();

  const DeleteMember = (id) => {
    axios({
      url: API.DELETE_MEMBERS_API(id),
      method: 'delete',
    }).then((res) => {
      alert("Delete member successfully");
      navigate("/admin");
    }).catch((err) => {
      alert("Member not deleted");
    });
  };

  const GoBack = () => {
    navigate("/admin");
  };

  return (
    <div className="py-16 bg-[#d6d6d5] h-full">
      <div className="container px-6 m-auto text-gray-500 md:px-12 xl:px-0">
        <div className="grid gap-6 mx-auto md:w-3/6 lg:w-full lg:grid-cols-1">
          <div className="bg-[white] rounded-2xl shadow-xl px-8 py-12 sm:px-12 lg:px-8">
            <div className="mb-12 space-y-4">
              {member.map((d, k) => (
                <div key={k}>
                  <h5 className="text-xl font-semibold text-purple-900">{d.id}</h5>
                  <div className="grid grid-cols-1 gap-4 member-details sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <div className="flex flex-col">
                      <span className="font-bold">Member Name:</span>
                      <span>{d.member_name}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Member Code:</span>
                      <span>{d.member_code}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Member Phone:</span>
                      <span>{d.member_phone}</span>
                    </div>
                    <div className="flex flex-col">
                    <span className="font-bold">Member Email:</span>
                    <p className="normal-case">{d.member_email}</p>
                  </div>
                    
                    <div className="flex flex-col">
                      <span className="font-bold">Date of Registration:</span>
                      <span>{new Date(d.date_of_registration).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Date of Expire:</span>
                      <span>{new Date(d.date_of_expire).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Resume:</span>
                      <span>{d.resume}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">ID Card Proof:</span>
                      <span>{d.id_card_proof}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Other Documents:</span>
                      <span>{d.other_documents}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Geolocation:</span>
                      <span>{d.geolocation}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Specialisation:</span>
                      <span>{d.specialisation}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Address:</span>
                      <span>{d.address}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">City:</span>
                      <span>{d.city}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">State:</span>
                      <span>{d.state}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Pincode:</span>
                      <span>{d.pincode}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Technology:</span>
                      <span>{d.technology}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Roll Number:</span>
                      <span>{d.roll_number}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Class Member:</span>
                      <span>{d.class_member}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Discipline:</span>
                      <span>{d.discipline}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Member Group:</span>
                      <span>{d.membergroup}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Member Category:</span>
                      <span>{d.membercategory}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Member Type:</span>
                      <span>{d.membertype}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Student ID:</span>
                      <span>{d.id_student}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Organization Name:</span>
                      <span>{d.organization_name}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Designation Role:</span>
                      <span>{d.designation_role}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Country:</span>
                      <span>{d.country}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Interested Membership:</span>
                      <span>{d.interested_membership ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Interested Research:</span>
                      <span>{d.interested_research ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Interested Startup:</span>
                      <span>{d.interested_startup ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Interested Investments:</span>
                      <span>{d.interested_investments ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Interested Mentoring:</span>
                      <span>{d.interested_mentoring ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Membership Duration:</span>
                      <span>{d.membership_duration}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Membership Status:</span>
                      <span>{d.membership_status}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Flag:</span>
                      <span>{d.flag ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Skills:</span>
                      <span>{d.skills}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Photo Image:</span>
                      {d.photo_image && d.photo_image.data ? (
                        <img
                          src={`data:image/jpeg;base64,${encode(new Uint8Array(d.photo_image.data).buffer)}`}
                          alt="Member"
                          className="w-24 h-24"
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </div>
                  </div>
                  <div className='flex items-center justify-center p-4'>
                    <button className="bg-red-500 text-[white] hover:bg-red-700 text-[white] font-bold py-2 px-4 rounded-full" onClick={() => DeleteMember(d.id)}>
                      Delete
                    </button>
                    <div className='flex items-center justify-center p-3'>
                      <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full" onClick={GoBack}>
                        &#8592; Go Back
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberView;
