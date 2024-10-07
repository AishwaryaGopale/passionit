//const BASE_URL="http://103.224.247.193/passion-api/";
const BASE_URL ="http://localhost:5001/passion-api/";

//////////////////ALLOCATION OPPO///////////////////////
export const GET_MEMBERS_API =`${BASE_URL}api/members`;


export const POST_OPPORTUNITALLOCATION_API =`${BASE_URL}api/post/opportunityallocation`;

export const GET_OPPORTUNITYALLOCATION_API =(id)=> `${BASE_URL}api/opportunity_allocation/${id}`;

export const UPDATE_OPPORTUNITYALLOCATION_API =(id)=> `${BASE_URL}api/update/opportunityallocation/${id}`;

export const DELETE_OPPORTUNITYALLOCATION_API =(id)=> `${BASE_URL}api/opportunityallocation/${id}`;

export const GET_OPPORTUNITALLOCATION_API =`${BASE_URL}api/get/opportunityallocation`;

///////////////INTERSET///////////////////////////////
export const GET_INTERESTEDPEOPLE_API =(member_id)=>`${BASE_URL}api/get/interestedpeople/${member_id}`;

export const DELETE_INTERESTED_API =(id)=> `${BASE_URL}api/delete/interested/${id}`;

export const GET_ALLINTERESTEDPEOPLE_API =`${BASE_URL}api/get/interestedpeople`;

/////////////////////INTERVIEW////////////////////////////////////
export const POST_MEMBERINTERVIEWRECORDS_API =`${BASE_URL}api/post/memberinterviewrecords`;

export const GET_MEMBERINTERVIEWRECORDS_API =`${BASE_URL}api/get/memberinterviewrecords`;

export const DELETE_MEMBERINTERVIEWRECORDS_API =(id)=> `${BASE_URL}api/memberinterviewrecords/${id}`;

export const ADD_MEMBERINTERVIEWRECORDS_API =(interviewId)=> `${BASE_URL}get/api/member_interview_records/${interviewId}`


////////////////////Membership records////////////////////

export const POST_MEMBERSHIPRECORDS_API =`${BASE_URL}api/add/membershiprecord`;

export const POST_INTERESTEDPEOPLE_API =`${BASE_URL}api/post/interestedpeople`;

export const GET_MEMBERSHIPRECORDS_API =(id)=> `${BASE_URL}api/id/membershiprecord/${id}`;

export const PUT_MEMBERSHIPRECORDS_API =(id)=> `${BASE_URL}api/update/membershiprecord/${id}`;

export const DELETE_MEMBERSHIPRECORDS_API =(id)=> `${BASE_URL}api/delete/membershiprecord/${id}`

export const ADD_MEMBERSHIPRECORDS_API =`${BASE_URL}api/membershiprecords`;

////////////////////Membertable////////////////////////

export const ADD_MEMBERSHIPMASTER_API =`${BASE_URL}api/get/membergroupmaster`;

export const ADD_MEMBERSHIPTYPE_API =`${BASE_URL}api/get/membertypes`;

export const ADD_MEMBERSHIPCATEGORIES_API =`${BASE_URL}api/get/membercategories`;

export const POST_MEMBER_API =`${BASE_URL}api/add/members`;

export const PUT_MEMBER_API =(id)=> `${BASE_URL}api/update/member/${id}`;

export const GET_MEMBER_API =(id)=> `${BASE_URL}get/api/members/${id}`

export const DELETE_MEMBERS_API =(id)=> `${BASE_URL}api/delete/members/${id}`

///////////////////////////api/opportunity/////////////////////////

export const POST_OPPORTUNITY_API =`${BASE_URL}api/opportunity`;

export const ADD_CSVUPLOAD_API =`${BASE_URL}csvupload`;

export const ADD_OPPORTUNITYTYPE_API =`${BASE_URL}api/get/opportunity_types`;

export const POST_OPPORTUNITYTYPE_API =`${BASE_URL}api/opportunity_types`;

export const GET_OPPORTUNITY_API =(id)=> `${BASE_URL}api/get/opportunity/${id}`

export const GET_OPPORTUNITY_BYUSERSID =(member_id)=>`${BASE_URL}api/getOpportunityByUserid/${member_id}`

export const PUT_OPPORTUNITY_API =(id)=> `${BASE_URL}api/update/opportunity/${id}`;

export const DELETE_OPPORTUNITY_API =(id)=> `${BASE_URL}api/delete/opportunities/${id}`;


///////////////Resourcesmaster/////////////////////

