// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import * as API from "./../../../../Endpoint/endpoint";

// const ReferenceTableID = () => {
//     useEffect(() => {
//         getData();
//     }, []);

//     const [data, setData] = useState([]);
//     const [nestedData, setNestedData] = useState({});

//     const getData = () => {
//         var id = sessionStorage.getItem("user_id");
//         axios.get(API.GET_MEMBERID_API(id))
//             .then((res) => {
//                 setData(res.data);
//             })
//             .catch((error) => {
//                 console.error("Error fetching data:", error);
//             });
//     };

//     const fetchDataForId = (id) => {
//         axios.get(API.GET_MEMBERID_API(id))
//             .then((res) => {
//                 setNestedData(prevState => ({
//                     ...prevState,
//                     [id]: res.data
//                 }));
//             })
//             .catch((error) => {
//                 console.error("Error fetching nested data:", error);
//             });
//     };

//     const renderNestedData = (nestedItems, level) => {
//         return (
//             <div className={`pl-${level * 2} py-1 text-xs font-medium tracking-wider text-gray-600 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-gray-100 transition duration-300`}>
//                 {nestedItems.map((nested, index) => (
//                     <div key={index} className="flex items-center" onClick={() => fetchDataForId(nested.id)}>
//                         <span className="mr-2">{nestedData[nested.id] ? '[-]' : '[+]'}</span>
//                         {index + 1}.{nested.member_name}
//                         {nestedData[nested.id] && renderNestedData(nestedData[nested.id], level + 1)}
//                     </div>
//                 ))}
//             </div>
//         );
//     };

//     return (
//         <div className="p-4">
//             {data.map((d, k) => (
//                 <div key={k} className="hover:bg-gray-100 dark:hover:bg-gray-700">
//                     <div className="py-3 px-6 text-xs font-medium tracking-wider text-gray-700 dark:text-gray-400 cursor-pointer" onClick={() => fetchDataForId(d.id)}>
//                         <span className="mr-2">{nestedData[d.id] ? '[-]' : '[+]'}</span>
//                         {d.id}.{d.member_name}
//                     </div>
//                     {nestedData[d.id] && renderNestedData(nestedData[d.id], 1)}
//                 </div>
//             ))}
//         </div>
//     );
// };


// export default ReferenceTableID;



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as API from "./../../../../Endpoint/endpoint";


const ReferenceTableID = () => {
    useEffect(() => {
        getData();
    }, []);

    const [data, setData] = useState([]);
    const [nestedData, setNestedData] = useState({});

    const getData = () => {
        var id = sessionStorage.getItem("user_id");
        axios.get(API.GET_MEMBERID_API(id))
            .then((res) => {
                setData(res.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    const fetchDataForId = (id) => {
        if (nestedData[id]) {
            setNestedData(prevState => ({
                ...prevState,
                [id]: undefined // Clear the nested data to close it
            }));
        } else {
            axios.get(API.GET_MEMBERID_API(id))
                .then((res) => {
                    setNestedData(prevState => ({
                        ...prevState,
                        [id]: res.data
                    }));
                })
                .catch((error) => {
                    console.error("Error fetching nested data:", error);
                });
        }
    };

    const renderNestedData = (nestedItems, level) => {
        return (
            <>
                <div className={`pl-${level * 2} py-1 text-[blue] justify-start`}>
                    {nestedItems.map((nested, index) => (
                        <div key={index} className="" onClick={() => fetchDataForId(nested.id)}>
                            <span className="pl-[10px] inline"> {index + 1}{nestedData[nested.id] ? '[-]' : '[+]'}
                            {nested.member_name}
                            <img src={`http://localhost:3001/uploads/${nested.photo}`} className='w-[80px] h-[80px] border border-black rounded-[50px]' alt={nested.member_name} />
                            </span>

                            <div className='pl-[100px]'>
                                {nestedData[nested.id] && renderNestedData(nestedData[nested.id], level + 1)}
                                
                            </div>
                        </div>
                    ))}
                </div>
            </>
        );
    };

    return (
        <>
            <div className="p-4">
                <h1 className='text-black text-center text-[30px]'>Network</h1>
                <center>
                    {data.map((d, k) => (
                        <div key={k} className="">
                            <div className="py-3 cursor-pointer text-[blue] justify-start" onClick={() => fetchDataForId(d.id)}>
                                <span className="mr-2">{k + 1}{nestedData[d.id] ? '[-]' : '[+]'}</span>
                                {d.member_name}
                            </div>
                            <div className='pl-[100px]'>
                                {nestedData[d.id] && renderNestedData(nestedData[d.id], 1)}
                            </div>
                        </div>
                    ))}
                </center>
            </div>
        </>
    );
};


export default ReferenceTableID;
