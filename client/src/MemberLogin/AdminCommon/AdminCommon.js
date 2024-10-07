import { useState,useEffect } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { Link, Outlet } from 'react-router-dom';
import logo from './logo.png';

const AdminCommon = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
 
const userId =sessionStorage.getItem("user_id");

console.log(userId)
  return (
    <>
      <div className="sticky top-0 bg-[#FFFFFF]">
        <nav>
          <div className="mx-auto max-w-7xl">
            <div className="flex justify-between mx-auto w-5/5">
              <div className="flex items-center justify-between my-2 lg:justify-end lg:gap-[100px]">
                <Link to="">
                  <img src={logo} alt="logo" className="h-[40px] w-[100px]" />
                </Link>
                <div className="hidden gap-10 lg:flex">
                  <Link to="" className="text-sm">Members</Link>
                  <Link to="studenttable" className="text-sm">Ideation</Link>
                  <Link to="resarchtable" className="text-sm">Research</Link>
                  <Link to="membership" className="text-sm">Membership</Link>
                  <Link to="intoppo" className="text-sm">Expression of Interest</Link>
                  <Link to="oppo" className="text-sm">Opportunity</Link>
                  <Link to="allo" className="text-sm">Allocation</Link>
                  <Link to="inter" className="text-sm">Interview</Link>
                  <Link to="applyed" className="text-sm">Application</Link>
                  <Link to="transaction" className="text-sm">Transaction</Link>
                  <Link to="/" className="text-sm">Log-Out</Link>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="items-center hidden gap-10 xs:flex">
                  <div className="items-center hidden gap-2 lg:flex"></div>
                </div>
                <div className="flex items-center lg:hidden">
                  <button onClick={() => setToggleMenu(!toggleMenu)}>
                    <Bars3Icon className="h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`fixed z-40 w-full bg-gray-100 overflow-hidden flex flex-col lg:hidden gap-12 origin-top duration-700 ${!toggleMenu ? "h-0" : "h-full"}`}>
            <div className="px-8">
              <div className="flex flex-col gap-8 font-bold tracking-wider">
                <Link to="" className="text-sm">Members</Link>
                <Link to="studenttable" className="text-sm">Ideation</Link>
                <Link to="resarchtable" className="text-sm">Research</Link>
                <Link to="membership" className="text-sm">Membership</Link>
                <Link to="intoppo" className="text-sm">Expression of Interest</Link>
                <Link to="oppo" className="text-sm">Opportunity</Link>
                <Link to="allo" className="text-sm">Opportunity Allocation</Link>
                <Link to="inter" className="text-sm">Interview</Link>
                <Link to="applyed" className="text-sm">Application</Link>
                <Link to="transaction" className="text-sm">Transaction</Link>
                <Link to="/" className="text-sm">Log-Out</Link>

              </div>
            </div>
          </div>
        </nav>
        <hr className="border border-[#9b9b9b]" />
      </div>

      <div>
        <Outlet />
      </div>
    </>
  );
};

export default AdminCommon;