export const ADD_RESOURCEMASTER_API =`${BASE_URL}api/get/resourcemaster`;

//////////////Studentideation   addResarch/////////////////////////////////

export const POST_RESAERCH_API =`${BASE_URL}add/research`;

/////////////////////Studentideation    ADDRESEARCHREF//////////////////////////////

export const POST_RESAERCHREF_API =`${BASE_URL}researchref`;

////////////////////EDITREFERENCE//////////////////////////////////

export const GET_EDITREFERENCE_API =(id)=> `${BASE_URL}get/studentsrefrence/${id}`

//////////////////////referenceview///////////////////////////////////

export const DELETE_STUDENTREFERENCE_API =(id)=> `${BASE_URL}delete/studentsrefrence/${id}`;

///////////////////////referencetable///////////////////////////////////////////

export const ADD_RESAERCHREF_API =`${BASE_URL}studentsrefrence`;

/////////////////researchtable///////////////////////////////////////

export const ADD_RESAERCHR_API =`${BASE_URL}research`;
 
export const DELETE_RESEARCH_API =(id)=> `${BASE_URL}delete/research/${id}`;

////////////////RESEARCHVIEW/////////////////////////

export const GET_RESEARCHVIEW_API =(id)=> `${BASE_URL}get/research/${id}`

//////////////////////researchedit//////////////////////////////////

export const GET_RESEARCHEDITREF_API =(id)=> `${BASE_URL}get/researchref/${id}`

////////////////////////////researchref//////////////////////////////////

export const ADD_RESAERCHRREF_API =`${BASE_URL}researchref`;

//////////////////////////////////////////////

export const DELETE_RESEARCHREF_API =(id)=> `${BASE_URL}delete/researchref/${id}`;

/////////////studentadmintable//////////////////////////////////

export const ADD_IDEATION_API =`${BASE_URL}ideation`;

export const DELETE_IDEATION_API =(id)=> `${BASE_URL}delete/ideation/${id}`;

export const POST_IDEATION_API =`${BASE_URL}add/ideation`;

export const GET_IDEATION_API =(id)=> `${BASE_URL}get/ideation/${id}`

export const PUT_IDEATION_API =(id)=> `${BASE_URL}update/ideation/${id}`;

//////////////////studentreference///////////////////////

export const POST_STUDENTREFERENCE_API =`${BASE_URL}post/studentsrefrence`;

////////////////////studentview/////////////////////////////

export const POST_MEMBERSSTUDENT_API =`${BASE_URL}add/members/studentids`;

/////////////////////login///////////////////////////////

export const POST_LOGIN_API =`${BASE_URL}api/login`;

/////////////////ADDGROUPMEMBER///////////////////////////

export const ADD_GROUPMEMBER_API =`${BASE_URL}api/groups`;

export const POST_GROUPMEMBER_API =`${BASE_URL}api/group_member`;

export const DELETE_GROUPMEMBER_API =(id)=> `${BASE_URL}delete/api/groups/${id}`;

export const ADD_GROUPMEMBERS_API =`${BASE_URL}get/api/group_member`;

export const DELETE_GROUPMEMBERS_API =(id)=> `${BASE_URL}delete/api/group_member/${id}`;

////////////////////ADDGROUP///////////////////////////

export const POST_CREATEGROUP_API =`${BASE_URL}api/create-group`;

/////////////////CALULATERPER////////////////////////////

export const ADD_OPPORTUNITYINCENTIVE_API =`${BASE_URL}get/api/opportunity_incentive`;

export const DELETE_OPPORTUNITYINCENTIVE_API =(id)=> `${BASE_URL}delete/api/opportunity_incentive/${id}`;

export const GET_OPPORTUNITYINCENTIVE_API_API =(id)=> `${BASE_URL}api/opportunity_incentive/${id}`

///////////////incentive/////////////////////////////////

export const POST_OPPORTUNITYINCENTIVE_API =`${BASE_URL}post/api/opportunity_incentive`;

///////////////EOLDATAVIEW//////////////////////////

export const POST_EOLDATAVIEW_API =`${BASE_URL}post/api/selection_status/result`;

export const ADD_SELECTIONSTATUS_API =`${BASE_URL}get/api/selection_status/results`;

/////////////////MERGED_GROUP////////////////////////////

export const ADD_MERGEDGROUP_API =`${BASE_URL}get/api/merged_groups`;

////////////////NESTEDGROUP////////////////////////////////

export const GET_GROUP_API =(id)=> `${BASE_URL}api/group/mid/${id}`

export const ADD_GROUP_API =`${BASE_URL}api/groups`;

