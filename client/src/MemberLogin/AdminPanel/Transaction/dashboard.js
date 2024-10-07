import React from 'react';
import { useNavigate } from 'react-router-dom';
import transactionimage from './transactionimage.png'; // Ensure correct image path

const Dashboard = () => {
    const navigate = useNavigate();

    const GoBack = () => {
        navigate("/admin/transaction");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {/* Centered Heading */}
            <h1 className="text-3xl font-bold mb-6">Welcome to Dashboard</h1>

            {/* Card structure for the image */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden w-60 mx-auto my-4">
                <a href="https://lookerstudio.google.com/s/q7sj023e3IM" target="_blank" rel="noopener noreferrer">
                    <img
                        className="w-full h-40 object-cover"
                        src={transactionimage}
                        alt="Dashboard"
                    />
                </a>
                <div className="p-4">
                    <p className="text-center text-sm font-medium text-gray-700">
                     Transaction Dashboard 
                    </p>
                </div>
            </div>

            {/* Centered Go Back Button */}
            <div className="mt-6">
                <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => GoBack()}
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
