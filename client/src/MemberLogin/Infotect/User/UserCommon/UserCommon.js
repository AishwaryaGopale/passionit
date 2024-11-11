
import React, { useState, useEffect } from "react";
import { Link, useNavigate, Outlet } from 'react-router-dom';
import logo from './Logo/logo.png';
import { Bars3Icon } from "@heroicons/react/24/outline";
import { FiAlignJustify } from "react-icons/fi";
import axios from "axios";
import * as API from "./../../../../Endpoint/endpoint";
import Recruit from "../Chatbot/chatbot";

const UserCommon = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const navigate = useNavigate();
const [memberName,setMemberName]=useState("")


  useEffect(() => {
    const userId = sessionStorage.getItem("user_id");
if(userId){
  axios.get(API.GET_GETMEMBER_API(userId)).then((resp)=>setMemberName(resp.data.member_name))
}

  }, []);
 

  const handleToggleMenu = () => {
    setToggleMenu(!toggleMenu);
  };

  const handleLinkClick = () => {
    setToggleMenu(false);
  };

  const dropdownOptions = [
    { label: "About Us", to: " " },
    { label: "Ideation", to: "ideation" },
    { label: "Member View", to: "memberviewscard" },
    { label: "Research", to: "research" },
    { label: "Opportunity", to: "oppo" },
    { label: "Reference", to: "refrencetable" },
    { label: "Group", to: "group" },
    { label: "Network", to: "network" },
    { label: "Valueper", to: "valueper" },
    { label: "Edit Profile", to: "profile" },
    {label:"StudentRegLink", to:"studentreglink"},
   
    // { label: "ChatBot", to: "chatbot" },
    {label: "Log-Out", to: "/" },
  ];

  return (
    <>
      <header className="sticky top-0">
        <nav>
          <div className="backdrop-blur-sm mx-auto max-w-7xl bg-white/30 text-[14px]">
            <div className="flex justify-between mx-auto w-full">
              <div className="flex items-center justify-between my-2 lg:justify-end gap-[40px]">
                <Link to="/">
                  <img src={logo} alt="Logo" className="h-[40px] w-[180px]" />
                </Link>
                {memberName && <div className="text-sm text-gray-600 font-bold">Welcome, {memberName}</div>}
              </div>
              <div className="flex gap-6">
                <div className="hidden lg:flex gap-5 items-center justify-between my-2">
                  <div className="relative">
                    <button onClick={handleToggleMenu} className="flex items-center justify-center h-8 w-8 focus:outline-none">
                      <FiAlignJustify className="h-[40px]"/>Menu
                    </button>
                    {toggleMenu && (
                      <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                          {dropdownOptions.map((option, index) => (
                            <Link key={index} to={option.to} onClick={handleLinkClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">{option.label}</Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center lg:hidden">
                  <button className="h-7" onClick={handleToggleMenu}>
                    <Bars3Icon className="h-7 pr-[15px]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={`fixed z-40 w-full backdrop-blur-sm overflow-hidden flex flex-col lg:hidden gap-12 ${toggleMenu ? "h-auto" : "h-0"}`}>
            <div className="px-8 text-center">
              <div className="flex flex-col gap-8 font-bold overflow-visible tracking-wider pt-4 pb-4">
                {dropdownOptions.map((option, index) => (
                  <Link key={index} to={option.to} onClick={handleLinkClick}>{option.label}</Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        <hr className="border border-[gray]" />
        <div>
          {/* Define your Links here */}
          <Link to="viewmember"></Link>
          <Link to="addmember"></Link>
          <Link to="updatemember"></Link>

          <Link to="membership"></Link>
          <Link to="viewmembership"></Link>
          <Link to="addmembership"></Link>
          <Link to="updatemembership"></Link>

          <Link to="oppo"></Link>
          <Link to="viewoppo"></Link>
          <Link to="addoppo"></Link>
          <Link to="updateoppo"></Link>

          <Link to="allo"></Link>
          <Link to="viewallo"></Link>
          <Link to="addallo"></Link>
          <Link to="updateallo"></Link>

          <Link to="inter"></Link>
          <Link to="viewinter"></Link>
          <Link to="addinter"></Link>
          <Link to="updateintern"></Link>
          {/* <Link to="joingroup" ></Link> */}
         
          <Link to="valueper"></Link>
          <Link to="addvalue"></Link>
         
          <Link to="studentreglink"></Link>
         
        </div>
      </header>

      <div className="fixed bottom-4 right-4">
          <Recruit />
        </div>

      <Outlet /> {/* Render child routes */}
    </>
  );
}

export default UserCommon;


