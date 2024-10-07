import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import * as API from "./../../../Endpoint/endpoint";

const AllocationOppoTable = () => {
    useEffect(() => {
        getData();
    }, []);

    const [member, setMember] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    const getData = () => {
        axios({
            url: API.GET_OPPORTUNITALLOCATION_API,
            method: 'GET',
            contentType: 'application/json',
        }).then((res) => {
            setMember(res.data);
        }).catch((err) => {
            alert("failure", err);
        });
    };

    const DeleteMember = (id) => {
        axios({
            url: (API.DELETE_OPPORTUNITYALLOCATION_API(id)),
            method: 'delete',
        })
            .then((res) => {
                alert("Delete record successfully");
                getData();
            })
            .catch((err) => {
                console.error("Error deleting record:", err);
                alert("Error: " + err.message);
            });
    };

    const navigate = useNavigate();

    const ViewMember = (id) => {
        sessionStorage.setItem("member_id", id);
        navigate("/admin/viewallo");
    };

    const AddMemberShip = () => {
        navigate("/admin/addallo");
    };

    const UpdateMemberS = (id) => {
        sessionStorage.setItem("member_id", id);
        navigate("/admin/updateallo");
    };

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * itemsPerPage;
    const currentPageData = member.slice(offset, offset + itemsPerPage);

    return (
        <>
            <div className='bg-[#B5B5B5] h-auto pb-20 pt-10'>
                <div className='pt-20'>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-full flex justify-center items-center mx-auto" onClick={AddMemberShip}>
                        Add Opportunity Allocation
                    </button>
                </div>
                <div className="max-w-3xl mx-auto pt-20">
                    <div className="flex flex-col">
                        <div className="overflow-x-auto shadow-md sm:rounded-lg">
                            <div className="inline-block min-w-full align-middle">
                                <div className="overflow-hidden">
                                    <table className="min-w-full divide-y divide-black table-fixed dark:divide-gray-700">
                                        <thead className="bg-white font=bold dark:bg-white-700">
                                            <tr>
                                                <th scope="col" className="py-3 px-6 text-xs  tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">
                                                    Id
                                                </th>
                                                <th scope="col" className="py-3 px-6 text-xs  tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">
                                                    Allocated By
                                                </th>
                                                <th scope="col" className="py-3 px-6 text-xs  tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">
                                                    Allocated To
                                                </th>
                                                <th scope="col" className="py-3 px-6 text-xs  tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                            {
                                                currentPageData.map((d, k) => (
                                                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-700" key={k}>
                                                        <td className="py-3 px-6 text-xs font-medium  tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">{d.id}</td>
                                                        <td className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">{d.opportunity_allocated_by}</td>
                                                        <td className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">{d.opportunity_allocated_to}</td>
                                                        <td className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">
                                                            <div className='inline pr-3'>
                                                                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-full" onClick={() => ViewMember(d.id)}>
                                                                    View
                                                                </button>
                                                                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full ml-1" onClick={() => DeleteMember(d.id)}>
                                                                    Delete
                                                                </button>
                                                                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full ml-1" onClick={() => UpdateMemberS(d.id)}>
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
                                           
                                            pageCount={Math.ceil(member.length / itemsPerPage)}
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
            </div>
        </>
    );
};

export default AllocationOppoTable;
