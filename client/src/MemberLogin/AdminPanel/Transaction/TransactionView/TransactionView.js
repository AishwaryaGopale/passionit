import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import * as API from "../../../../Endpoint/endpoint";

const TransactionView = () => {
  const [transaction, setTransaction] = useState(null);
  const {transactionid}=useParams();
  
  useEffect(() => {
    const getTransaction = () => {
      axios({
        url: API.GET_TRANSACTION_BYID(transactionid),
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        setTransaction(res.data);
      }).catch((error) => {
        console.error('Error fetching transaction:', error);
      });
    };
    if (transactionid) {
      getTransaction(transactionid);
    }
  }, []);

  const navigate = useNavigate();

  const deleteTransaction = (transactionid) => {
    axios({
      url: API.DELETE_TRANSACTION_API(transactionid),
      method: 'DELETE',
    }).then(() => {
      alert("Deleted transaction successfully");
      navigate("/admin");
    }).catch(() => {
      alert("Error deleting transaction");
    });
  };

  const goBack = () => {
    navigate("/admin/transaction");
  };

  return (
    <div className="py-16 bg-[#d6d6d5] h-full">
      <div className="container px-6 m-auto text-gray-500 md:px-12 xl:px-0">
        <div className="grid gap-6 mx-auto md:w-3/6 lg:w-full lg:grid-cols-1">
          <div className="bg-white rounded-2xl shadow-xl px-8 py-12 sm:px-12 lg:px-8">
            <div className="mb-12 space-y-4">
              {transaction && (
                <div>
                  <h5 className="text-xl font-small text-red-700">Transaction Id: {transaction.transactionid}</h5>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <div className="flex flex-col">
                      <span className="font-bold">Voucher Code:</span>
                      <span>{transaction.vouchercode}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Date:</span>
                      <span>{new Date(transaction.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Member Name:</span>
                      <span>{transaction.member_name}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Member Category:</span>
                      <span>{transaction.membercategory}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Member Type</span>
                      <span>{transaction.membertype}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Designation</span>
                      <span>{transaction.designation}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Transaction Type:</span>
                      <span>{transaction.transactiontype}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Opportunity Name:</span>
                      <span>{transaction.opportunity_name}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Opportunity Type</span>
                      <span>{transaction.opportunity_work_type}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Order Value:</span>
                      <span>{transaction.ordervalue}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Percentage</span>
                      <span>{transaction.percentage}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Reference Member:</span>
                      <span>{transaction.referencemember}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Amount:</span>
                      <span>{transaction.amount}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Currency:</span>
                      <span>{transaction.currency}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Credit Days:</span>
                      <span>{transaction.creditdays}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Payment Status:</span>
                      <span>{transaction.paymentstatus}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Bank Name</span>
                      <span>{transaction.bankname}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Account Holder Name</span>
                      <span>{transaction.accountholder}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Account Number:</span>
                      <span>{transaction.accountnum}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">IFSC Code:</span>
                      <span>{transaction.ifsccode}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center p-4">
                    <button
                      className="bg-red-500 text-white hover:bg-red-700 font-bold py-2 px-4 rounded-full"
                      onClick={() => deleteTransaction(transaction.id)}
                    >
                      Delete
                    </button>
                    <div className="flex items-center justify-center p-3">
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
                        onClick={goBack}
                      >
                        &#8592; Go Back
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionView;
