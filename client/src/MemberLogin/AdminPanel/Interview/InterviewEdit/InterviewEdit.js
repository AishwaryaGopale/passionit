// import React, { useEffect, useRef, useState } from 'react'
// import axios from 'axios'
// import * as API from "../../../../Endpoint/endpoint";

// const InterviewEdit = () => {
//     useEffect(() => {
//         GetOpp();
//         GetUser();
//     }, []);

//     const [opp, setOpp] = useState([]);
//     const [user, setUser] = useState([]);

//     const GetUser = () => {
//         axios({
//             url: (API.GET_MEMBERS_API),
//             method: "GET",
//             contentType: "application/json",
//         }).then((res) => {
//             setUser(res.data);
//         }).catch((err) => {
//             alert(err.message)
//         })
//     }



//     const GetOpp = () => {
//         axios({
//             url: (API.GET_OPPORTUNITIES_API),
//             method: 'GET',
//             contentType: 'application/json',
//         })
//             .then((res) => {
//                 setOpp(res.data);
//             })
//             .catch((err) => {
//                 console.error('Error fetching opportunities', err);
//                 alert('Error fetching opportunities');
//             });
//     };

//     const interviewed_by = useRef();
//     const interview_assessment = useRef();
//     const interview_score = useRef();
//     const interview_video_link = useRef();
//     const opportunity_id = useRef();
//     const AddInterviewInfo = () => {
//         var playload = {
//             interviewed_by: interviewed_by.current.value,
//             interview_assessment: interview_assessment.current.value,
//             interview_score: interview_score.current.value,
//             interview_video_link: interview_video_link.current.value,
//             opportunity_id: opportunity_id.current.value

//         }
//         console.log(playload)

//         axios({
//             url: (API.POST_MEMBERINTERVIEWRECORDS_API),
//             method: 'POST',
//             data: playload,
//             contentType: 'application/json'
//         }).then((res) => {
//             alert("done")
//         }).catch((err) => {
//             alert("error: " + err)
//         })


//         console.log(playload)

//     }

//     return (
//         <>
//             <div class="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
//                 <div class="container max-w-screen-lg mx-auto">
//                     <div>
//                         <h2 class="font-semibold text-xl text-gray-600">InterView Form</h2>
//                         <p class="text-gray-500 mb-6">InterView.</p>

//                         <div class="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
//                             <div class="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
//                                 <div class="text-gray-600">
//                                     <p class="font-medium text-lg">InterView Details</p>
//                                     <p>Please fill out all the fields.</p>
//                                 </div>

//                                 <div class="lg:col-span-2">
//                                     <div class="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
//                                         <div class="md:col-span-5">
//                                             <label>Interviewed By </label>
//                                             <select class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={interviewed_by}>
//                                                 <option value="option1">select</option>
//                                                 {
//                                                     user.map((d,k)=>(
//                                                         <option value={d.member_id}>{d.member_name}</option>  
//                                                     ))
//                                                 }
//                                             </select>
//                                         </div>

//                                         <div class="md:col-span-5">
//                                             <label for="email">Interview Assessment</label>
//                                             <input type="text" name="email" id="email" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={interview_assessment} />
//                                         </div>

//                                         <div class="md:col-span-5">
//                                             <label for="full_name">Interview Score</label>
//                                             <input type="text" name="full_name" id="full_name" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={interview_score} />
//                                         </div>

//                                         <div class="md:col-span-5">
//                                             <label for="email">Interview Video Link</label>
//                                             <input type="text" name="email" id="email" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={interview_video_link} />
//                                         </div>

//                                         <div class="md:col-span-5">
//                                             <label for="opportunity_id">Opportunity </label>
//                                             <select class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={opportunity_id}>
//                                                 <option value="">Select Opportunity </option>
//                                                 {
//                                                     opp.map((d, k) => (
//                                                         <option key={k} value={d.opportunity_id}>{d.opportunity_name}</option>
//                                                     ))
//                                                 }
//                                             </select>
//                                         </div>

//                                         <div class="md:col-span-5 text-right">
//                                             <div class="inline-flex items-end">
//                                                 <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => AddInterviewInfo()}>Submit</button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default InterviewEdit
 
 
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import * as API from "../../../../Endpoint/endpoint";

