import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import * as API from "./../../../../Endpoint/endpoint";
import { format } from 'date-fns';


const Opportunity = () => {
  const [type, setType] = useState([]);
  const [names, setNames] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const firstHighlightRef = useRef(null);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [checkboxStates, setCheckboxStates] = useState({});
  const [selectedOpportunities, setSelectedOpportunities] = useState([]);
  const [member_id, setMemberId] = useState([]);
  const [file, setFile] = useState(null);
  const [showFileInput, setShowFileInput] = useState(false);
  

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
    scrollFirstHighlightIntoView();
  };



  const highlightText = (text) => {
    if (!searchKeyword) return text;
    const regex = new RegExp(`(${searchKeyword})`,'gi');
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === searchKeyword.toLowerCase() ?
        <span key={index} style={{ backgroundColor: 'yellow' }} ref={index === 0 ? firstHighlightRef : null}>{part}</span> :
        part
    );
  };


  const scrollFirstHighlightIntoView = () => {
    if (firstHighlightRef.current) {
      firstHighlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };


  useEffect(() => {
    getOpporu();
    getOppor();
    scrollFirstHighlightIntoView();
    getOpportunityTypes();
    GetMemberData();
    getAllData();
  }, []);



  const getOpportunityTypes = () => {
    axios({
      url: API.ADD_OPPORTUNITYTYPE_API,
      method: 'GET',
      contentType: 'application/json',
    })
      .then((res) => {
        setType(res.data);
        getOppor()
      })
      .catch((err) => {
        console.error('Error fetching opportunity types', err);
      });
  };

  const getOppor = () => {
    axios({
      url: API.ADD_OPPORTUNITY_API,
      method: 'GET',
      contentType: 'application/json',
    })
      .then((res) => {
        // Sort data by id in descending order
        const sortedData = res.data.sort((a, b) => b.id - a.id);
        setNames(sortedData);
  
        const initialCheckboxStates = {};
        sortedData.forEach((opportunity) => {
          initialCheckboxStates[opportunity.id] = false;
        });
        setCheckboxStates(initialCheckboxStates);
  
        const emails = sortedData.map((opportunity) => opportunity.email);
        const memberIds = sortedData.map((opportunity) => opportunity.member_id);
  
        if (emails.length > 0) {
          console.log(emails[0]);
        }
        if (memberIds.length > 0) {
          setMemberId(memberIds[0]);
        }
      })
      .catch((err) => {
        console.error('Error fetching opportunity names', err);
      });
  };
  

  const [op, setOp] = useState([]);
  const getAllData = () => {
    axios({
      url: (API.ADD_OPPORTUNITY_API),
      method: 'GET',
      contentType: 'application/json',
    }).then((res) => {
      setOp(res.data);
    })
  }

  const handleSelectChange = (e) => {
    const { value } = e.target;
    const id = value
    axios({
      url: API.GET_OPPORTUNITYS_API(id),
      method: 'GET',
      contentType: 'application/json',
    }).then((res) => {
      setNames(res.data);
    })
      .catch((err) => {
        console.error('Error fetching opportunity names', err);
      });
  };

  const handleSelectDate = (gap) => {
    const { value } = gap.target;
    const g = value
    axios({
      url:(API.GET_OPPORTUNITYDATAGAP_API(g)),
      method: 'GET',
      contentType: 'application/json',
    })
      .then((res) => {
        setNames(res.data);
      })
      .catch((err) => {
        console.error('Error fetching opportunity names', err);
      });
  };

  const handleSelectProvider = (y) => {
    const { value } = y.target;
    const i = value
    axios({
      url: (API.GET_OPPORTUNITYPROVIDER_API(i)),
      method: 'GET',
      contentType: 'application/json',
    }).then((res) => {
      setNames(res.data);


    })
      .catch((err) => {
        console.error('Error fetching opportunity names', err);
      });
  }


  const handleSelectZone = (z) => {
    const { value } = z.target;
    const d = value
    axios({
      url:(API.GET_OPPORTUNITYWORKZONE_API(d)),
      method: 'GET',
      contentType: 'application/json',
    }).then((res) => {
      console.log(res.data);
      setNames(res.data);


    })
      .catch((err) => {
        console.error('Error fetching opportunity names', err);
      });
  }

  const getOpporu = () => {
    axios({
      url: API.GET_OPPORTUNITIES_API,
      method: 'GET',
      contentType: 'application/json',
    })
      .then((res) => {
        setNames(res.data);


      })
      .catch((err) => {
        console.error('Error fetching opportunity names', err);
      });
  }

  const handleCheckboxChange = (id, name, email, member_id) => {
    setCheckboxStates((prevCheckboxStates) => ({
      ...prevCheckboxStates,
      [id]: !prevCheckboxStates[id],
    }));

    setSelectedOpportunities((prevSelectedOpportunities) => {
      if (checkboxStates[id]) {
        return prevSelectedOpportunities.filter((opportunity) => opportunity.id !== id);
      } else {
        return [...prevSelectedOpportunities, { id, name, email, member_id }];
      }
    });
  };

  const handleSelectAllChange = () => {
    const updatedCheckboxStates = {};
    const updatedSelectedOpportunities = [];

    Object.keys(checkboxStates).forEach((id) => {
      updatedCheckboxStates[id] = !selectAllChecked;
      const opportunity = names.find((opportunity) => opportunity.id === parseInt(id));
      if (opportunity) {
        updatedSelectedOpportunities.push({ id, name: opportunity.opportunity_name, email: opportunity.email, memberid: member_id });
      }
    });

    console.log(updatedSelectedOpportunities)
    setCheckboxStates(updatedCheckboxStates);
    setSelectAllChecked(!selectAllChecked);
    setSelectedOpportunities(updatedSelectedOpportunities);
  };

  const sendMail = () => {
    if (selectedOpportunities.length === 0) {
      alert('Please select opportunities to send emails.');
      return;
    }
  
    const filteredOpportunities = selectedOpportunities.filter(opportunity => checkboxStates[opportunity.id]);
    const recipientEmails = filteredOpportunities.map(opportunity => opportunity.email).filter(email => email);
  
    if (recipientEmails.length === 0) {
      alert('No valid recipients selected.');
      return;
    }
  
    console.log('Emails:', recipientEmails);
  
    axios.post(API.POST_SENDEMAIL_API, {
      selectedOpportunities: filteredOpportunities,
      recipientEmails
    })
      .then(response => {
        console.log('Email sent successfully:', response.data);
        alert('Email sent successfully');
        setSelectAllChecked(false);
      })
      .catch(error => {
        console.error('Error sending email:', error);
        alert('Error sending email');
      });
  };
  
  const [mid, setMid] = useState([]);
  const [mname, setMName] = useState([]);
  const [phonem, setMPhone] = useState([]);
  const [firstmail, setMEmail] = useState([]);

  const intrest = () => {
    if (selectedOpportunities.length === 0) {
      alert('Please select opportunities first.');
      return;
    }
    const id = mid;
    const name = mname;
    const phone = phonem;
    const member_email = firstmail;
  
    selectedOpportunities.forEach(opportunity => {
      const opportunity_id = opportunity.id;
      const opportunity_name = opportunity.name;
      const recipientEmails = opportunity.email;
      const member_id = opportunity.member_id;
  
      const datax = {
        interest_id: id,
        interested_name: name,
        phonenumber: phone,
        email: recipientEmails,
        opportunity_id,
        opportunity_name,
        member_id: member_id,
        member_email,
      };
  
      console.log('Data being sent:', datax);
      axios({
        url: API.POST_INTERESTEDPEOPLE_API,
        method: 'POST',
        data: datax,
        headers: { 'Content-Type': 'application/json' }
      })
        .then((res) => {
          console.log('Success:', res.data);
          alert('Interest submitted successfully');
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('Failed to submit interest');
        });
    });
  };
  
  const GetMemberData = () => {
    const userId = sessionStorage.getItem("user_id");
    axios({
      url: (API.GET_GETMEMBER_API(userId)),
      method: 'GET',
      contentType: 'application/json',
    }).then((res) => {
      setMid(res.data.id);
      setMName(res.data.member_name);
      setMEmail(res.data.member_email);
      setMPhone(res.data.member_phone);
    }).catch((err) => {
      alert("error: ")
    });
  }

  const userId = sessionStorage.getItem("user_id");
  console.log("userid",userId)
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'yyyy-MM-dd HH:mm'); // Adjust the format as needed
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
};

