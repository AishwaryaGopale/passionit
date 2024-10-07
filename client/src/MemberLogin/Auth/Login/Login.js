import React, {useState } from 'react';
import login from './loginimg.png';
import { useNavigate } from 'react-router-dom';
import * as API from "./../../../Endpoint/endpoint";

const Login = () => {
  const navigate = useNavigate();
  // const txtuser = useRef();
  // const txtpassword = useRef();
  const [alertMessage, setAlertMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [member_email, setmember_email] = useState("");
  const [member_password, setmember_password] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // const LoginMember = (e) => {
  //   e.preventDefault();
  //   var u = txtuser.current.value;
  //   var p = txtpassword.current.value;

  //   if (!u) {
  //     setAlertMessage("Please enter Email");
  //   } else if (!p) {
  //     setAlertMessage("Please enter Password");
  //   } else if (u === "hemant" && p === "hemant") {
  //     navigate("/admin/");
  //   } else {
  //     const student = {
  //       member_email: txtuser.current.value,
  //       member_password: txtpassword.current.value,
  //     };

  //     axios({
  //       url: API.POST_LOGIN_API,
  //       method: 'POST',
  //       data: student,
  //       contentType: "application/json"
  //     })
  //       .then((res) => {
  //         sessionStorage.setItem("user_id", res.data.id);
  //         sessionStorage.setItem("token", res.data.token); // Store user_name in sessionStorage
          
  //         navigate("/user");
  //         console.log(res.data.id);
  //         console.log(res.data.token);
  //       })
  //       .catch((error) => {
  //         setAlertMessage("Check your Membership plan or your credentials");
  //       });
  //   }
  // };

  const LoginMember = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API.POST_LOGIN_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ member_email, member_password }),
      });
      const data = await response.json();

      if (response.ok) {
        // Check if the user is verified
        if (data) {
          sessionStorage.setItem("token", data.token);
          sessionStorage.setItem('isAdmin', data.isAdmin); // Save admin status
          sessionStorage.setItem("user_id", data.MemberId);
          if (data.isAdmin) {
            navigate("/admin"); // Redirect to admin page
          } else {
            navigate("/user"); // Redirect to user home page
          }
        } else {
          alert("Your account is not verified. Please check your email for verification.");
        }
      } else {
        alert("Login failed: " + data.message);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred");
    }
  };

  const Reg = () => {
    navigate("register");
  };

  const handleForgetPassword = () => {
    console.log("Navigating to forget-password");
    navigate('/user/forget-password'); // Navigate to the forget password page
  };

  return (
    <>
      <div className="grid w-full h-screen grid-cols-1 sm:grid-cols-2">
        <div className='hidden sm:block'>
          <img className='object-cover w-full h-full' src={login} alt='Login' />
        </div>
        <div className='bg-white flex flex-col justify-center'>
          <form className='max-w-[400px] w-full mx-auto p-8 px-8 rounded-lg'>
            <h2 className='text-4xl dark:text-white font-bold text-center py-[40px]'>Sign in</h2>

            {alertMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{alertMessage}</span>
                <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                  <svg onClick={() => setAlertMessage(null)} className="fill-current h-6 w-6 text-red-500 cursor-pointer" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <title>Close</title>
                    <path fillRule="evenodd" d="M14.348 5.652a.5.5 0 0 1 0 .707l-8.485 8.485a.5.5 0 0 1-.708-.707l8.485-8.485a.5.5 0 0 1 .707 0z" />
                    <path fillRule="evenodd" d="M5.652 5.652a.5.5 0 0 0-.707 0l-4.95 4.95a.5.5 0 0 0 0 .707l4.95 4.95a.5.5 0 0 0 .707-.707l-4.243-4.243a1.5 1.5 0 0 1 0-2.122l4.243-4.243a.5.5 0 0 0 0-.707z" />
                  </svg>
                </span>
              </div>
            )}

             <div className='flex flex-col py-2'>
              <label htmlFor="email" className="block text-lg font-medium">Email</label>
              <input
                className='mt-1 p-2 w-full border border-gray-400 rounded-md'
                type='email'
                value={member_email}
                onChange={(e) => setmember_email(e.target.value)}
                required
              />
            </div>
            <div className='flex flex-col py-2'>
              <div className="relative">
               <label htmlFor="password" className="block text-lg font-medium">Password</label>
              <input
                className='mt-1 p-2 w-full border border-gray-400 rounded-md'
                type='password'
                value={member_password}
                onChange={(e) => setmember_password(e.target.value)}
                required
              />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={togglePasswordVisibility}>
                  {showPassword ? (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 01-6 0 3 3 0 016 0zm1.29-7.29a1 1 0 010 1.42l-1.42 1.42A9.973 9.973 0 0112 4c-2.56 0-4.89.97-6.71 2.71L3.88 6.29a1 1 0 00-1.42 1.42l1.42 1.42A9.973 9.973 0 004 12c0 2.56.97 4.89 2.71 6.71L4.29 20.29a1 1 0 001.42 1.42l1.42-1.42A9.973 9.973 0 0012 20c2.56 0 4.89-.97 6.71-2.71l1.42 1.42a1 1 0 001.42-1.42l-1.42-1.42A9.973 9.973 0 0020 12c0-2.56-.97-4.89-2.71-6.71l1.42-1.42a1 1 0 00-1.42-1.42l-1.42 1.42A9.973 9.973 0 0012 4c-2.56 0-4.89.97-6.71 2.71L4.29 6.29a1 1 0 00-1.42 1.42l1.42 1.42A9.973 9.973 0 004 12c0 2.56.97 4.89 2.71 6.71L4.29 20.29a1 1 0 101.42 1.42l1.42-1.42A9.973 9.973 0 0012 20c2.56 0 4.89-.97 6.71-2.71l1.42 1.42a1 1 0 001.42-1.42l-1.42-1.42A9.973 9.973 0 0020 12c0-2.56-.97-4.89-2.71-6.71l1.42-1.42a1 1 0 00-1.42-1.42l-1.42 1.42A9.973 9.973 0 0012 4c-2.56 0-4.89.97-6.71 2.71L4.29 6.29a1 1 0 00-1.42 1.42l1.42 1.42A9.973 9.973 0 004 12c0 2.56.97 4.89 2.71 6.71L4.29 20.29a1 1 0 001.42 1.42l1.42-1.42A9.973 9.973 0 0012 20c2.56 0 4.89-.97 6.71-2.71l1.42 1.42a1 1 0 001.42-1.42l-1.42-1.42A9.973 9.973 0 0020 12c0-2.56-.97-4.89-2.71-6.71l1.42-1.42a1 1 0 00-1.42-1.42l-1.42 1.42A9.973 9.973 0 0012 4c-2.56 0-4.89.97-6.71 2.71L4.29 6.29a1 1 0 00-1.42 1.42l1.42 1.42A9.973 9.973 0 004 12c0 2.56.97 4.89 2.71 6.71L4.29 20.29a1 1 0 001.42 1.42l1.42-1.42A9.973 9.973 0 0012 20c2.56 0 4.89-.97 6.71-2.71l1.42 1.42a1 1 0 001.42-1.42l-1.42-1.42A9.973 9.973 0 0020 12c0-2.56-.97-4.89-2.71-6.71l1.42-1.42a1 1 0 00-1.42-1.42zM12 5a7 7 0 100 14 7 7 0 000-14z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 01-6 0 3 3 0 016 0zm1.29-7.29a1 1 0 010 1.42l-1.42 1.42A9.973 9.973 0 0112 4c-2.56 0-4.89.97-6.71 2.71L3.88 6.29a1 1 0 00-1.42 1.42l1.42 1.42A9.973 9.973 0 004 12c0 2.56.97 4.89 2.71 6.71L4.29 20.29a1 1 0 001.42 1.42l1.42-1.42A9.973 9.973 0 0012 20c2.56 0 4.89-.97 6.71-2.71l1.42 1.42a1 1 0 001.42-1.42l-1.42-1.42A9.973 9.973 0 0020 12c0-2.56-.97-4.89-2.71-6.71l1.42-1.42a1 1 0 00-1.42-1.42z" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
            <button className="w-full py-2 my-5 font-semibold text-white bg-red rounded-md shadow-md bg-[#c51e1e] focus:outline-none focus:ring focus:border-teal-700" onClick={LoginMember}>Login</button>
            <div className="text-center">
              <button onClick={handleForgetPassword} className="text-blue-500">Forgot Password?</button>
            </div>
            <div className="md:w-2/1 pl-[55px] font-Manrope font-semibold pt-[30px]  p-4">
              <span>
                <div className='inline text-gray'>Not a Member yet? </div>
                <div className='text-[#D62102] inline'>
                  <button onClick={Reg}>Sign Up</button>
                </div>
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