const InterviewEdit = ({ interviewId }) => {
    useEffect(() => {
        GetOpp();
        GetUser();
        if (interviewId) {
            GetInterviewById(interviewId);
        }
    }, [interviewId]);

    const [opp, setOpp] = useState([]);
    const [user, setUser] = useState([]);

    const GetUser = () => {
        axios({
            url:(API.GET_MEMBERS_API),
            method: "GET",
            contentType: "application/json",
        }).then((res) => {
            setUser(res.data);
        }).catch((err) => {
            alert(err.message);
        });
    };

    const GetOpp = () => {
        axios({
            url:(API.GET_OPPORTUNITIES_API),
            method: 'GET',
            contentType: 'application/json',
        }).then((res) => {
            setOpp(res.data);
        }).catch((err) => {
            console.error('Error fetching opportunities', err);
            alert('Error fetching opportunities');
        });
    };

    const GetInterviewById = (id) => {
        axios({
            url: (API.GET_MEMBERINTERVIEWRECORDS_API(id)),
            method: 'GET',
            contentType: 'application/json',
        }).then((res) => {
            const data = res.data;
            interviewed_by.current.value = data.interviewed_by;
            interview_assessment.current.value = data.interview_assessment;
            interview_score.current.value = data.interview_score;
            interview_video_link.current.value = data.interview_video_link;
            opportunity_id.current.value = data.opportunity_id;
        }).catch((err) => {
            console.error('Error fetching interview record', err);
            alert('Error fetching interview record');
        });
    };

    const interviewed_by = useRef();
    const interview_assessment = useRef();
    const interview_score = useRef();
    const interview_video_link = useRef();
    const opportunity_id = useRef();

    const AddInterviewInfo = () => {
        const playload = {
            interviewed_by: interviewed_by.current.value,
            interview_assessment: interview_assessment.current.value,
            interview_score: interview_score.current.value,
            interview_video_link: interview_video_link.current.value,
            opportunity_id: opportunity_id.current.value
        };
        console.log(playload);

        axios({
            url: API.POST_MEMBERINTERVIEWRECORDS_API,
            method: 'POST',
            data: playload,
            contentType: 'application/json'
        }).then((res) => {
            alert("done");
        }).catch((err) => {
            alert("error: " + err);
        });
    };

    return (
        <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
            <div className="container max-w-screen-lg mx-auto">
                <div>
                    <h2 className="font-semibold text-xl text-gray-600">Interview Form</h2>
                    <p className="text-gray-500 mb-6">Interview.</p>
                    <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                        <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                            <div className="text-gray-600">
                                <p className="font-medium text-lg">Interview Details</p>
                                <p>Please fill out all the fields.</p>
                            </div>
                            <div className="lg:col-span-2">
                                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                                    <div className="md:col-span-5">
                                        <label>Interviewed By</label>
                                        <select className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={interviewed_by}>
                                            <option value="">Select</option>
                                            {user.map((d, k) => (
                                                <option key={k} value={d.member_id}>{d.member_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="md:col-span-5">
                                        <label htmlFor="email">Interview Assessment</label>
                                        <input type="text" name="email" id="email" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={interview_assessment} />
                                    </div>
                                    <div className="md:col-span-5">
                                        <label htmlFor="full_name">Interview Score</label>
                                        <input type="text" name="full_name" id="full_name" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={interview_score} />
                                    </div>
                                    <div className="md:col-span-5">
                                        <label htmlFor="email">Interview Video Link</label>
                                        <input type="text" name="email" id="email" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={interview_video_link} />
                                    </div>
                                    <div className="md:col-span-5">
                                        <label htmlFor="opportunity_id">Opportunity</label>
                                        <select className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" ref={opportunity_id}>
                                            <option value="">Select Opportunity</option>
                                            {opp.map((d, k) => (
                                                <option key={k} value={d.opportunity_id}>{d.opportunity_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="md:col-span-5 text-right">
                                        <div className="inline-flex items-end">
                                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={AddInterviewInfo}>Submit</button>
                                        </div>
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

export default InterviewEdit;
