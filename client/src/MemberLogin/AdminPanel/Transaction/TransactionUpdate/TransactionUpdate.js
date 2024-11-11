import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import * as API from './../../../../Endpoint/endpoint';

const TransactionUpdate = () => {
    const [transaction, setTransaction] = useState({
        transactionid: '',
        vouchercode: '',
        date: '',
        member_name: '',
        membercategory: '',
        membertype: '',
        designation: '',
        transactiontype: '',
        ordervalue: '',
        opportunity_name: '',
        opportunity_work_type: '',
        referencemember: '',
        amount: '',
        currency: '',
        creditdays: '',
        paymentstatus: '',
        accountnum: '',
        ifsccode: '',
        percentage: '',
        bankname: '',
        accountholder: ''
    });

    const navigate = useNavigate();
    const {transactionid} =useParams();
    useEffect(() => {
        fetchTransactionData();
    }, []);

    const fetchTransactionData = () => {
        axios({
            url: API.GET_TRANSACTION_BYID(transactionid),
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => {
            setTransaction(res.data[0]);
        }).catch((err) => {
            alert("Error fetching transaction data: " + err);
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTransaction({ ...transaction, [name]: value });
    };

const updateTransaction = async (e) => {
    e.preventDefault();
    console.log("Updating transaction with data: ", transaction); // Debugging log
    try {
      const res = await axios.put(API.PUT_TRANSACTION_API(transactionid), transaction, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      alert("Transaction updated successfully");
      navigate('/admin/transaction');
    } catch (err) {
      alert("Error updating transation: " + err);
      console.error("Update error: ", err);
    }
  };

    const GoBack = () => {
        navigate("/admin/transaction");
      };

    return (
        <div className='bg-[#B5B5B5] h-[auto] pb-20 pt-10'>
            <div className="max-w-4xl mx-auto pt-10">
                <form onSubmit={updateTransaction} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    {/* Voucher Code */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Voucher Code</label>
                        <input 
                            type="text"
                            name="vouchercode"
                            value={transaction.vouchercode}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    {/* Date */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={transaction.date}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    {/* Member Name */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Member Name</label>
                        <input
                            type="text"
                            name="member_name"
                            value={transaction.member_name}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    {/* Member Category */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Member Category</label>
                        <input
                            type="text"
                            name="member_category"
                            value={transaction.membercategory}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    {/* Member Type */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Member Type</label>
                        <input
                            type="text"
                            name="member_type"
                            value={transaction.membertype}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    {/* Designation */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Designation</label>
                        <input
                            type="text"
                            name="designation"
                            value={transaction.designation}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    {/* Transaction Type */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Transaction Type</label>
                        <input 
                            type="text"
                            name="transaction_type"
                            value={transaction.transactiontype}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    {/* Order Value */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Order Value</label>
                        <input 
                            type="number"
                            name="order_value"
                            value={transaction.ordervalue}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    {/* Opportunity Name */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Opportunity Name</label>
                        <input 
                            type="text"
                            name="opportunity_name"
                            value={transaction.opportunity_name}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    {/* Opportunity Type */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Opportunity Type</label>
                        <input 
                            type="text"
                            name="opportunity_type"
                            value={transaction.opportunity_work_type}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    {/* Reference Member */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Reference Member</label>
                        <input 
                            type="text"
                            name="reference_member"
                            value={transaction.referencemember}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    {/* Amount */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Amount</label>
                        <input 
                            type="number"
                            name="amount"
                            value={transaction.amount}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    {/* Currency */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Currency</label>
                        <input 
                            type="text"
                            name="currency"
                            value={transaction.currency}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    {/* Credit Days */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Credit Days</label>
                        <input 
                            type="number"
                            name="credit_days"
                            value={transaction.creditdays}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    {/* Payment Status */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Payment Status</label>
                        <input 
                            type="text"
                            name="payment_status"
                            value={transaction.paymentstatus}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    {/* Account Number */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Account Number</label>
                        <input 
                            type="text"
                            name="account_number"
                            value={transaction.accountnum}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                                       {/* IFSC Code */}
                                       <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">IFSC Code</label>
                        <input 
                            type="text"
                            name="ifsc_code"
                            value={transaction.ifsccode}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Update Transaction
                        </button>

                        <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"
            onClick={GoBack}
          >
            Go Back
          </button>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionUpdate;