export const POST_GROUP_API =`${BASE_URL}post/api/merged_groups`;

/////////////////APPLYED///////////////////
export const GET_SELECTIONSTATUS_API =(id)=> `${BASE_URL}api/selection_status/result/${id}`

export const PUT_SELECTIONSTATUS_API =(id)=> `${BASE_URL}api/selection_status/update/${id}`;

///////////////OPPORTUNITY//////////////////////////////

export const ADD_OPPORTUNITY_API =`${BASE_URL}api/opportunity`;

///////////////////SEND EMAIL///////////////////////////

export const POST_SENDEMAIL_API =`${BASE_URL}send-email`;

///////////////MEMBERREFERENCE//////////////////

export const POST_MEMBERREFERENCE_API =`${BASE_URL}post/api/memberrefrence`;

export const GET_GETMEMBER_API =(id)=> `${BASE_URL}get/api/members/${id}`

export const ADD_MEMBERREFERENCE_API =`${BASE_URL}api/get/memberrefrence`;

export const DELETE_MEMBERREFERENCE_API =(id)=> `${BASE_URL}api/delete/memberrefrence/${id}`;

export const GET_MEMBERREFERENCE_API =(id)=> `${BASE_URL}api/memberrefrence/${id}`

/////////////////////referencetableid////////////////////////

export const GET_MEMBERID_API =(id)=> `${BASE_URL}api/member_id/${id}`

//////////////////VALUEPER//////////////////////////

export const POST_VALUEPER_API =`${BASE_URL}post/api/values_per`;

export const GET_VALUEPER_API =`${BASE_URL}get/api/values_per`

export const PUT_VALUEPER_API =(id)=> `${BASE_URL}put/api/values_per/${id}`;

export const DELETE_VALUEPER_API =(id)=> `${BASE_URL}delete/api/values_per/${id}`;

export const ADD_VALUEPER_API =(id)=> `${BASE_URL}api/values_per/${id}`;


/////////////////////////////////////

export const GET_OPPORTUNITIES_API =`${BASE_URL}api/opportunity`

export const PUT_STUDENTREFERENCE_API =(ids)=> `${BASE_URL}put/studentsrefrence/${ids}`;

export const GET_USEROPPORTUNITIES_API =(user_id) =>`${BASE_URL}api/useropportunity/${user_id}`

//////////////////////////////////////////

export const PUT_RESEARCHREF_API =(id)=> `${BASE_URL}put/researchref/${id}`;


///////////////////////////////////////
export const PUT_RESEARCH_API =(id)=> `${BASE_URL}update/research/${id}`;


//////////////////////////////////////
export const POST_CSVUPLOADREFERENCE_API =`${BASE_URL}reference/csvupload`;
////////////////////////////////////

export const GET_OPPORTUNITYS_API =(opportunity_type_id)=> `${BASE_URL}api/opportunitys/${opportunity_type_id}`

export const GET_OPPORTUNITYDATAGAP_API =(gap)=> `${BASE_URL}api/opportunity/date-gap/${gap}`

export const GET_OPPORTUNITYPROVIDER_API =(provider)=> `${BASE_URL}api/opportunity/provider/${provider}`

export const GET_OPPORTUNITYWORKZONE_API =(workZone)=> `${BASE_URL}api/opportunity/work-zone/${workZone}`

///////////////////////////////////////////
export const GET_VIEWEOL_API =(id)=>`${BASE_URL}api/memberidoppodata/intre/${id}`


//////////////////////forgetpassword////////////////////////
export const POST_FORGET_PASSWORD_API =`${BASE_URL}forget-password`;

export const POST_RESET_PASSWORD_API =`${BASE_URL}reset-password`;


/////////////////////opportunities in members table///////////////////////////

export const POST_MEMBER_OPPORTUNITIES_API =`${BASE_URL}post/add-opportunity`;

export const GET_MEMBER_OPPORTUNITIES_API =`${BASE_URL}get/memberopportunities`

///////////////////transaction/////////////////////////////
export const POST_TRANSACTION_API =`${BASE_URL}post/transaction`;

export const GET_TRANSACTION_API =`${BASE_URL}get/transaction`

export const GET_TRANSACTION_BYID=(transactionid) =>`${BASE_URL}get/transaction/${transactionid}`


export const DELETE_TRANSACTION_API =(transactionid)=> `${BASE_URL}api/delete/transaction/${transactionid}`

export const PUT_TRANSACTION_API =(transactionid)=> `${BASE_URL}api/update/transaction/${transactionid}`;
