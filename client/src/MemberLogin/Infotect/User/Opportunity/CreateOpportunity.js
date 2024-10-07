import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as API from "./../../../../Endpoint/endpoint";

const CreateOpportunity = () => {
  const opportunity_type_id = useRef();
  const opportunity_name = useRef();
  const opportunity_description = useRef();
  const opportunity_provider = useRef();
  const opportunity_start_date = useRef();
  const opportunity_end_date = useRef();
  const opportunity_problem_statement = useRef();
  const opportunity_expected_solution = useRef();
  const opportunity_expected_work_zone = useRef();
  const opportunity_expected_work_time = useRef();
  const opportunity_work_type = useRef();
  const opportunity_budget_available = useRef();
  const opportunity_estimate_budget = useRef();
  const budget_currency = useRef();
  const opportunity_resource_volume = useRef();
  const opportunity_status = useRef();
  const opportunity_code = useRef();
  const projectname = useRef();
  const revised_volume = useRef();
  const revised_budget = useRef();
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const AddData = async () => {
    const id = mid;
    const email = memail;

    const formData = new FormData();
    if (file) {
      formData.append('photo', file);
      formData.append('file_upload', file); // Append the same file to 'file_upload'
    }

    formData.append('opportunity_type_id', opportunity_type_id.current.value);
    formData.append('opportunity_name', opportunity_name.current.value);
    formData.append('opportunity_description', opportunity_description.current.value);
    formData.append('opportunity_provider', opportunity_provider.current.value);
    formData.append('opportunity_start_date', opportunity_start_date.current.value);
    formData.append('opportunity_end_date', opportunity_end_date.current.value);
    formData.append('opportunity_problem_statement', opportunity_problem_statement.current.value);
    formData.append('opportunity_expected_solution', opportunity_expected_solution.current.value);
    formData.append('opportunity_expected_work_zone', opportunity_expected_work_zone.current.value);
    formData.append('opportunity_expected_work_time', opportunity_expected_work_time.current.value);
    formData.append('opportunity_work_type', opportunity_work_type.current.value);
    formData.append('opportunity_budget_available', opportunity_budget_available.current.value);
    formData.append('opportunity_estimate_budget', opportunity_estimate_budget.current.value);
    formData.append('budget_currency', budget_currency.current.value);
    formData.append('opportunity_resource_volume', opportunity_resource_volume.current.value);
    formData.append('opportunity_status', opportunity_status.current.value);
    formData.append('opportunity_code', opportunity_code.current.value);
    formData.append('revised_volume', revised_volume.current.value);
    formData.append('revised_budget', revised_budget.current.value);
    formData.append('projectname', projectname.current.value);
    formData.append('email', email);
    formData.append('member_id', id);

    try {
      const response = await axios.post(API.POST_OPPORTUNITY_API, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Response:', response.data);
      alert('Opportunity added successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding opportunity.');
    }
  };

  const [selectedType, setSelectedType] = useState('');
  const [newOpportunityType, setNewOpportunityType] = useState('');
  const [opportunityTypes, setOpportunityTypes] = useState([]);

  useEffect(() => {
    GetMemberData();
    fetchOpportunityTypes();
  }, []);

  const [mid, setMid] = useState('');
  const [memail, setMEmail] = useState('');

  const GetMemberData = () => {
    const userId = sessionStorage.getItem("user_id");
    axios({
      url: (API.GET_GETMEMBER_API(userId)),
      method: 'GET',
      contentType: 'application/json',
    }).then((res) => {
      setMid(res.data.id);
      setMEmail(res.data.member_email);
    }).catch((err) => {
      console.error('Error fetching member data:', err);
    });
  };

  const fetchOpportunityTypes = async () => {
    try {
      const response = await axios.get(API.ADD_OPPORTUNITYTYPE_API);
      setOpportunityTypes(response.data);
    } catch (error) {
      console.error('Error fetching opportunity types:', error);
    }
  };

  const handleSelectChange = (e) => {
    const { value } = e.target;
    setSelectedType(value);
    setNewOpportunityType('');
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setNewOpportunityType(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedType === 'custom') {
        await axios.post(API.POST_OPPORTUNITYTYPE_API, { opportunity_type: newOpportunityType });
        setNewOpportunityType('');
        fetchOpportunityTypes();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
      <div className="container max-w-screen-lg mx-auto">
        <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
          <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
            <div className="text-gray-600">
              <p className="font-medium text-lg">Opportunity</p>
              <p>Please fill out all the fields.</p>
            </div>
            <div className="lg:col-span-2">
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-4">
                <div className="md:col-span-2">
                  <label>Opportunity Type</label>
                  <select value={selectedType} onChange={handleSelectChange} ref={opportunity_type_id} className="h-10 border mt-1 rounded px-4 w-full bg-gray-50">
                    <option value="">Select an opportunity type</option>
                    {opportunityTypes.map((type) => (
                      <option key={type.id} value={type.id}>{type.opportunity_type}</option>
                    ))}
                    <option value="custom">Custom</option>
                  </select>
                  {selectedType === 'custom' && (
                    <div>
                      <input type="text" value={newOpportunityType} onChange={handleInputChange} placeholder="Enter custom option" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" />
                      <button type="submit" onClick={handleSubmit}>Submit</button>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label>Opportunity Name</label>
                  <input type="text" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={opportunity_name} />
                </div>

                <div className="md:col-span-2">
                  <label>Description</label>
                  <textarea className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={opportunity_description} />
                </div>

                <div className="md:col-span-2">
                  <label>Opportunity Provider</label>
                  <input type="text" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={opportunity_provider} />
                </div>

                <div className="md:col-span-2">
                  <label>Project Name</label>
                  <input type="text" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={projectname} />
                </div>

                <div className="md:col-span-2">
                  <label>Opportunity Start Date</label>
                  <input type="date" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={opportunity_start_date} />
                </div>

                <div className="md:col-span-2">
                  <label>Opportunity End Date</label>
                  <input type="date" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={opportunity_end_date} />
                </div>

                <div className="md:col-span-2">
                  <label>Problem Statement</label>
                  <textarea className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={opportunity_problem_statement} />
                </div>

                <div className="md:col-span-2">
                  <label>Expected Solution</label>
                  <textarea className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={opportunity_expected_solution} />
                </div>

                <div className="md:col-span-2">
                  <label>Expected Work Zone</label>
                  <input type="text" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={opportunity_expected_work_zone} />
                </div>

                <div className="md:col-span-2">
                  <label>Expected Work Time</label>
                  <input type="text" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={opportunity_expected_work_time} />
                </div>

                <div className="md:col-span-2">
                  <label>Work Type</label>
                  <input type="text" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={opportunity_work_type} />
                </div>

                <div className="md:col-span-2">
                  <label>Budget Available</label>
                  <input type="text" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={opportunity_budget_available} />
                </div>

                <div className="md:col-span-2">
                  <label>Estimate Budget</label>
                  <input type="text" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={opportunity_estimate_budget} />
                </div>

                <div className="md:col-span-2">
                  <label>Budget Currency</label>
                  <input type="text" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={budget_currency} />
                </div>

                <div className="md:col-span-2">
                  <label>Resource Volume</label>
                  <input type="text" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={opportunity_resource_volume} />
                </div>

                <div className="md:col-span-2">
                  <label>Opportunity Status</label>
                  <input type="text" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={opportunity_status} />
                </div>

                <div className="md:col-span-2">
                  <label>Opportunity Code</label>
                  <input type="text" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={opportunity_code} />
                </div>

                <div className="md:col-span-2">
                  <label>Revised Volume</label>
                  <input type="text" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={revised_volume} />
                </div>

                <div className="md:col-span-2">
                  <label>Revised Budget</label>
                  <input type="text" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={revised_budget} />
                </div>

                <div className="md:col-span-2">
                  <label>File Upload</label>
                  <input type="file" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" onChange={handleFileChange} />
                </div>

                <div className="md:col-span-2">
                  <label>Photos</label>
                  <input type="file" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" onChange={handleFileChange} />
                </div>

                <div className="md:col-span-2">
                  <div className="inline-flex items-end">
                    <button onClick={AddData} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOpportunity;
