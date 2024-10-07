import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import * as API from "../../../../Endpoint/endpoint";

const RefrenceTable = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5; // Number of items per page

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        axios({
            url: API.ADD_RESAERCHREF_API,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((res) => {
            setData(res.data);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
    };

    const Delete = (id) => {
        axios({
            url: API.DELETE_STUDENTREFERENCE_API(id),
            method: 'DELETE',
        })
        .then((res) => {
            alert("Deleted successfully");
            getData(); // Refresh data after deletion
        })
        .catch((err) => {
            alert("Delete failed");
        });
    };

    const View = (id) => {
        sessionStorage.setItem("user_id", id);
        navigate("/admin/refrenceview");
    };

    const Edit = (id) => {
        sessionStorage.setItem("user_id", id);
        navigate("/admin/refrenceedit");
    };

    const GoBack = () => {
        navigate("/admin");
    };

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * itemsPerPage;
    const currentPageData = data.slice(offset, offset + itemsPerPage);

    return (
        <>
            <div className='flex items-center justify-center p-3'>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={() => navigate("/admin/refrence")}>
                    &#8592; Add Reference
                </button>
            </div>
            <div className="max-w-2xl mx-auto pt-[30px]">
                <h3 className='p-3 font-bold text-center'>Ideation Reference</h3>
                <div className="flex flex-col">
                    <div className="overflow-x-auto shadow-md sm:rounded-lg">
                        <div className="inline-block min-w-full align-middle">
                            <div className="overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700">
                                    <thead className="bg-[#7f7ff5] dark:bg-[#8b8bf7]">
                                        <tr>
                                            <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">
                                                Id
                                            </th>
                                            <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">
                                                Name
                                            </th>
                                            <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">
                                                srnumber
                                            </th>
                                            <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700 text-center">
                                        {
                                            currentPageData.map((d, k) => (
                                                <tr className="hover:bg-gray-100 dark:hover:bg-gray-700" key={k}>
                                                    <td className="py-3 px-6 text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-400">{d.id}</td>
                                                    <td className="py-3 px-6 text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-400">{d.name}</td>
                                                    <td className="py-3 px-6 text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-400">{d.srnumber}</td>
                                                    <td className="py-3 px-6 text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-400">
                                                        <div className='inline pr-[3px]'>
                                                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-full" onClick={() => View(d.id)}>
                                                                View
                                                            </button>
                                                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full ml-1" onClick={() => Delete(d.id)}>
                                                                Delete
                                                            </button>
                                                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full ml-1" onClick={() => Edit(d.id)}>
                                                                Edit
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                                <div className="flex justify-center mt-4">
                                    <ReactPaginate
                                        previousLabel={"Previous"}
                                        nextLabel={"Next"}
                                        breakLabel={"..."}
                                        pageCount={Math.ceil(data.length / itemsPerPage)}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={5}
                                        onPageChange={handlePageClick}
                                        containerClassName={"pagination"}
                                        subContainerClassName={"pages pagination"}
                                        activeClassName={"active"}
                                        pageClassName={"inline-block px-3 py-1 border border-gray-300 bg-white text-black-700 hover:bg-blue-200"}
                                        pageLinkClassName={"page-link"}
                                        previousClassName={"inline-block px-3 py-1 border border-gray-300 bg-white text-black-700 hover:bg-blue-200"}
                                        previousLinkClassName={"page-link"}
                                        nextClassName={"inline-block px-3 py-1 border border-gray-300 bg-white text-black-700 hover:bg-blue-200"}
                                        nextLinkClassName={"page-link"}
                                        breakClassName={"inline-block px-3 py-1 border border-gray-300 bg-white text-black-700 hover:bg-blue-200 break-me"}
                                        breakLinkClassName={"page-link"}
                                        activeLinkClassName={"bg-blue-500 text-black"}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex items-center justify-center p-3'>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={() => GoBack()}>
                    &#8592; Go Back
                </button>
            </div>
        </>
    );
};

export default RefrenceTable;
