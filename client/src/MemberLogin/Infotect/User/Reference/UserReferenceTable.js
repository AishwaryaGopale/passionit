import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import * as API from "../../../../Endpoint/endpoint";

const UserReferenceTable = () => {
    useEffect(() => {
        getData();
    }, []);

    const [member, setMember] = useState([]);
    const [file, setFile] = useState(null);
    const [showFileInput, setShowFileInput] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    const getData = () => {
        axios({
            url: API.ADD_MEMBERREFERENCE_API,
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
            url: API.DELETE_MEMBERREFERENCE_API(id),
            method: 'delete',
        }).then((res) => {
            alert("Delete member successfully");
            getData();
        }).catch((err) => {
            alert("Error: " + err);
        });
    };

    const navigate = useNavigate();

    const ViewMember = (id) => {
        sessionStorage.setItem("id", id);
        navigate("/user/referenceview");
    };

    const AddMember = () => {
        navigate("/user/referenceadd");
    };

    const UpdateMember = (id) => {
        sessionStorage.setItem("member_id", id);
        navigate("/admin/updateintern");
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            await axios.post(API.POST_CSVUPLOADREFERENCE_API, formData, {
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

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * itemsPerPage;
    const currentPageData = member.slice(offset, offset + itemsPerPage);

    return (
        <>
            <div className='bg-[#B5B5B5] h-[auto] pb-20 pt-10'>
                <div className='p-4 flex justify-center gap-4'>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-full flex justify-center items-center" onClick={AddMember}>
                        Add Reference
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-full flex justify-center items-center" onClick={() => setShowFileInput(true)}>
                        Upload File
                    </button>
                </div>

                {showFileInput && (
                    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-4">
                        <div className="p-4">
                            <input type="file" onChange={handleFileChange} className="w-full py-2 px-4 border border-gray-300 rounded-md mb-4" />
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-full w-full" onClick={handleSubmit}>
                                Submit
                            </button>
                        </div>
                    </div>
                )}

                <div className="max-w-4xl mx-auto pt-[30px]">
                    <div className="flex flex-col">
                        <div className="overflow-x-auto shadow-md sm:rounded-lg">
                            <div className="inline-block min-w-full align-middle">
                                <div className="overflow-hidden ">
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
                                                    Sr.Number
                                                </th>
                                                <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">
                                                    Reference Name
                                                </th>
                                                <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">
                                                    Phone Number
                                                </th>
                                                <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                            {
                                                currentPageData.map((d, k) => (
                                                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-700" key={k}>
                                                        <td className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">{d.id}</td>
                                                        <td className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">{d.name}</td>
                                                        <td className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">{d.srnumber}</td>
                                                        <td className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">{d.referencename}</td>
                                                        <td className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">{d.referencephone}</td>
                                                        <td className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">
                                                            <div className='inline pr-[3px]'>
                                                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-full" onClick={() => ViewMember(d.id)}>
                                                                    View
                                                                </button>
                                                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full ml-1" onClick={() => DeleteMember(d.id)}>
                                                                    Delete
                                                                </button>
                                                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full ml-1" onClick={() => UpdateMember(d.id)}>
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
                                            breakClassName={"inline-block px-3 py-1 border border-gray-300 bg-white text-black-700 hover:bg-blue-200"}
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

export default UserReferenceTable;
