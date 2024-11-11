import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as API from "./../../../..//Endpoint/endpoint"; 
import axios from 'axios';

const StudentRegistration = () => {
  const [formData, setFormData] = useState({
    userid: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(API.POST_AUTHENTICATE_API, {
        member_email: formData.userid, // Ensure you use member_email
        member_password: formData.password,
      });

      console.log('Response status:', response.status);
      console.log('Response data:', response.data);

      if (response.status === 200) {
        navigate('/user/updateregpass');
      } else {
        setErrorMessage(response.data.message || 'Incorrect password or User ID');
      }
    } catch (error) {
      console.error('Error during login:', error);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || 'An error occurred. Please try again.');
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    }
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Student Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="userid">
              User ID
            </label>
            <input
              type="text"
              name="userid"
              id="userid"
              value={formData.userid}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {errorMessage && (
            <div className="text-red-500 mb-4">{errorMessage}</div>
          )}

          <button
            className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-200"
            type="submit"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentRegistration;
