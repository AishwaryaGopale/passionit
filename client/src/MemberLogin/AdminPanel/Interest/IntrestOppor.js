import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import * as API from "./../../../Endpoint/endpoint";

const IntrestOppor = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5; // Number of items per page

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        axios({
            url: API.GET_ALLINTERESTEDPEOPLE_API,
            method: 'GET',
        })
        .then((res) => {
            setData(res.data);
        })
        .catch((err) => {
            console.error("Error fetching data:", err);
            alert("Failed to fetch data");
        });
    };

    const deleteData = (id) => {
        axios({
            url: API.DELETE_INTERESTED_API(id),
            method: 'DELETE',
        })
        .then((res) => {
            alert("Deleted successfully");
            getData(); // Refresh data after deletion
        })
        .catch((err) => {
            alert("Failed to delete");
        });
    };

    const ViewMember = (id) => {
        sessionStorage.setItem("member_id", id);
        navigate("/admin/viewmember");
    };

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * itemsPerPage;
    const currentPageData = data.slice(offset, offset + itemsPerPage);

    return (
        <>
            <div className="max-w-5xl mx-auto pt-[30px]">
                <div className="flex flex-col">
                    <div className="overflow-x-auto shadow-md sm:rounded-lg">
                        <div className="inline-block min-w-full align-middle">
                            <div className="overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700">
                                    <thead className="bg-white font-bold dark:bg-white">
                                        <tr>
                                            <th scope="col" className="py-3 px-6 text-xs  tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">
                                                Member Id
                                            </th>
                                            <th scope="col" className="py-3 px-6 text-xs  tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">
                                                Member Name
                                            </th>
                                            <th scope="col" className="py-3 px-6 text-xs  tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">
                                                Email
                                            </th>
                                            <th scope="col" className="py-3 px-6 text-xs  tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">
                                                Opportunity
                                            </th>
                                            <th scope="col" className="py-3 px-6 text-xs  tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                        {currentPageData.map((d, k) => (
                                            <tr className="hover:bg-gray-100 dark:hover:bg-gray-700" key={k}>
                                                <td className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">{d.interest_id}</td>
                                                <td className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">{d.interested_name}</td>
                                                <td className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">{d.email}</td>
                                                <td className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">{d.opportunity_name}</td>
                                                <td className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">
                                                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full ml-1" onClick={() => deleteData(d.id)}>Delete</button>
                                                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full ml-1" onClick={() => ViewMember(d.interest_id)}>View Member</button>
                                                </td>
                                            </tr>
                                        ))}
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
        </>
    );
};

export default IntrestOppor;