const handleSubmit = async () => {
  try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("member_id", member_id); // Add member_id to formData

      await axios.post(API.ADD_CSVUPLOAD_API, formData, {
          headers: {
              "Content-Type": "multipart/form-data",
          },
      });
      alert("File uploaded successfully!");
      setShowFileInput(false); // Hide the file input after uploading
  } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
  }
};


const [showDropdown, setShowDropdown] = useState(false);

const toggleDropdown = () => {
  setShowDropdown(prevState => !prevState);
};

  return (
    <>

      <div className="pt-[2px]">
        <div className=" p-4 fixed left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 bg-[#a1a1a1] px-[10px] overflow-y-auto rounded-[20px]">

          <>
            <div>
              <input type="text" placeholder="Search..." value={searchKeyword} onChange={handleSearchChange} className='border  rounded-[10px] p-1' style={{ width: '230px' }} />
            </div>
            <div className="dropdown pt-[4px] border-[black]">
              <label className='px-[5px]'>categories :</label>
              <select onChange={handleSelectChange} className="border-black pl-2 rounded-[10px] p-1" style={{ width: '230px' }}>
                <option>Select categories</option>
                {type.map((d, k) => (
                  <option key={d.id} value={d.id}>{d.opportunity_type}</option>
                ))}
              </select>
            </div>
            <div className="dropdown pt-[4px] border-[black]">
              <label className='px-[5px]'> Provider :</label>
              <br />
              <select onChange={handleSelectProvider} className="border-black pl-2 rounded-[10px] p-1" style={{ width: '230px' }}>
                <option>Select Provider</option>
                {op.map((d, k) => (
                  <option key={d.id} value={d.opportunity_provider}>{d.opportunity_provider}</option>
                ))}
              </select>
            </div>
            <div className="dropdown pt-[4px] border-[black]">
              <label className='px-[5px]'>Zone :</label>
              <br />
              <select onChange={handleSelectZone} className="border-black pl-2 rounded-[10px] p-1" style={{ width: '230px' }}>
                <option>Select Zone</option>
                {op.map((d, k) => (
                  <option key={d.id} value={d.opportunity_expected_work_zone}>{d.opportunity_expected_work_zone}</option>
                ))}
              </select>
            </div>
            <div className="dropdown pt-[4px] border-[black] ">
              <label className='px-[5px]'>Date :</label><br />
              <select onChange={handleSelectDate} className="border-black pl-2 rounded-[10px] p-1" style={{ width: '230px' }}>
                <option>Select Date</option>
                {op.map((d, k) => (
                  <option key={d.id} value={d.opportunity_expected_work_zone}>Working on it</option>
                ))}
              </select>
            </div>
          </>
        </div>

        <div className="p-4 sm:ml-64 bg-[white] ">
          <div className='pb-[20px] first-letter:'>
            <div className='p-4 bg-[#c4c4c4]   '>
              <input type="checkbox" checked={selectAllChecked} onChange={handleSelectAllChange} />
              <label className='pl-[9px] hover:underline'>Select All</label>
              <button className='pl-[10px] hover:underline' onClick={sendMail}>Send Mail</button>
              <Link to="/user/createoppo">
                <button className='pl-4 hover:underline'>Opportunity Add</button>
              </Link>
              <div className="relative inline-block text-left">
      <button
        className="pl-4 hover:underline"
        onClick={toggleDropdown}
      >
        Opportunity
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <Link to={`/user/viewint/${userId}`}>
              <button className="w-full text-left pl-4 py-2 hover:bg-gray-100" onClick={intrest}>
                View  Applicant's Opportunity
              </button>
            </Link>
            <Link to="/user/viewallopportunity">
              <button className="w-full text-left pl-4 py-2 hover:bg-gray-100">
                View All Opportunity
              </button>
            </Link>
            <Link to="/user/userallopportunity">
              <button className="w-full text-left pl-4 py-2 hover:bg-gray-100">
                User Opportunity
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>

              <button className='pl-4 hover:underline' onClick={() => setShowFileInput(true)}>
                        Import File
                    </button>
                

                {showFileInput && (
                    <div className="popup-inner p-4 flex justify-center gap-4">
                        <input type="file" onChange={handleFileChange} />
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-full flex justify-center items-center" onClick={handleSubmit}>
                            Submit
                        </button>
                    </div>
                )}


            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4">
  {names !== null &&
    names.map((d, k) => (
      <div key={k} className="border-solid border-2 border-black rounded-lg p-4 text-black bg-white shadow-md">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={checkboxStates[d.id]}
            onChange={() => handleCheckboxChange(d.id, d.opportunity_name, d.email, d.member_id)}
            className="mr-4"
          />
          <img
            src={`http://localhost:5001/uploads/${d.photos}`}
            alt="Opportunity"
            className="rounded-full h-16 w-16 border-2 border-black hover:border-gray-700 transition-all"
          />
        </div>
        <div className="mt-4">
          <div className="grid grid-cols-1 gap-2">
            <div>
              <p className="font-bold">Opportunity name:</p>
              <p className="text-gray-700 text-sm">{d.opportunity_name}</p>
            </div>
            <div>
              <p className="font-bold">Opportunity provider:</p>
              <p className="text-gray-700 text-sm">{d.opportunity_provider}</p>
            </div>
            <div>
              <p className="font-bold">Start Date:</p>
              <p className="text-gray-700 text-sm">{d.opportunity_start_date}</p>
            </div>
            <div>
              <p className="font-bold">End Date:</p>
              <p className="text-gray-700 text-sm">{d.opportunity_end_date}</p>
            </div>
            <div>
              <p className="font-bold">Problem statement:</p>
              <p className="text-gray-700 text-sm">{d.opportunity_problem_statement}</p>
            </div>
            <div>
              <p className="font-bold">Expected Solution:</p>
              <p className="text-gray-700 text-sm">{d.opportunity_expected_solution}</p>
            </div>
            <div>
              <p className="font-bold">Project Name:</p>
              <p className="text-gray-700 text-sm">{d.projectname}</p>
            </div>
            {/* <div>
              <p className="font-bold">Education Streams:</p>
              <p className="text-gray-700 text-sm">{d.educationstreams}</p>
            </div> */}
          </div>
        </div>
      </div>
    ))}
</div>

        </div>
      </div>
    </>
  );
};
export default Opportunity;