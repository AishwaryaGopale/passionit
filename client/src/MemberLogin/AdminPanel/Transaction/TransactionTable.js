import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import * as API from "./../../../Endpoint/endpoint";

const TransactionTable = () => {
    const [transactions, setTransactions] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 5;

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        axios({
            url: API.GET_TRANSACTION_API,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => {
            setTransactions(res.data);
        }).catch((err) => {
            alert("Failure: " + err);
        });
    };

    const DeleteTransaction = (id) => {
        axios({
            url: API.DELETE_TRANSACTION_API(id),
            method: 'DELETE',
        }).then((res) => {
            alert("Deleted transaction successfully");
            getData();
        }).catch((err) => {
            alert("Error: " + err);
        });
    };

    const handledashboard = () => {
        navigate("/admin/dashboard");
    };

    const navigate = useNavigate();

    const ViewTransaction = (transactionid) => {
        navigate(`/admin/viewtransaction/${transactionid}`);
    };

    const AddTransaction = () => {
        navigate("/admin/addtransaction");
    };

    const UpdateTransaction = (transactionid) => {
        navigate(`/admin/transactionupdate/${transactionid}`);
    };

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * itemsPerPage;

    const filteredTransactions = transactions.filter(transaction => 
        transaction.transactionid.toString().includes(searchTerm.toLowerCase()) ||
        transaction.member_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.vouchercode.toLowerCase().includes(searchTerm.toLowerCase())

    );

    const currentPageData = filteredTransactions.slice(offset, offset + itemsPerPage);

    // Highlight the search term in the displayed text
    const highlightText = (text, term) => {
        if (!term) return text;
        const parts = text.split(new RegExp(`(${term})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === term.toLowerCase() ? (
                <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span>
            ) : part
        );
    };

    return (
        <div className='bg-[#B5B5B5] h-[auto] pb-20 pt-10'>
            <div className='p-4'>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-full flex justify-center items-center mx-auto" onClick={AddTransaction}>
                    Fill Transaction
                </button>
            </div>

            <div className='p-4'>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-full flex justify-center items-center mx-auto" onClick={handledashboard}>
                    Dashboard
                </button>
            </div>

            {/* Search box */}
            <div className="max-w-4xl mx-auto pt-4">
                <input
                    type="text"
                    placeholder="Search transactions..."
                    className="w-full px-3 py-2 mb-4 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="max-w-4xl mx-auto pt-[30px]">
                <div className="flex flex-col">
                    <div className="overflow-x-auto shadow-md sm:rounded-lg">
                        <div className="inline-block min-w-full align-middle">
                            <div className="overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700">
                                    <thead className="bg-white dark:bg-white font-bold text-black">
                                        <tr>
                                            <th scope="col" className="py-3 px-6 text-xs tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">
                                                Id
                                            </th>
                                            <th scope="col" className="py-3 px-6 text-xs tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">
                                                Member Name
                                            </th>
                                            <th scope="col" className="py-3 px-6 text-xs tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">
                                                Voucher Code
                                            </th>
                                            <th scope="col" className="py-3 px-6 text-xs tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                        {
                                            currentPageData.map((transaction, index) => (
                                                <tr className="hover:bg-gray-100 dark:hover:bg-gray-700" key={index}>
                                                    <td className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">
                                                        {highlightText(transaction.transactionid.toString(), searchTerm)}
                                                    </td>
                                                    <td className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">
                                                        {highlightText(transaction.member_name, searchTerm)}
                                                    </td>
                                                    <td className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">
                                                        {highlightText(transaction.vouchercode, searchTerm)}
                                                    </td>
                                                    <td className="py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-400">
                                                        <div className='inline pr-[3px]'>
                                                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-full" onClick={() => ViewTransaction(transaction.transactionid)}>
                                                                View
                                                            </button>
                                                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full ml-1" onClick={() => DeleteTransaction(transaction.transactionid)}>
                                                                Delete
                                                            </button>
                                                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full ml-1" onClick={() => UpdateTransaction(transaction.transactionid)}>
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
                                        pageCount={Math.ceil(filteredTransactions.length / itemsPerPage)}
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
    );
};

export default TransactionTable;
